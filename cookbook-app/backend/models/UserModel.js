const pool = require('./db');
const bcrypt = require('bcryptjs'); //A library for hashing passwords and securely comparing passwords


const addUser = async (firstName, lastName, email, password, dob) => {
  const query = `
    INSERT INTO users (first_name, last_name, email, password, dob)
    VALUES ($1, $2, $3, $4, $5);
  `;
  
  const values = [firstName, lastName, email, password, dob];
  
  try {
    await pool.query(query, values);
    console.log('User added successfully');
  } catch (err) {
    console.error('Error inserting user:', err);
  }
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const res = await pool.query(query, [email]);
  return res.rows[0];
};

const matchPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = {
  addUser,
  findUserByEmail,
  matchPassword
};