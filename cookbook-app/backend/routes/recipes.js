const express = require("express");
const router = express.Router();
const recipeModel = require("../models/recipeModel");
const db = require("../models/db"); // ✅ Needed for direct DB queries

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

module.exports = router;
