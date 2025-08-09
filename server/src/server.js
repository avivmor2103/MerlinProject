const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const { stopAllJobs } = require('./services/cronService');
const TrackedProfile = require('./models/TrackedProfile');
const { startTrackingProfile } = require('./services/cronService');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5002',
    credentials: true
}));

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Start tracking all existing profiles
        const profiles = await TrackedProfile.find({});
        for (const profile of profiles) {
            await startTrackingProfile(profile._id);
        }
    })
    .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Start server
const server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    stopAllJobs();
    server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
}); 