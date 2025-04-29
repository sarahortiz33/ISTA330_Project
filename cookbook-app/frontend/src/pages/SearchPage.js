import React, { useState, useEffect } from "react";

export default function SearchPage({ user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [savedRecipeIds, setSavedRecipeIds] = useState(new Set());

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/favorites/${user.userId}`);
        const data = await response.json();
        const favoriteIds = data.map(recipe => recipe.id);
        setSavedRecipeIds(new Set(favoriteIds));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user.userId]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5001/home/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
      setMessage("");
    } catch (error) {
      console.error("Error fetching search results:", error);
      setMessage("Error fetching search results.");
      setMessageType("error");
    }
  };

  const toggleExpand = (recipeId) => {
    if (expandedCardId === recipeId) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(recipeId);
    }
  };

  const handleSaveFavorite = async (recipeId) => {
    if (savedRecipeIds.has(recipeId)) {
      setMessage("Recipe already saved to favorites!");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          recipeId: recipeId
        }),
      });

      if (response.ok) {
        setMessage("Recipe saved to favorites! 🎉");
        setMessageType("success");
        setSavedRecipeIds(prev => new Set(prev).add(recipeId));
      } else {
        setMessage("Failed to save favorite.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error saving favorite:", error);
      setMessage("An error occurred while saving favorite.");
      setMessageType("error");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
      <h4 className="mt-5 mb-3">Search Recipes</h4>

      {/* Search Bar */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search recipes by dish name, category, or style..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="btn"
          style={{ backgroundColor: "#f8c291", color: "#4e342e", fontWeight: "bold", border: "none" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Success or Error Message */}
      {message && (
        <div className={`mb-4 ${messageType === "success" ? "text-success" : "text-danger"}`}>
          {message}
        </div>
      )}

      {/* Search Results */}
      <div className="row">
        {searchResults.length > 0 ? (
          searchResults
            .filter(recipe => !savedRecipeIds.has(recipe.id)) //  filter out already favorited recipes
            .map((recipe) => (
              <div key={recipe.id} className="col-md-6 col-lg-4">
                <div
                  className="card mb-4 p-3 position-relative"
                  style={{ cursor: "pointer", backgroundColor: "#fff8f0", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                  onClick={() => toggleExpand(recipe.id)}
                >
                  {/* Save to Favorites Button */}
                  <button
                    className="btn btn-sm"
                    style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "#f8c291", color: "#4e342e", border: "none", fontWeight: "bold" }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveFavorite(recipe.id);
                    }}
                  >
                    ❤️
                  </button>

                  <h5 className="card-title mt-3">{recipe.dish_name}</h5>
                  <p><strong>Short Description:</strong> {recipe.short_description}</p>
                  <p><strong>Category:</strong> {recipe.category}</p>
                  <p><strong>Style:</strong> {recipe.style}</p>

                  {/* Expanded Full Info */}
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
            ))
        ) : (
          <p className="text-muted">No recipes found.</p>
        )}
      </div>
    </div>
  );
}