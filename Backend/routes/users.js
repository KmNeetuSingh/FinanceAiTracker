const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../model/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Update user profile (name/email)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // If email is changing, ensure not used by another user
    if (email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    req.user.name = name;
    req.user.email = email;
    const saved = await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: { id: saved._id, name: saved.name, email: saved.email }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

module.exports = router;