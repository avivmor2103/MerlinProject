const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE
    });
};

exports.register = async (req, res) => {
    console.log("register");
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        console.log(email, password);

        const user = await User.create({
            email,
            password
        });

        const token = generateToken(user._id);
        console.log(token);

        res.status(201).json({
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.login = async (req, res) => {
    console.log("login");
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}; 