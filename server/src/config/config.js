require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5001,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/Merlin',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
    RAPID_API_KEY: process.env.RAPID_API_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD
}; 