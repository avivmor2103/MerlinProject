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

// CORS configuration
const allowedOrigins = [
    'http://localhost:5002',
    'https://merlin-front.onrender.com'  // Your frontend URL
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// MongoDB connection options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, mongooseOptions)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        console.log('CORS configured for origins:', allowedOrigins);
        
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
        console.error('MongoDB URI:', config.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'));
        process.exit(1);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running',
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        corsOrigins: allowedOrigins
    });
}); 