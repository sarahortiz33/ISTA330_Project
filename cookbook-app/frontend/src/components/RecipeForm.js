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
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!recipeData.dishName) newErrors.dishName = true;
    if (!recipeData.ingredients) newErrors.ingredients = true;
    if (!recipeData.instructions) newErrors.instructions = true;
    if (!recipeData.category) newErrors.category = true;

    if (!recipeData.servings || parseInt(recipeData.servings) <= 0) newErrors.servings = true;
    if (!recipeData.prepTime || parseInt(recipeData.prepTime) <= 0) newErrors.prepTime = true;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    let photoUrl = "";

    if (photoFile) {
      const formData = new FormData();
      formData.append("photo", photoFile);

      try {
        const response = await fetch("http://localhost:5001/home/upload-photo", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        photoUrl = data.filename;
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }

    const finalRecipeData = { ...recipeData, photoUrl };

    onAddRecipe(finalRecipeData);

    // Reset form
    setRecipeData({
      dishName: "",
      shortDescription: "",
      category: "breakfast",
      ingredients: "",
      instructions: "",
      style: "",
      prepTime: "",
      servings: "",
    });
    setPhotoFile(null);
    setErrors({});
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-2">
        <Form.Label>Dish Name</Form.Label>
        <Form.Control
          type="text"
          name="dishName"
          value={recipeData.dishName}
          onChange={handleChange}
          isInvalid={errors.dishName}
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
          isInvalid={errors.category}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Ingredients (comma-separated)</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="ingredients"
          value={recipeData.ingredients}
          onChange={handleChange}
          isInvalid={errors.ingredients}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Instructions (separate with new lines)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="instructions"
          value={recipeData.instructions}
          onChange={handleChange}
          isInvalid={errors.instructions}
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
          isInvalid={errors.prepTime}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Servings</Form.Label>
        <Form.Control
          type="number"
          name="servings"
          value={recipeData.servings}
          onChange={handleChange}
          isInvalid={errors.servings}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Upload Photo</Form.Label>
        <Form.Control
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
      </Form.Group>

      <Button
        type="submit"
        style={{
          backgroundColor: "#f8c291",
          border: "none",
          color: "#4e342e",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          marginTop: "15px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          fontSize: "1.1rem",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
      >
        🍳 Add Recipe
      </Button>
    </Form>
  );
}
