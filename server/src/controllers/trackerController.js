const TrackedProfile = require('../models/TrackedProfile');
const { fetchInstagramProfile, validateProfile } = require('../services/instagramService');
const { startTrackingProfile, stopTrackingProfile } = require('../services/cronService');

exports.addProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Check if user already tracks 3 profiles
        const userTrackedCount = await TrackedProfile.countDocuments({ user: req.user._id });
        if (userTrackedCount >= 3) {
            return res.status(400).json({
                success: false,
                message: 'You can only track up to 3 profiles'
            });
        }

        // Check if profile is already being tracked
        const existingProfile = await TrackedProfile.findOne({ username });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'This profile is already being tracked'
            });
        }

        // Fetch profile data from Instagram
        const profileData = await fetchInstagramProfile(username);
        
        // Validate profile
        validateProfile(profileData);

        // Create new tracked profile
        const trackedProfile = await TrackedProfile.create({
            username,
            notificationEmail: email,
            isPrivate: profileData.is_private,
            followingCount: profileData.following_count,
            baselineFollowing: profileData.following_list || [],
            user: req.user._id
        });

        // Start cron job for this profile with initial following list
        await startTrackingProfile(trackedProfile._id, profileData.following_list);

        res.status(201).json({
            success: true,
            data: trackedProfile
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getTrackedProfiles = async (req, res) => {
    try {
        const profiles = await TrackedProfile.find({ user: req.user._id });
        
        res.status(200).json({
            success: true,
            data: profiles
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.removeProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const profile = await TrackedProfile.findOneAndDelete({
            _id: id,
            user: req.user._id
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Stop cron job for this profile
        stopTrackingProfile(id);

        res.status(200).json({
            success: true,
            message: 'Profile removed successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 