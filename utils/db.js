const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool using environment variables
const connPool = mysql.createPool({
  host                  : process.env.DB_HOST,
  port                  : process.env.DB_PORT,
  user                  : process.env.DB_USERNAME,
  password              : process.env.DB_PASSWORD,
  database              : process.env.DB_DATABASE,
  waitForConnections    : true,
  connectionLimit       : 3,
  maxIdle               : 3,
  idleTimeout           : 60000,
  queueLimit            : 0,
  enableKeepAlive       : true,
  keepAliveInitialDelay : 0,
});

// Test connection and log success message
(async () => {
  try {
    const connection = await connPool.getConnection();
    console.log('MySQL connection pool established successfully.');
    console.log(`Connected to database: ${process.env.DB_DATABASE} on ${process.env.DB_HOST}`);
    connection.release();
  } catch (err) {
    console.error('MySQL connection pool failed:', err.message);
  }
})();

module.exports = connPool;