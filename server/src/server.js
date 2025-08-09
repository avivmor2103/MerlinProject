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
    'http://localhost:5002', // Local development
    process.env.CLIENT_URL, // Production frontend URL
    'https://merlin-frontend.onrender.com' // Render.com frontend URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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
        // Start server only after successful database connection
        const server = app.listen(config.PORT, () => {
            console.log(`Server is running on port ${config.PORT}`);
            console.log('Allowed CORS origins:', allowedOrigins);
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
        allowedOrigins: allowedOrigins
    });
}); 