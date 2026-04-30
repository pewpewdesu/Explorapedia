const express = require('express');
const router = express.Router();

// Simple test route for auth
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route working' });
});

module.exports = router;
