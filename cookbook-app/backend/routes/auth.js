const express = require('express'); // The web framework for Node.js used to create the API routes.
const User = require('../models/User'); // The User model is imported from the models/User file to interact with MongoDB and manage user data
const jwt = require('jsonwebtoken'); // The jsonwebtoken library is used to create and verify JWT tokens. These tokens are used for user authentication.
const bcrypt = require('bcryptjs'); // This is used to hash and compare passwords.
const router = express.Router(); // An instance of the Express Router, which is used to define routes that handle HTTP requests.

// Register a new user
// This route handles the registration process. It's a POST request to /register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; //The request body is expected to have the fields name, email, and password for the new user.

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = new User({ name, email, password });
    await user.save(); //await is an operator in JavaScript used with asynchronous functions. It pauses the execution of the code inside an async function until the Promise is resolved or rejected.

    // Create and send JWT token
    // If the email exists and the password matches, it generates a JWT token containing the user’s id. The token is signed using the secret (process.env.JWT_SECRET) and has a one-hour expiration time.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // If the email exists and the password matches, it generates a JWT token containing the user’s id. The token is signed using the secret (process.env.JWT_SECRET) and has a one-hour expiration time.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
