import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AppNavbar({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          🍴 Cookbook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/favorites")}>Favorites</Nav.Link>
            <Nav.Link onClick={() => navigate("/following-recipes")}>Following Recipes</Nav.Link> 
            <Nav.Link onClick={() => navigate("/followers")}>Followers</Nav.Link>
            <Nav.Link onClick={() => navigate("/search")}>Search</Nav.Link>
            <Nav.Link onClick={() => navigate("/about")}>About</Nav.Link>
          </Nav>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
