import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

export default function AppNavbar({ setUser }) { // ✅ Accept setUser prop
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Clear stored token
    setUser(null); // ✅ Reset user in memory
    navigate("/login"); // ✅ Redirect to login page
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Cookbook App</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/home">Home</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
