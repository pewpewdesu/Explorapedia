const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDb } = require('../mongo');
const { createUser, findUserByEmail, findUserById, addFriend, getFriends } = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const catchAsyncErrors = require('../middleware/errorHandler');

// Register
router.post('/register', catchAsyncErrors(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date()
    });

    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(201).json({ token, userId });
}));

// Login
router.post('/login', catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token, userId: user._id });
}));

// Protected route - Get current user
router.get('/me', authMiddleware, catchAsyncErrors(async (req, res) => {
    const db = getDb();
    const user = await db.collection('users').findOne(
        { _id: new ObjectId(req.user.userId) },
        { projection: { password: 0 } }
    );
    res.json(user);
}));

// Search for a user by email
router.get('/search/:email', authMiddleware, catchAsyncErrors(async (req, res) => {
    const { email } = req.params;
    const userId = req.user.userId;

    if (!email || email.trim() === '') {
        return res.status(400).json({ message: 'Email is required' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Don't return the user's own data
    if (user._id.toString() === userId.toString()) {
        return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }

    // Check if already friends
    const currentUser = await findUserById(userId);
    const isAlreadyFriend = currentUser?.friends?.some(f => f.toString() === user._id.toString());

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAlreadyFriend
    });
}));

// Add a friend
router.post('/friends/add', authMiddleware, catchAsyncErrors(async (req, res) => {
    const { email } = req.body;
    const userId = req.user.userId;

    if (!email || email.trim() === '') {
        return res.status(400).json({ message: 'Email is required' });
    }

    const friendUser = await findUserByEmail(email);

    if (!friendUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (friendUser._id.toString() === userId.toString()) {
        return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }

    // Add friend
    const result = await addFriend(userId, friendUser._id);

    if (!result) {
        return res.status(400).json({ message: 'Already friends' });
    }

    res.json({
        message: 'Friend added successfully',
        friend: {
            _id: friendUser._id,
            username: friendUser.username,
            email: friendUser.email
        }
    });
}));

// Get friends list
router.get('/friends/list', authMiddleware, catchAsyncErrors(async (req, res) => {
    const userId = req.user.userId;
    const friends = await getFriends(userId);
    res.json(friends);
}));

module.exports = router;