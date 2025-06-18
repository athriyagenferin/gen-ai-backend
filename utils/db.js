const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration with fallbacks
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '', // Empty password by default
  database: process.env.DB_DATABASE || 'genai_db',
  waitForConnections: true,
  connectionLimit: 3,
  maxIdle: 3,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create the connection pool
let connPool = null;

// Initialize database connection
async function initializeDB() {
  try {
    connPool = mysql.createPool(dbConfig);
    
    // Test connection
    const connection = await connPool.getConnection();
    console.log('✅ MySQL connection pool established successfully.');
    console.log(`📊 Connected to database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    connection.release();
    
    return connPool;
  } catch (err) {
    console.error('❌ MySQL connection pool failed:', err.message);
    console.log('💡 Please check your database configuration in .env file');
    console.log('💡 Make sure MySQL server is running and database exists');
    
    // Return null if connection fails, but don't crash the app
    return null;
  }
}

// Get connection pool
function getConnectionPool() {
  return connPool;
}

// Test database connection
async function testConnection() {
  if (!connPool) {
    console.log('🔄 Initializing database connection...');
    await initializeDB();
  }
  
  if (connPool) {
    try {
      const connection = await connPool.getConnection();
      connection.release();
      return true;
    } catch (err) {
      console.error('❌ Database connection test failed:', err.message);
      return false;
    }
  }
  return false;
}

// Initialize on module load
initializeDB();

module.exports = {
  getConnectionPool,
  testConnection,
  initializeDB
};