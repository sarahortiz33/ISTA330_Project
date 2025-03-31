
const bcrypt = require('bcrypt');
const { Client } = require('pg'); // npm install pg

// PostgreSQL connection configuration
const client = new Client({
  host: 'dummyhostname',
  port: 1234, //your port number
  user: 'avnadmin',
  password: 'dummyPassword',
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false, // Set this to false to allow self-signed certificates
  }
});

// Connect to the PostgreSQL database
client.connect();

let database_store = {

    addCustomer: async (name, email, password) => {
      const existingUser = await client.query(
        'SELECT * FROM user_data WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return { done: false, status: 403, message: "User already registered!" };
      }

      let hashedPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds

      // Using parameterized queries to avoid SQL injection
      const result = await client.query(
          'INSERT INTO user_data (name, email, password) VALUES ($1, $2, $3)', 
          [name, email, hashedPassword]
      );

        return result;
    },

    login: async (email, password) => {
        // Fetch customer data from the 'user_data' table based on email
        const result = await client.query(
            'SELECT * FROM user_data WHERE email = $1',
            [email]
        );

        // If no customer is found, return an error
        if (result.rows.length === 0) {
            return { valid: false, message: "Email not found!" };
        }

        let customer = result.rows[0];  // Get the first matching customer
        
        // Compare the provided password with the stored hashed password
        let valid = bcrypt.compareSync(password, customer.password);
        
        console.log('valid: ', valid);
        
        if (valid) {
            return { valid: true, message: 'Successful!' };
        } else {
            return { valid: false, message: "Credentials are not valid." };
        }
    },

        addScore: async (quiz_id, user_email, score) => {
          await client.query(
            'INSERT INTO scores (quiz_id, user_email, score) VALUES ($1, $2, $3)',
              [quiz_id, user_email, score]
          );
          return { done: true, message: "Score added successfully!" };
        },

        getScore: async (user_email, quiz_id) => {
          const result = await client.query(
            'SELECT score FROM scores WHERE user_email = $1 AND quiz_id = $2',
            [user_email, quiz_id]
          );
            
          if (result.rows.length === 0) {
            return undefined;
          }
            
          return result.rows[0].score;
        },
}


exports.database_store = database_store;
