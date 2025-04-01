const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //A library for hashing passwords and securely comparing passwords

// This defines the structure (or schema) for the User document in MongoDB.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// This creates a Mongoose model named User using the userSchema we defined earlier. The model allows you to interact with the users collection in the MongoDB database, such as creating, reading, updating, and deleting user documents.
const User = mongoose.model('User', userSchema);
// This exports the User model so that it can be used in other parts of the application.
module.exports = User;
