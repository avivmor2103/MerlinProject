const cron = require('node-cron');
const { fetchInstagramProfile } = require('./instagramService');
const { sendNewFollowingNotification } = require('../services/emailService');
const TrackedProfile = require('../models/TrackedProfile');

// Store active jobs
const activeJobs = new Map();

const startTrackingProfile = async (profileId, initialFollowing = null) => {
    // Check if job already exists
    if (activeJobs.has(profileId)) {
        console.log(`Job already exists for profile ${profileId}`);
        return;
    }

    // Store initial following list in database
    if (initialFollowing) {
        await TrackedProfile.findByIdAndUpdate(profileId, {
            baselineFollowing: initialFollowing,
            lastChecked: new Date()
        });
    }

    // Create cron job - runs every minute in development, every hour in production
    const cronExpression = process.env.NODE_ENV === 'production' ? '0 * * * *' : '* * * * *';
    
    const job = cron.schedule(cronExpression, async () => {
        try {
            // Get profile from database with baseline following list
            const profile = await TrackedProfile.findById(profileId);
            if (!profile) {
                console.error(`Profile ${profileId} not found, stopping job`);
                stopTrackingProfile(profileId);
                return;
            }

            console.log(`Checking following list for profile: ${profile.username}`);

            // Fetch current following list from Instagram
            const currentData = await fetchInstagramProfile(profile.username);
            const currentFollowing = currentData.following_list;
            console.log("Current following list:", currentFollowing);

            // Get baseline following list from database
            const baselineFollowing = profile.baselineFollowing;
            console.log("Baseline following list:", baselineFollowing);

            // Convert baseline to Set for efficient comparison
            const baselineSet = new Set(baselineFollowing);
            
            // Find new followers (in current but not in baseline)
            const newFollowing = currentFollowing.filter(username => !baselineSet.has(username));
            console.log("Newly followed accounts:", newFollowing);

            if (newFollowing.length > 0) {
                console.log(`Found ${newFollowing.length} new following for ${profile.username}`);
                
                // Send email notification about new following
                try {
                    await sendNewFollowingNotification(
                        profile.notificationEmail,
                        profile.username,
                        newFollowing  // Send only the new following accounts
                    );
                    console.log('Email notification sent successfully');
                } catch (emailError) {
                    console.error('Failed to send email notification:', emailError);
                }

                // Update baseline in database with current following list
                await TrackedProfile.findByIdAndUpdate(profileId, {
                    baselineFollowing: currentFollowing,
                    lastChecked: new Date()
                });

                console.log(`Updated baseline for ${profile.username}`);
            } else {
                console.log(`No new following found for ${profile.username}`);
                
                // Update last checked timestamp
                await TrackedProfile.findByIdAndUpdate(profileId, {
                    lastChecked: new Date()
                });
            }
        } catch (error) {
            console.error(`Error checking profile ${profileId}:`, error);
        }
    });

    // Store job reference
    activeJobs.set(profileId, job);
    console.log(`Started tracking profile ${profileId}`);
};

const stopTrackingProfile = (profileId) => {
    const job = activeJobs.get(profileId);
    if (job) {
        job.stop();
        activeJobs.delete(profileId);
        console.log(`Stopped tracking profile ${profileId}`);
    }
};

const stopAllJobs = () => {
    for (const [profileId, job] of activeJobs) {
        job.stop();
        console.log(`Stopped tracking profile ${profileId}`);
    }
    activeJobs.clear();
};

module.exports = {
    startTrackingProfile,
    stopTrackingProfile,
    stopAllJobs
}; 