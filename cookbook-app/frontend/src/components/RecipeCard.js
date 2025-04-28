import React, { useState } from "react";
import { Card, Button, Collapse } from "react-bootstrap";

export default function RecipeCard({ recipe, onDelete }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Card 
      className="mb-3 shadow-sm position-relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Delete button */}
      {hovered && (
        <Button 
          variant="danger"
          size="sm"
          style={{ position: "absolute", top: "5px", right: "5px", borderRadius: "50%", fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            onDelete(recipe.id);  // call parent delete
          }}
        >
          &times;
        </Button>
      )}

      <Card.Body onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        {/* Always visible */}
        <Card.Title>{recipe.dish_name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Prep Time: {recipe.prep_time} min | Style: {recipe.style} | Servings: {recipe.servings}
        </Card.Subtitle>

        {/* Expand/collapse full details */}
        <Collapse in={open}>
          <div>
            <hr />
            {recipe.short_description && (
              <>
                <Card.Text><strong>Description:</strong> {recipe.short_description}</Card.Text>
              </>
            )}
            <Card.Text><strong>Ingredients:</strong> {recipe.ingredients}</Card.Text>
            <Card.Text><strong>Instructions:</strong> {recipe.instructions}</Card.Text>

            {recipe.photo_url && (
              <div className="text-center">
                <img
                  src={recipe.photo_url}
                  alt="Dish"
                  style={{ maxWidth: "100%", height: "auto", marginTop: "10px", borderRadius: "8px" }}
                />
              </div>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}
