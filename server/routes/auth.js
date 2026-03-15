const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth.js');

// ─── Helper: generate JWT ───────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_change_in_production', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ─── Helper: reusable transporter ──────────────────────────────────────────
// ─── Helper: Gmail personal transporter (for internal/system use) ───────────
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.REA_EMAIL_USER,
    pass: process.env.REA_EMAIL_APP_PASS,
  },
});

// ─── Helper: Workspace transporter (for sending emails TO users) ─────────────
const createWorkspaceTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.WORKSPACE_EMAIL,
    pass: process.env.WORKSPACE_APP_PASS,
  },
});

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone')
      .notEmpty().withMessage('Phone number is required')
      .matches(/^\+\d{7,15}$/).withMessage('Please enter a valid phone number with country code')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, password, phone } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ message: 'An account with this phone number already exists' });
      }

      const user = await User.create({ name, email, password, phone });
      const token = generateToken(user._id);

      // ── Send welcome email ──
      try {
        console.log("📧 Sending welcome email to:", user.email);
        await createWorkspaceTransporter().sendMail({
          from: `"Harbour AI" <${process.env.WORKSPACE_EMAIL}>`,
          to: user.email,
          subject: 'Welcome to Harbour AI 🎉',
          html: `...same html...`,
        });
        console.log("✅ Welcome email sent!");
      } catch (emailErr) {
        console.error('Welcome email failed (non-blocking):', emailErr.message);
      }

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error, please try again' });
    }
  }
);

// ─── POST /api/auth/login ───────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error, please try again' });
    }
  }
);

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ─── POST /api/auth/logout ──────────────────────────────────────────────────
router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ─── POST /api/auth/forgot-password ────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If this email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await createWorkspaceTransporter().sendMail({
      from: `"Harbour AI" <${process.env.WORKSPACE_EMAIL}>`,
      to: user.email,
      subject: 'Reset your Harbour AI password',
      html: `...same html...`,
    });

    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── POST /api/auth/reset-password ─────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired.' });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;