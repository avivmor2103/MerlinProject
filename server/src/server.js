const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const { stopAllJobs } = require('./services/cronService');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5002',
    credentials: true
}));

// MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, mongooseOptions)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // Start server only after successful database connection
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
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        console.error('MongoDB URI:', config.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')); // Log URI without credentials
        process.exit(1); // Exit if we can't connect to database
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running',
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
}); 