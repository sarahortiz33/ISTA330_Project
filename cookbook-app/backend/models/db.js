const { Pool } = require('pg');

const pool = new Pool({
  host: 'ista-330-ista330-proj1.f.aivencloud.com',
  port: 24264,
  user: 'avnadmin',
  password: 'AVNS_oLS0r6uLhRxzwWYKy45',
  database: 'defaultdb', // Or replace if your DB name is different
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;