require('dotenv').config();
const express = require('express');
const { connectToMongo, getDb } = require('./mongo');

const app = express();
const port = process.env.PORT || 3001;

app.get('/health', async (req, res) => {
    try {
        await getDb().command({ ping: 1 });
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

async function startServer() {
    await connectToMongo();

    app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});
