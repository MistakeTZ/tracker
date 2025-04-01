const { Pool } = require('pg');

const pool = new Pool({
  user: 'tracker',
  host: 'localhost',
  database: 'task_tracker',
  password: 'pass12345postgres',
  port: 5432,
});

module.exports = pool;