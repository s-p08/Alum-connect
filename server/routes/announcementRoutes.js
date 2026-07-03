// server/routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../utils/cloudinary');
const Announcement = require('../models/Announcement');
const { ensureRole } = require('../middleware/roleMiddleware');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  }
});

// Custom check to allow student, alumni, or admin
const canCreateAchievement = (req, res, next) => {
  return ensureRole(['student', 'alumni', 'admin'])(req, res, next);
};

// POST /api/announcements/achievement
// Students, Alumni, and Admins can create an achievement; status defaults to 'pending'
router.post('/achievement', canCreateAchievement, upload.single('image'), async (req, res) => {
  try {
    const { title, description, name } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      // Only attempt Cloudinary upload if config exists
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "achievements" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(req.file.buffer);
          });
          imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("❌ Cloudinary Upload Error:", uploadError);
          // Continue without image instead of failing the whole request
        }
      } else {
        console.warn("⚠️ Cloudinary credentials missing in .env. Skipping image upload.");
      }
    }
    
    const newAnnouncement = new Announcement({
      type: 'achievement',
      title,
      description,
      imageUrl,
      name: name || (req.user && req.user.name) || 'Anonymous',
    });
    
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json({ message: 'Achievement created, pending approval', data: savedAnnouncement });
  } catch (err) {
    console.error("❌ Error creating achievement:", err);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

// GET /api/announcements
// Return only approved announcements for normal users
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
