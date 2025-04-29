const express = require("express");
const multer = require('multer');  
const router = express.Router();
const recipeModel = require("../models/recipeModel");
const db = require("../models/db"); 
const upload = multer({ dest: 'uploads/' });


//  Search Route
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const result = await db.query(
      `SELECT * FROM recipes
       WHERE LOWER(dish_name) LIKE LOWER($1)
          OR LOWER(category) LIKE LOWER($1)
          OR LOWER(style) LIKE LOWER($1)`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error searching recipes:", err);
    res.status(500).json({ error: "Failed to search recipes" });
  }
});


// POST /home - Add a new recipe
router.post("/", async (req, res) => {
  try {
    console.log("Backend received body:", req.body);

    const newRecipe = req.body;
    const addedRecipe = await recipeModel.addRecipe(newRecipe);
    res.status(201).json(addedRecipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ message: "Error adding recipe" });
  }
});

// GET /home/:userId - Get user's recipes
router.get("/:userId", async (req, res) => {
  try {
    const recipes = await recipeModel.getUserRecipes(req.params.userId);
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

// DELETE /home/:recipeId - Delete a specific recipe
router.delete("/:recipeId", async (req, res) => {
  try {
    const { recipeId } = req.params;
    await db.query("DELETE FROM recipes WHERE id = $1", [recipeId]);
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Error deleting recipe" });
  }
});

// Upload photo
router.post('/upload-photo', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({ filename: req.file.filename });
});

module.exports = router;
