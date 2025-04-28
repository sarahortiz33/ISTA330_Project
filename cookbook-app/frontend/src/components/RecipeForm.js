import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export default function RecipeForm({ onAddRecipe }) {
  const [recipeData, setRecipeData] = useState({
    dishName: "",
    shortDescription: "",
    category: "breakfast",
    ingredients: "",
    instructions: "",
    style: "",
    prepTime: "",
    servings: "",
    photoUrl: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecipe(recipeData);
    setRecipeData({
      dishName: "",
      shortDescription: "",
      category: "breakfast",
      ingredients: "",
      instructions: "",
      style: "",
      prepTime: "",
      servings: "",
      photoUrl: ""
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <h4>Add New Recipe</h4>

      <Form.Group className="mb-2">
        <Form.Label>Dish Name</Form.Label>
        <Form.Control
          type="text"
          name="dishName"
          value={recipeData.dishName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Short Description</Form.Label>
        <Form.Control
          type="text"
          name="shortDescription"
          value={recipeData.shortDescription}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Category</Form.Label>
        <Form.Select
          name="category"
          value={recipeData.category}
          onChange={handleChange}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Ingredients</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="ingredients"
          value={recipeData.ingredients}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Instructions</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="instructions"
          value={recipeData.instructions}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Style (e.g., Italian, Mexican)</Form.Label>
        <Form.Control
          type="text"
          name="style"
          value={recipeData.style}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Prep Time (minutes)</Form.Label>
        <Form.Control
          type="number"
          name="prepTime"
          value={recipeData.prepTime}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Servings</Form.Label>
        <Form.Control
          type="number"
          name="servings"
          value={recipeData.servings}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Photo URL (optional)</Form.Label>
        <Form.Control
          type="text"
          name="photoUrl"
          value={recipeData.photoUrl}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Recipe
      </Button>
    </Form>
  );
}
