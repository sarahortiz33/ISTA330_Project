
const express = require('express'); 
const cors = require('cors');

const app = express(); //Creates an Express application
app.use(express.json()); // Middleware to parse JSON data. It allows you to work with req.body when handling POST or PUT requests.
app.use(cors()); // This middleware enables CORS

const { database_store } = require('./models/db');


app.get('/', (req, res) => {
  res.status(200).json({done: true, message: 'works!'});
});

// Register a new user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await database_store.addCustomer(name, email, password);
    if(!c.status === 403) {
      return c.status(403).json({ done: false, message: res.message });
    }

    res.status(201).json({ done: true, message: 'The customer was added successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
})

// Login an existing user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let result = await database_store.login(email, password);
  
  console.log('result: ', result);

  if (result.valid) {
    res.status(200).json({done: true, message: result.message});
  } else {
    res.status(401).json({done: false, message: result.message});
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

