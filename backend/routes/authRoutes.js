const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDb } = require('../mongo');
const { createUser, findUserByEmail } = require('../models/User');
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

// Protected route
router.get('/me', authMiddleware, catchAsyncErrors(async (req, res) => {
    const db = getDb();
    const user = await db.collection('users').findOne(
        { _id: new ObjectId(req.user.userId) },
        { projection: { password: 0 } }
    );
    res.json(user);
}));

module.exports = router;