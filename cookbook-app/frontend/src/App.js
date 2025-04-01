import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import About from "./pages/AboutPage";
import AppNavbar from "./components/Navbar";
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  return (
    <Router>
      {user && <AppNavbar />} {/* Show navbar only when logged in */}

      <Container className="mt-4">
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<Register setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/register" />} />
            </>
          ) : (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </>
          )}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
