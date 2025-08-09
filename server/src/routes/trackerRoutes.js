const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addProfile, getTrackedProfiles, removeProfile } = require('../controllers/trackerController');

// All routes are protected
router.use(protect);

router.post('/profiles', addProfile);
router.get('/profiles', getTrackedProfiles);
router.delete('/profiles/:id', removeProfile);

module.exports = router; 