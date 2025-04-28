import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppNavbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    if (token && email) {
      // Fetch user info again
      fetch(`http://localhost:5001/profile/${email}`)
        .then((res) => res.json())
        .then((profileData) => {
          setUser({
            token: token,
            email: email,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            dob: profileData.dob,
            userId: parseInt(userId) // ✅ optional
          });
        })
        .catch((err) => {
          console.error("Error loading profile:", err);
          setUser(null);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      {user && <AppNavbar setUser={setUser} />}
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<LoginPage setUser={setUser} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} />} /> {/* ✅ Login route */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<HomePage user={user} />} />
            <Route path="/about" element={<AboutPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
