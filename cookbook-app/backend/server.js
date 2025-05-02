const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Routes
const authRoutes = require("./routes/auth");
const aboutRoutes = require("./routes/about");
const recipeRoutes = require("./routes/recipes");
const followerRoutes = require("./routes/followers");
const favoriteRoutes = require("./routes/favorites");

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config (can be used in individual routes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage }); // If needed in server-level middleware

app.use('/uploads', express.static(uploadDir));

app.use("/", authRoutes);
app.use("/about", aboutRoutes);
app.use("/home", recipeRoutes);
app.use("/api/followers", followerRoutes);
app.use("/api/favorites", favoriteRoutes);

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
