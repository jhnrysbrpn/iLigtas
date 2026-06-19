const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const validate = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../schemas/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// Signup Route
router.post('/signup', validate(signupSchema), async (req, res) => {
  try {
    const {
      email,
      username,
      phone,
      password,
      name,
      requestedRole,
      department,
      departmentId,
      dataConsentAccepted,
      dataConsentSignature
    } = req.validatedBody;

    // Check if email or username is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.username.toLowerCase() === username.toLowerCase() ? 'username' : 'email';
      return res.status(400).json({
        status: 'error',
        message: `A user with this ${field} already exists`
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
        username: username.toLowerCase(),
        phone,
        password: hashedPassword,
        name,
        role: 'Resident', // Everyone starts as Resident initially until approved by admin
        requestedRole: isElevated ? requestedRole : null,
        department: isElevated ? department : null,
        departmentId: isElevated ? departmentId : null,
        dataConsentAccepted,
        dataConsentSignature,
        dataConsentSignedAt: new Date(),
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

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid username or password'
      });
    }

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
