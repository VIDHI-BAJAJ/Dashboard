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
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.REA_EMAIL_USER,
    pass: process.env.REA_EMAIL_APP_PASS,
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
        await createTransporter().sendMail({
          from: `"Harbour AI" <${process.env.REA_EMAIL_USER}>`,
          to: user.email,
          subject: 'Welcome to Harbour AI 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f5f5fb; padding: 32px; border-radius: 16px;">
              <div style="background: linear-gradient(to right, #0f4c8a, #1e6fd9); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Harbour AI</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Your real estate CRM is ready</p>
              </div>
              <div style="background: white; border-radius: 12px; padding: 28px; margin-bottom: 16px;">
                <p style="color: #374151; font-size: 15px; margin: 0 0 12px;">Hi <strong>${user.name}</strong> 👋</p>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                  Your Harbour AI account has been successfully created. You can now log in and start managing your leads, deals, and follow-ups — all in one place.
                </p>
                <div style="background: #f5f5fb; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                  <p style="margin: 0; font-size: 13px; color: #6b7280;">Account details</p>
                  <p style="margin: 6px 0 0; font-size: 14px; color: #111827;"><strong>Name:</strong> ${user.name}</p>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #111827;"><strong>Email:</strong> ${user.email}</p>
                </div>
                <a href="${process.env.CLIENT_URL}/login"
                  style="display: inline-block; background: #004f98; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                  Log In to Dashboard →
                </a>
              </div>
              <p style="text-align: center; color: #9ca3af; font-size: 12px; margin: 0;">
                If you didn't create this account, please ignore this email.
              </p>
            </div>
          `,
        });
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

    await createTransporter().sendMail({
      from: `"Harbour AI" <${process.env.REA_EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset your Harbour AI password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f5f5fb; padding: 32px; border-radius: 16px;">
          <div style="background: linear-gradient(to right, #0f4c8a, #1e6fd9); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Reset Your Password</h1>
          </div>
          <div style="background: white; border-radius: 12px; padding: 28px; margin-bottom: 16px;">
            <p style="color: #374151; font-size: 15px; margin: 0 0 12px;">Hi <strong>${user.name}</strong>,</p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
              Click the button below to reset your password. This link expires in <strong>1 hour</strong>.
            </p>
            <a href="${resetUrl}"
              style="display: inline-block; background: #004f98; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
              Reset Password →
            </a>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
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