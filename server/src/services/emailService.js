const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_APP_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendNewFollowingNotification = async (email, username, newFollowing) => {
    // Validate inputs
    if (!email || !username || !Array.isArray(newFollowing)) {
        throw new Error('Invalid parameters for email notification');
    }

    // Log email configuration (remove in production)
    console.log('Email Configuration:', {
        user: config.EMAIL_USER,
        hasPassword: !!config.EMAIL_APP_PASSWORD
    });

    try {
        const mailOptions = {
            from: config.EMAIL_USER,
            to: email,
            subject: `New Following Alert for ${username}`,
            html: `
                <h2>New Following Detected</h2>
                <p>The Instagram profile <strong>${username}</strong> is now following:</p>
                <ul>
                    ${newFollowing.map(account => `<li>${account}</li>`).join('')}
                </ul>
                <p>This is an automated notification from Merlin InstaTracker.</p>
                <p>Time of detection: ${new Date().toLocaleString()}</p>
            `
        };

        console.log('Attempting to send email to:', email);
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Detailed email error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            stack: error.stack
        });
        throw new Error(`Failed to send email notification: ${error.message}`);
    }
};

module.exports = {
    sendNewFollowingNotification
}; 