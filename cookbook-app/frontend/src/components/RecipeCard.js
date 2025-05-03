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

      {/* Image at the top */}
      {recipe.photo_url && (
        <Card.Img
          variant="top"
          src={`http://localhost:5001/uploads/${recipe.photo_url}`}
          alt="Dish"
          style={{
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            cursor: "pointer"
          }}
          onClick={() => setOpen(!open)}
        />
      )}

      <Card.Body onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <Card.Title>{recipe.dish_name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Prep Time: {recipe.prep_time} min | Style: {recipe.style} | Servings: {recipe.servings}
        </Card.Subtitle>

        <Collapse in={open}>
          <div>
            <hr />
            {recipe.short_description && (
              <Card.Text><strong>Description:</strong> {recipe.short_description}</Card.Text>
            )}

            {/* Ingredients as bullet list */}
            <Card.Text>
              <strong>Ingredients:</strong>
              <ul style={{ paddingLeft: "1.5rem" }}>
                {recipe.ingredients.split(",").map((ing, idx) => (
                  <li key={idx}>{ing.trim()}</li>
                ))}
              </ul>
            </Card.Text>

            {/* Instructions split by newlines */}
            <Card.Text>
              <strong>Instructions:</strong>
              {recipe.instructions.split("\n").map((line, idx) => (
                <p key={idx}>{line.trim()}</p>
              ))}
            </Card.Text>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}
