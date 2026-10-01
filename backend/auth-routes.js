
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./user-model');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate user input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        message: 'Name must be at least 2 characters'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Invalid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Check whether email is already registered
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    // Encrypt password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
}
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});
module.exports = router;