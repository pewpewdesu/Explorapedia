require('dotenv').config();
const express = require('express');
const { connectToMongo, getDb } = require('./mongo');
const attractionRoutes = require('./routes/attractionRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();
// parse JSON bodies
app.use(express.json());

//allows requests from frontend
const cors = require('cors')
app.use(cors())

// auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/trips', tripRoutes);

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Explorapedia API is running',
        status: 'ok',
    });
});

app.get('/health', async (req, res) => {
    try {
        await getDb().command({ ping: 1 });
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});

const port = process.env.PORT || 3001;

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
