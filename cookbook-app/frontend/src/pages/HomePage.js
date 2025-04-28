import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import RecipeForm from "../components/RecipeForm";
import RecipeCard from "../components/RecipeCard";

export default function HomePage({ user }) {
  const [aboutMe, setAboutMe] = useState("Click here to add a status...");
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [recipes, setRecipes] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  // ✅ Load About Me from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem("aboutMeStatus");
    if (savedStatus) {
      setAboutMe(savedStatus);
    }
  }, []);

  // ✅ Load Recipes from backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:5001/home/${user.userId}`);
        const data = await response.json();

        const grouped = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        };

        data.forEach((recipe) => {
          const cat = recipe.category.toLowerCase();
          if (grouped[cat]) {
            grouped[cat].push(recipe);
          }
        });

        setRecipes(grouped);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    if (user && user.userId) {
      fetchRecipes();
    }
  }, [user]);

  // ✅ Format Date of Birth
  const formatDOB = (dob) => {
    if (!dob) return "";
    const dateObj = new Date(dob);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // ✅ Handle About Me Save
  const handleAboutSave = () => {
    setIsEditingAbout(false);
    localStorage.setItem("aboutMeStatus", aboutMe);
  };

  // ✅ Handle Adding a New Recipe
  const handleAddRecipe = async (newRecipe) => {
    try {
      const recipeToSend = { ...newRecipe, userId: user.userId };

      console.log("Recipe being sent:", recipeToSend); // Debugging

      const response = await fetch("http://localhost:5001/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeToSend)
      });

      const savedRecipe = await response.json();

      setRecipes(prev => ({
        ...prev,
        [savedRecipe.category.toLowerCase()]: [...prev[savedRecipe.category.toLowerCase()], savedRecipe]
      }));

    } catch (error) {
      console.error("Failed to add recipe:", error);
    }
  };

  // ✅ Handle Deleting a Recipe
  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:5001/home/${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from frontend view
        setRecipes(prev => {
          const updated = { ...prev };
          for (const category in updated) {
            updated[category] = updated[category].filter(r => r.id !== recipeId);
          }
          return updated;
        });
      } else {
        console.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <Container className="mt-5 pt-3">
      {/* User Profile Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>User Profile</Card.Title>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Date of Birth:</strong> {formatDOB(user.dob)}</p>

          <Card.Title>Status</Card.Title>
          {isEditingAbout ? (
            <>
              <Form.Control
                as="textarea"
                rows={2}
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
              <Button className="mt-2" variant="success" size="sm" onClick={handleAboutSave}>
                Save
              </Button>
            </>
          ) : (
            <div onClick={() => setIsEditingAbout(true)} style={{ cursor: "pointer" }}>
              {aboutMe}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Recipe Form */}
      <RecipeForm onAddRecipe={handleAddRecipe} />

      {/* Grouped Recipes */}
      <h4 className="mt-5 mb-3">My Recipes</h4>

      {["breakfast", "lunch", "dinner", "snacks"].map((category) => (
        <div key={category}>
          <h5 className="mt-4 text-capitalize">{category}</h5>
          <Row>
            {recipes[category].length > 0 ? (
              recipes[category].map((recipe) => (
                <Col key={recipe.id} md={6} lg={4}>
                  <RecipeCard recipe={recipe} onDelete={handleDeleteRecipe} />
                </Col>
              ))
            ) : (
              <Col><p className="text-muted">No {category} recipes yet.</p></Col>
            )}
          </Row>
        </div>
      ))}
    </Container>
  );
}
