const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret, accessTokenExpiresIn, refreshTokenExpiresIn } = require('../config/jwt');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    await User.createUser(username, password, role);
    // Auto-login after register
    const user = await User.findUserByUsername(username);
    if (!user) return res.status(500).json({ message: 'Error after registration' });
    // Issue access token (no expiry)
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      accessTokenExpiresIn ? { expiresIn: accessTokenExpiresIn } : undefined
    );
    // Issue refresh token (with expiry)
    const refreshToken = jwt.sign(
      { id: user.id },
      secret,
      { expiresIn: refreshTokenExpiresIn }
    );
    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('Login route hit', req.body);
  const { username, password, role } = req.body;
  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const user = await User.findUserByUsername(username);
    console.log('User.findUserByUsername result', user);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (role && user.role !== role) {
      console.log('Role mismatch', { expected: user.role, got: role });
      return res.status(403).json({ message: 'Role mismatch' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('bcrypt.compare result', isMatch);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // Issue access token (no expiry)
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      accessTokenExpiresIn ? { expiresIn: accessTokenExpiresIn } : undefined
    );
    // Issue refresh token (with expiry)
    const refreshToken = jwt.sign(
      { id: user.id },
      secret,
      { expiresIn: refreshTokenExpiresIn }
    );
    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.log('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  jwt.verify(refreshToken, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    // Issue new access token
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      secret,
      accessTokenExpiresIn ? { expiresIn: accessTokenExpiresIn } : undefined
    );
    res.json({ accessToken });
  });
});

module.exports = router; 