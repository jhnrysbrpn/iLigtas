const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../schemas/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';
const failedLogins = new Map();
const idempotencyKeys = new Map();
const LOCKOUT_LIMIT = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const IDEMPOTENCY_MS = 60 * 1000;

function cleanupIdempotencyKeys() {
  const now = Date.now();
  for (const [key, createdAt] of idempotencyKeys.entries()) {
    if (now - createdAt > IDEMPOTENCY_MS) idempotencyKeys.delete(key);
  }
}

function enforceIdempotency(req, res, next) {
  const key = req.get('Idempotency-Key') || req.get('X-Idempotency-Key');
  if (!key) return next();

  cleanupIdempotencyKeys();
  if (idempotencyKeys.has(key)) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate submission blocked. Please wait before retrying.'
    });
  }
  idempotencyKeys.set(key, Date.now());
  next();
}

// Signup Route
router.post('/signup', enforceIdempotency, validate(signupSchema), async (req, res) => {
  try {
    const { email, username, phone, password, name, requestedRole, department, departmentId } = req.validatedBody;

    // Check if email, username, or phone is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
          { phone }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'username' : existingUser.email === email ? 'email' : 'phone';
      return res.status(400).json({
        status: 'error',
        message: `A user with this ${field} is already registered. Sign in instead?`
      });
    }

    // Determine initial approval (Residents auto-approved, others require admin approval)
    const isElevated = !!requestedRole && requestedRole !== 'Resident';
    const approved = !isElevated;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save to Database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        phone,
        password: hashedPassword,
        name,
        role: 'Resident', // Everyone starts as Resident initially until approved by admin
        requestedRole: isElevated ? requestedRole : null,
        department: isElevated ? department : null,
        departmentId: isElevated ? departmentId : null,
        approved
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          approved: user.approved
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
});

// Login Route
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.validatedBody;
    const attemptKey = username;
    const attempt = failedLogins.get(attemptKey);
    if (attempt?.lockedUntil && attempt.lockedUntil > Date.now()) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many failed attempts. Try again after 15 minutes.'
      });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      const nextCount = (attempt?.count || 0) + 1;
      failedLogins.set(attemptKey, {
        count: nextCount,
        lockedUntil: nextCount >= LOCKOUT_LIMIT ? Date.now() + LOCKOUT_MS : null
      });
      return res.status(400).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const nextCount = (attempt?.count || 0) + 1;
      failedLogins.set(attemptKey, {
        count: nextCount,
        lockedUntil: nextCount >= LOCKOUT_LIMIT ? Date.now() + LOCKOUT_MS : null
      });
      return res.status(400).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }
    failedLogins.delete(attemptKey);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          approved: user.approved
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

module.exports = router;
