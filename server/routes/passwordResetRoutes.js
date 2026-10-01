// server\routes\passwordResetRoutes.js
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure nodemailer transporter
// Uses Gmail SMTP — requires an App Password (not your normal Gmail password)
// Set EMAIL_USER and EMAIL_PASS in your .env file
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// POST /auth/forgot-password
// Step 1: Check if user exists, generate OTP, and email it
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email domain
    if (!email.endsWith('@kuk.ac.in')) {
      return res.status(400).json({ error: 'Only @kuk.ac.in email addresses are allowed' });
    }

    // ✅ CHECK: Does this email exist in our database?
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ 
        error: 'No account found with this email. Please check and try again, or sign up for a new account.' 
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save hashed OTP and expiry (15 minutes) to user
    user.resetPasswordOTP = await bcrypt.hash(otp, 10);
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save({ validateBeforeSave: false });

    // Send email
    const transporter = createTransporter();
    const mailOptions = {
      from: `"AlumConnect UIET" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - AlumConnect',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">
          <div style="background: white; border-radius: 8px; padding: 30px; text-align: center;">
            <h2 style="color: #1a1a2e; margin-bottom: 8px;">🔐 Password Reset</h2>
            <p style="color: #666; font-size: 14px; margin-bottom: 24px;">
              You requested a password reset for your AlumConnect account.
            </p>
            <div style="background: #f0f4ff; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
              <h1 style="color: #667eea; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 16px;">
              This code expires in <strong>15 minutes</strong>.
            </p>
            <p style="color: #999; font-size: 12px;">
              If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #bbb; font-size: 11px;">AlumConnect — UIET Kurukshetra</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'OTP sent successfully to your email.',
      userFound: true 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process password reset request. Please try again.' });
  }
});

// POST /auth/verify-otp
// Step 2: Verify the OTP and reset the password
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    // ✅ Find user with valid (non-expired) OTP
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' });
    }

    // Verify OTP against the stored hash
    const isOTPValid = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isOTPValid) {
      return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
    }

    // Reset password (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

module.exports = router;
