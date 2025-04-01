const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models/db"); // adjust if your db.js path is different

// POST /register
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, dob } = req.body;

  try {
    // Check if user already exists
    const check = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(409).json({ done: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
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

module.exports = router;
