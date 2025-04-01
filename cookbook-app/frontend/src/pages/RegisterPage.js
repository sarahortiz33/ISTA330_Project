import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function RegisterPage({ setUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
  });

  const navigate = useNavigate(); 
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.done) {
      localStorage.setItem("token", "dummy-token");
      navigate("/login"); 
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="register-page d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-dark text-white text-center py-4 fixed-top w-100 shadow">
        <h1 className="mb-1 fw-bold">Welcome to Your Personal Cookbook</h1>
        <p className="mb-0">Keep your favorite recipes in one place 🍴</p>
      </header>

      {/* Form */}
      <Container
        className="flex-grow-1 d-flex justify-content-center align-items-center"
        style={{ marginTop: "160px", marginBottom: "100px" }}
      >
        <Form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "550px" }}
          className="bg-white p-5 rounded shadow"
        >
          <h3 className="mb-4 text-center text-primary">Create Your Account</h3>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="firstName">
                <Form.Label className="fw-semibold">First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lastName">
                <Form.Label className="fw-semibold">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="dob">
            <Form.Label className="fw-semibold">Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 fw-bold">
            Register
          </Button>
        </Form>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 fixed-bottom w-100">
        <small>© 2025 Cookbook App · Built with love for food lovers 🍰</small>
      </footer>
    </div>
  );
}
