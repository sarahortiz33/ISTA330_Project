import React, { useEffect, useState } from "react";

export default function FollowingRecipesPage({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFollowingRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/followers/recipes/${user.userId}`);
        const data = await response.json();
        setRecipes(data);
        if (data.length === 0) {
          setMessage("No recipes found from people you follow.");
        } else {
          setMessage("");
        }
      } catch (error) {
        console.error("Error fetching following recipes:", error);
        setMessage("Failed to load recipes.");
      }
    };

    if (user && user.userId) {
      fetchFollowingRecipes();
    }
  }, [user]);

  const toggleExpand = (recipeId) => {
    if (expandedCardId === recipeId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(recipeId);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <h4 className="mt-5 mb-3">Recipes from People You Follow</h4>

      {message && <p className="text-muted mb-4">{message}</p>}

      <div className="row">
        {recipes.length > 0 && recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-6 col-lg-4">
            <div
              className="card mb-4 p-3 position-relative"
              style={{ cursor: "pointer", backgroundColor: "#fff8f0", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
              onClick={() => toggleExpand(recipe.id)}
            >
              <h5 className="card-title">{recipe.dish_name}</h5>
              <p><strong>Short Description:</strong> {recipe.short_description}</p>
              <p><strong>Category:</strong> {recipe.category}</p>
              <p><strong>Style:</strong> {recipe.style}</p>

              {expandedCardId === recipe.id && (
                <div className="mt-3">
                  <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                  <p><strong>Instructions:</strong> {recipe.instructions}</p>
                  <p><strong>Prep Time:</strong> {recipe.prep_time} minutes</p>
                  <p><strong>Servings:</strong> {recipe.servings}</p>
                  {recipe.photo_url && recipe.photo_url.trim() !== "" && (
                    <img
                      src={recipe.photo_url}
                      alt={recipe.dish_name}
                      className="img-fluid mt-2"
                      style={{ borderRadius: "10px", maxHeight: "200px", objectFit: "cover" }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}