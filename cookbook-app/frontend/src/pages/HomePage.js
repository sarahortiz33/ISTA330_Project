import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import RecipeForm from "../components/RecipeForm";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";

export default function HomePage({ user }) {
  const [aboutMe, setAboutMe] = useState("Click here to add a status...");
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [recipes, setRecipes] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [showModal, setShowModal] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/profile/${user.email}`);
        if (response.data.status) {
          setAboutMe(response.data.status);
        }
        if (response.data.profile_pic) {
          setProfilePic(`${response.data.profile_pic}?t=${Date.now()}`);
        }
      } catch (error) {
        console.error("Error loading user status:", error);
      }
    };

    if (user) {
      fetchStatus();
    }
  }, [user]);

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

  const formatDOB = (dob) => {
    if (!dob) return "";
    const dateObj = new Date(dob);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  };

  const handleAboutSave = async () => {
    try {
      await axios.post("http://localhost:5001/update-status", {
        userId: user.userId,
        status: aboutMe,
      });
      setIsEditingAbout(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!selectedProfileFile) return;

    const formData = new FormData();
    formData.append('profile_pic', selectedProfileFile);
    formData.append('userId', user.userId);

    try {
      await axios.post('http://localhost:5001/upload-profile-pic', formData);
      const response = await axios.get(`http://localhost:5001/profile/${user.email}`);
      if (response.data.profile_pic) {
        setProfilePic(response.data.profile_pic);
      }
      setSelectedProfileFile(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleAddRecipe = async (newRecipe) => {
    try {
      if (
        !newRecipe.dishName ||
        !newRecipe.ingredients ||
        !newRecipe.instructions ||
        !newRecipe.category ||
        !newRecipe.servings ||
        !newRecipe.prepTime
      ) {
        setFormErrorMessage("Please fill in all fields before submitting.");
        return false;  // return false if invalid
      }
  
      if (newRecipe.servings <= 0 || newRecipe.prepTime <= 0) {
        setFormErrorMessage("Prep Time and Servings must be greater than 0.");
        return false;  
      }
  
      setFormErrorMessage("");
  
      const recipeToSend = { ...newRecipe, userId: user.userId };
  
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
  
      setShowModal(false); 
      return true; 
    } catch (error) {
      console.error("Failed to add recipe:", error);
      return false;
    }
  };
  

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:5001/home/${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5 pt-3" style={{ paddingBottom: "100px" }}>
      {/* User Profile Section */}
      <Card className="mb-4 p-3" style={{ backgroundColor: "#fff8f0", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <Row className="align-items-center">
          <Col md={8}>
            <h4 className="mb-3" style={{ fontWeight: "bold", color: "#4e342e" }}>👩‍🍳 User Profile</h4>
            <div className="mb-2">
              <strong style={{ color: "#6d4c41" }}>👤 Name:</strong> {user.firstName} {user.lastName}
            </div>
            <div className="mb-2">
              <strong style={{ color: "#6d4c41" }}>📅 Date of Birth:</strong> {formatDOB(user.dob)}
            </div>
            <div className="mb-2">
              <strong style={{ color: "#6d4c41" }}>💬 Status:</strong>{" "}
              {isEditingAbout ? (
                <Form.Control
                  as="input"
                  type="text"
                  size="sm"
                  value={aboutMe}
                  autoFocus
                  onChange={(e) => setAboutMe(e.target.value)}
                  onBlur={handleAboutSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAboutSave();
                    }
                  }}
                  style={{ display: "inline-block", width: "auto", marginLeft: "10px", fontSize: "1rem", padding: "2px 6px" }}
                />
              ) : (
                <span
                  onClick={() => setIsEditingAbout(true)}
                  style={{ cursor: "pointer", marginLeft: "10px", textDecoration: "underline dotted", color: "#4e342e", fontSize: "1rem" }}
                >
                  {aboutMe || "Click to set your status"}
                </span>
              )}
            </div>
          </Col>

          {/* Profile Picture */}
          <Col md={4} className="text-center">
            <div style={{ position: "relative", display: "inline-block" }}>
            <img
  src={`http://localhost:5001/uploads/${profilePic}`}
  alt="Profile"
  key={profilePic}  // This forces React to re-render the image when the value changes
  onClick={() => document.getElementById('profilePicInput').click()}
  style={{
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
    border: "3px solid #f8c291",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "0.3s"
  }}
  onMouseOver={(e) => (e.target.style.opacity = 0.8)}
  onMouseOut={(e) => (e.target.style.opacity = 1)}
/>

<Form.Control
  type="file"
  id="profilePicInput"
  style={{ display: "none" }}
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);
    formData.append("userId", user.userId);

    try {
      const uploadRes = await axios.post("http://localhost:5001/upload-profile-pic", formData);
      const refreshed = await axios.get(`http://localhost:5001/profile/${user.email}`);
      if (refreshed.data.profile_pic) {
        setProfilePic(`${refreshed.data.profile_pic}?t=${Date.now()}`);
      }
      e.target.value = null; // Clear the input to allow re-selecting the same file later
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  }}
/>

            </div>
            <p className="mt-2" style={{ color: "#4e342e", fontWeight: "bold", fontSize: "0.95rem" }}>Click to change photo</p>
          </Col>
        </Row>
      </Card>

      {/* Add New Recipe Section */}
      <div className="mb-5 text-center">
        <Button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: "#f8c291", border: "none", color: "#4e342e", fontWeight: "bold", fontSize: "1.1rem", padding: "12px 24px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", transition: "0.3s" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
        >
          ✨ Click Here to Add a New Recipe
        </Button>
      </div>

      {/* Modal for Recipe Form */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="recipe-modal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a New Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formErrorMessage && (
            <div style={{ marginBottom: "10px", color: "red", fontWeight: "bold", textAlign: "center" }}>
              {formErrorMessage}
            </div>
          )}
          <RecipeForm onAddRecipe={handleAddRecipe} />
        </Modal.Body>
      </Modal>

      {/* Grouped Recipes */}
      <h4 className="mt-5 mb-3">My Recipes</h4>
      {"breakfast,lunch,dinner,snacks".split(",").map((category) => (
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
