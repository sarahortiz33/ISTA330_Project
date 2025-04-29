const db = require('./db');

async function followUser(followerId, followingId) {
    const result = await db.query(
        'INSERT INTO followers (follower_id, following_id) VALUES ($1, $2) RETURNING *',
        [followerId, followingId]
    );
    return result.rows[0];
}

async function unfollowUser(followerId, followingId) {
    await db.query(
        'DELETE FROM followers WHERE follower_id = $1 AND following_id = $2',
        [followerId, followingId]
    );
}

async function getFollowing(userId) {
    const result = await db.query(
        `SELECT users.id, users.first_name, users.last_name
         FROM users
         JOIN followers ON users.id = followers.following_id
         WHERE followers.follower_id = $1`,
        [userId]
    );
    return result.rows;
}

async function searchUsers(name) {
    const result = await db.query(
        `SELECT id, first_name, last_name
         FROM users
         WHERE first_name ILIKE $1 OR last_name ILIKE $1`,
        [`%${name}%`]
    );
    return result.rows;
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowing,
    searchUsers
};
