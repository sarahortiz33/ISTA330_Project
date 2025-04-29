import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import FollowersPage from "./pages/FollowersPage";
import FavoritesPage from "./pages/FavoritesPage";
import FollowingRecipesPage from "./pages/FollowingRecipesPage"; 
import AppNavbar from "./components/Navbar";
import Footer from "./components/Footer"; 

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    if (token && email) {
      fetch(`http://localhost:5001/profile/${email}`)
        .then((res) => res.json())
        .then((profileData) => {
          setUser({
            token: token,
            email: email,
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            dob: profileData.dob,
            userId: parseInt(userId),
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
            <Route
              path="/"
              element={
                user ? <Navigate to="/home" replace /> : <LoginPage setUser={setUser} />
              }
            />
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<HomePage user={user} />} />
            <Route path="/favorites" element={<FavoritesPage user={user} />} />
            <Route path="/following-recipes" element={<FollowingRecipesPage user={user} />} /> 
            <Route path="/followers" element={<FollowersPage currentUserId={user.userId} />} />
            <Route path="/search" element={<SearchPage user={user} />} />
            <Route path="/about" element={<AboutPage />} />
          </>
        )}
      </Routes>

      {/*  Always render footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;