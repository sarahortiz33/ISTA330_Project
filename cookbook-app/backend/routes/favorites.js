const express = require('express');
const router = express.Router();
const db = require('../models/db');

//  Save a recipe to favorites
router.post('/', async (req, res) => {
  const { userId, recipeId } = req.body;
  try {
    // Check if already favorited
    const existing = await db.query(
      `SELECT * FROM favorites WHERE user_id = $1 AND recipe_id = $2`,
      [userId, recipeId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Recipe already in favorites' });
    }

    // Otherwise, insert into favorites
    await db.query(
      `INSERT INTO favorites (user_id, recipe_id)
       VALUES ($1, $2)`,
      [userId, recipeId]
    );

    res.json({ message: 'Recipe saved to favorites!' });
  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(500).json({ error: 'Failed to save favorite' });
  }
});

//  Get user's favorites
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT recipes.*
       FROM recipes
       JOIN favorites ON recipes.id = favorites.recipe_id
       WHERE favorites.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

//  Remove a favorite
router.delete('/:userId/:recipeId', async (req, res) => {
  const { userId, recipeId } = req.params;
  try {
    await db.query(
      `DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2`,
      [userId, recipeId]
    );
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;