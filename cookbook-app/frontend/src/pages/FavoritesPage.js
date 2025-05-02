import React, { useEffect, useState } from "react";

export default function FavoritesPage({ user }) {
  const [favorites, setFavorites] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });
  const [expandedCardId, setExpandedCardId] = useState(null);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/favorites/${user.userId}`);
      const data = await response.json();

      const grouped = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      };

      data.forEach((recipe) => {
        const cat = recipe.category.toLowerCase();
        if (grouped[cat]) {
          grouped[cat].push(recipe);
        }
      });

      setFavorites(grouped);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      fetchFavorites();
    }
  }, [user]);

  const toggleExpand = (recipeId) => {
    if (expandedCardId === recipeId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(recipeId);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/favorites/${user.userId}/${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchFavorites();
      } else {
        console.error("Failed to remove from favorites.");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
      <h2 className="mb-5">My Favorite Recipes</h2>

      {["breakfast", "lunch", "dinner", "snacks"].map((category) => (
        <div key={category}>
          <h4 className="mt-5 text-capitalize">{category}</h4>
          {favorites[category].length > 0 ? (
            <div className="row">
              {favorites[category].map((recipe) => (
                <div key={recipe.id} className="col-md-6 col-lg-4">
                  <div
                    className="card mb-4"
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() => toggleExpand(recipe.id)}
                  >
                    {/* Image at top of card */}
                    {recipe.photo_url && recipe.photo_url.trim() !== "" && (
                      <img
                      src={`http://localhost:5001/uploads/${recipe.photo_url}`}
                      alt={recipe.dish_name}
                        className="img-fluid"
                        style={{
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                          maxHeight: "200px",
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    )}

                    <div className="card-body">
                      {/* Remove Favorite X Button */}
                      <button
                        className="btn btn-sm btn-danger"
                        style={{ position: "absolute", top: "10px", right: "10px", borderRadius: "50%", padding: "2px 6px", fontSize: "1rem" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(recipe.id);
                        }}
                      >
                        &times;
                      </button>

                      <h5 className="card-title">{recipe.dish_name}</h5>
                      <p className="card-text"><strong>Short Description:</strong> {recipe.short_description}</p>
                      <p className="card-text"><strong>Style:</strong> {recipe.style}</p>

                      {/* Expanded Full Info */}
                      {expandedCardId === recipe.id && (
                        <div className="mt-2">
                          <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                          <p><strong>Instructions:</strong> {recipe.instructions}</p>
                          <p><strong>Prep Time:</strong> {recipe.prep_time} minutes</p>
                          <p><strong>Servings:</strong> {recipe.servings}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No {category} favorites yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}