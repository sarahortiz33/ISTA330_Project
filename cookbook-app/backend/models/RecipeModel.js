const pool = require('./db');

// Add new recipe
const addRecipe = async (recipe) => {
  const {
    userId,
    dishName,
    shortDescription,
    category,
    ingredients,
    instructions,
    style,
    prepTime,
    servings,
    photoUrl
  } = recipe;

  const query = `
    INSERT INTO recipes 
    (user_id, dish_name, short_description, category, ingredients, instructions, style, prep_time, servings, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [userId, dishName, shortDescription, category, ingredients, instructions, style, prepTime, servings, photoUrl];
  const result = await pool.query(query, values);
  return result.rows[0];
};


// Get all recipes for a user, grouped by category
const getUserRecipes = async (userId) => {
  const query = `
    SELECT * FROM recipes
    WHERE user_id = $1
    ORDER BY category;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = {
  addRecipe,
  getUserRecipes
};
