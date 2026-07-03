// server\routes\authRoutes.js
const express = require("express");
const passport = require("passport");
const User = require('../models/users');
const router = express.Router();
const { ensureInstitutionalEmail } = require('../middleware/roleMiddleware');
const { isAuthenticated } = require('../middleware/isAuthenticated');

// ✅ POST /auth/login
router.post("/login",ensureInstitutionalEmail, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      // ✅ Role validation
      if (req.body.role && req.body.role !== user.role) {
        return res.status(403).json({ error: "Unauthorized role" });
      }

      return res.json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});

// ✅ POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, branch, branchCode, batch } = req.body;

    // Validate email domain
    if (!email.endsWith('@kuk.ac.in')) {
      return res.status(400).json({ error: 'Only @kuk.ac.in email addresses are allowed' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'student',
      branch,
      branchCode,
      batch,
      isActive: true
    });

    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully. Please login.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration' });
  }
});

// ✅ GET /auth/profile
router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ✅ Handle social links properly
  const socialLinks = req.user.socialLinks || {};

  // ✅ Return complete profile
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    dob: req.user.dob,
    branch: req.user.branch,
    currentCompany: req.user.currentCompany,
    currentCompanyRole: req.user.currentCompanyRole,
    location: req.user.location,
    batch: req.user.batch,
    homeTown: req.user.homeTown,
    socialLinks: {
      linkedin: socialLinks.linkedin || null,
      instagram: socialLinks.instagram || null,
      github: socialLinks.github || null,
      x: socialLinks.x || socialLinks.twitter || null,
    },
    personalEmail: req.user.personalEmail,
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin,
  });
});

// // ✅ GET /auth/me → Fetch logged-in user
// router.get("/me", (req, res) => {
//   if (!req.user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   res.json({
//     id: req.user.id,
//     name: req.user.name,
//     email: req.user.email,
//     role: req.user.role,
//   });
// });

// ✅ POST /auth/logout
router.post("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("connect.sid"); // ✅ Clear session cookie
        return res.json({ message: "Logged out successfully" });
      });
    });
  } catch (error) {
    next(error);
  }
});
// In authRoutes.js
router.get('/check', (req, res) => {
  res.json({ 
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    } : null
  });
});
// Google Auth Routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        return res.redirect(`${process.env.VITE_API_BASE_URL}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
      }

      if (!user) {
        let errorMessage = 'Authentication failed.';
        
        // Customize error message based on info
        if (info && info.message) {
          if (info.message.includes('@iiitn.ac.in')) {
            errorMessage = 'Please use your University institute of engineering snd technology kurukshetra email (@kuk.ac.in) to sign in.';
          } else if (info.message.includes('not registered')) {
            errorMessage = 'This email is not registered in our system. Please contact the administrator.';
          }
        }

        return res.redirect(`${process.env.VITE_API_BASE_URL}/login?error=${encodeURIComponent(errorMessage)}`);
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.redirect(`${process.env.VITE_API_BASE_URL}/login?error=${encodeURIComponent('Login failed. Please try again.')}`);
        }

        const role = user.role.toLowerCase();
        const redirectPath = role === 'admin' ? '/admin/announcements' : '/announcements';
        return res.redirect(`${process.env.VITE_API_BASE_URL}${redirectPath}`);
      });
    })(req, res, next);
  }
);

router.get('/debug-auth', (req, res) => {
  // console.log('Debug Auth Route Called');
  // console.log('Session:', req.session);
  // console.log('User:', req.user);
  // console.log('Is Authenticated:', req.isAuthenticated());

  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    } : null,
    sessionDetails: {
      passport: req.session?.passport,
      exists: !!req.session
    }
  });
});
// Protected route
router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});
// Detailed authentication check route
router.get('/check', (req, res) => {
  console.log('===== AUTH CHECK ROUTE =====');
  console.log('Session:', req.session);
  console.log('Passport User:', req.session?.passport?.user);
  console.log('Current User:', req.user);

  res.json({ 
    isAuthenticated: !!req.user,
    user: req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    } : null,
    sessionDetails: {
      passport: req.session?.passport,
      exists: !!req.session
    }
  });
});

module.exports = router;

