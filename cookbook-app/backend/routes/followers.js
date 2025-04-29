// routes/followers.js

const express = require('express');
const router = express.Router();
const Follower = require('../models/followerModel');
const db = require('../models/db'); 

// New route to fetch full profile info
router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await db.query(
        `SELECT id, first_name, last_name, dob, status FROM users WHERE id = $1`,
        [userId]
      );
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });
  
// Follow a user
router.post('/follow', async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
        const follow = await Follower.followUser(followerId, followingId);
        res.json(follow);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

// Unfollow a user
router.post('/unfollow', async (req, res) => {
    const { followerId, followingId } = req.body;
    try {
        await Follower.unfollowUser(followerId, followingId);
        res.json({ message: 'Unfollowed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

// Get list of users the current user follows
router.get('/following/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const following = await Follower.getFollowing(userId);
        res.json(following);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get following list' });
    }
});

// Search users by first or last name
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const users = await Follower.searchUsers(query);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

// Get recipes from people the user follows
router.get('/recipes/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await db.query(
        `SELECT recipes.*
         FROM recipes
         JOIN followers ON recipes.user_id = followers.following_id
         WHERE followers.follower_id = $1`,
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching followed recipes:', error);
      res.status(500).json({ error: 'Failed to fetch followed recipes' });
    }
  });
  
module.exports = router;
