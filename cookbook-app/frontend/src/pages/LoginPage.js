import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

    const loginData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log('Login response:', data); 

      if (data.done) {
        localStorage.setItem("token", "dummy-token");
        localStorage.setItem("email", formData.email);

        if (data.userId !== undefined && data.userId !== null) {
          localStorage.setItem("userId", data.userId.toString());
        } else {
          console.error("Login succeeded but userId is missing in response!");
        }

        const profileResponse = await fetch(`http://localhost:5001/profile/${formData.email}`);
        const profileData = await profileResponse.json();

        setUser({
          token: "dummy-token",
          email: formData.email,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          dob: profileData.dob,
          userId: data.userId 
        });

        navigate("/home"); 
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error during login");
    }
  };

  return (
    <div className="register-page d-flex flex-column min-vh-100">
      <header className="bg-dark text-white text-center py-4 fixed-top w-100 shadow">
        <h1 className="mb-1 fw-bold">Welcome to Your Personal Cookbook</h1>
        <p className="mb-0">Keep your favorite recipes in one place 🍴</p>
      </header>

      <Container className="flex-grow-1 d-flex justify-content-center align-items-center" style={{ marginBottom: "120px" }}>
        <Form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "550px" }} className="bg-white p-5 rounded shadow">
          <h3 className="mb-4 text-center text-primary">Login to Your Account</h3>

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

          <Button type="submit" variant="primary" className="w-100 fw-bold">
            Login
          </Button>

          <div className="text-center mt-3">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>

        </Form>
      </Container>

      <footer className="bg-dark text-white text-center py-3 fixed-bottom w-100">
        <small>© 2025 Cookbook App · Built with love for food lovers 🍰</small>
      </footer>
    </div>
  );
}
