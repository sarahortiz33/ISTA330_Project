const express = require("express");
const cors = require("cors");
const app = express();
const multer = require('multer');
const path = require('path');


const authRoutes = require("./routes/auth"); 
const aboutRoutes = require("./routes/about"); 
const recipeRoutes = require("./routes/recipes");
const followerRoutes = require("./routes/followers"); 
const favoriteRoutes = require('./routes/favorites');

app.use(cors());
app.use(express.json());

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files inside /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

app.use("/", authRoutes);
app.use("/about", aboutRoutes);
app.use("/home", recipeRoutes);
app.use("/api/followers", followerRoutes); 
app.use('/api/favorites', favoriteRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
