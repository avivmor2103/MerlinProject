const axios = require('axios');

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = 'instagram-best-experience.p.rapidapi.com';

const fetchInstagramProfile = async (username) => {
    try {
        console.log('Fetching profile for username:', username);
        
        // Fetch basic profile info
        console.log('Making profile API request...');
        const profileResponse = await axios.get(`https://${RAPID_API_HOST}/profile?username=${username}`, {
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': RAPID_API_HOST
            }
        });
        console.log('Profile API response received');

        // Extract user_id from profile response
        const userId = profileResponse.data.pk;
        if (!userId) {
            throw new Error('Could not get user ID from profile');
        }

        // Fetch following list using user_id
        console.log('Making following list API request...');
        const followingList = [];
        let followingResponse = await axios.get(`https://${RAPID_API_HOST}/following?user_id=${userId}`, {
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': RAPID_API_HOST
            }
        });
        await new Promise(resolve => setTimeout(resolve, 10000));
        followingList.push(...followingResponse.data.users.map(user => user.username));
        let nextMaxId = followingResponse.data.next_max_id;
        
        let count = 2;
        while(parseInt(nextMaxId)*count < profileResponse.data.following_count) {
            console.log("nextMaxId:", nextMaxId*count);
            followingResponse = await axios.get(`https://${RAPID_API_HOST}/following?user_id=${userId}&next_max_id=${nextMaxId*count}`, {
                headers: {
                    'X-RapidAPI-Key': RAPID_API_KEY,
                    'X-RapidAPI-Host': RAPID_API_HOST
                }
            });
            followingList.push(...followingResponse.data.users.map(user => user.username));
            count++;
            // sleep for 10 seconds
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
       
        const combinedData = {
            ...profileResponse.data,
            following_list: followingList || []
        };
        console.log("combinedData:", combinedData);
        return combinedData;
    } catch (error) {
        console.error('Instagram API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });

        if (error.response?.status === 404) {
            throw new Error('Instagram profile not found');
        }

        if (error.response?.status === 401 || error.response?.status === 403) {
            throw new Error('API key invalid or expired');
        }

        throw new Error(
            error.response?.data?.message || 
            error.response?.data?.error || 
            'Failed to fetch Instagram profile'
        );
    }
};

module.exports = {
    fetchInstagramProfile
}; 