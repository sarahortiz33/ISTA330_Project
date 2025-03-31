import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Card } from "react-bootstrap";


const Register = ({ setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name, email, password
      });
      localStorage.setItem("token", response.data.token);
      setUser({ token: response.data.token });
      navigate("/home");
    } catch (error) {
      alert("Registration failed: " + error.response.data.message);
    }
  };

  return (
    <div>
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "500px" }}>
        <Card style={{ width: "400px", padding: "20px" }}>
        <h2 className="text-center">Register</h2>
          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name&nbsp;</Form.Label>
            <Form.Control 
              type="name" 
              placeholder="Name" 
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group> 
          <br />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address&nbsp;</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password&nbsp;</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit" className="mt-4 w-100">
            Submit
          </Button>
        </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Register;


      
