// routes/auth.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models/db");
const multer = require("multer"); 
const path = require("path");

// Set up multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /register
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, dob } = req.body;

  try {
    const check = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(409).json({ done: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (first_name, last_name, email, password, dob)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, email, hashedPassword, dob]
    );

    res.status(201).json({ done: true, message: "User registered successfully!" });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ done: false, message: "Server error" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ done: false, message: "User not found" });
    }

    const user = userCheck.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ done: false, message: "Invalid credentials" });
    }

    res.status(200).json({ 
      done: true, 
      message: "Login successful", 
      userId: user.id // returning userId
    });
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ done: false, message: "Server error" });
  }
});

// GET /profile/:email
router.get("/profile/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await db.query(
      "SELECT first_name, last_name, dob, status, profile_pic FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /update-status
router.post("/update-status", async (req, res) => {
  const { userId, status } = req.body;
  try {
    await db.query(
      "UPDATE users SET status = $1 WHERE id = $2",
      [status, userId]
    );
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// POST /upload-profile-pic
router.post("/upload-profile-pic", upload.single("profile_pic"), async (req, res) => {
  const { userId } = req.body;
  const profilePicFilename = req.file.filename;

  try {
    await db.query("UPDATE users SET profile_pic = $1 WHERE id = $2", [profilePicFilename, userId]);
    res.json({ message: "Profile picture uploaded successfully!", filename: profilePicFilename });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(500).json({ error: "Failed to upload profile picture" });
  }
});

module.exports = router;
