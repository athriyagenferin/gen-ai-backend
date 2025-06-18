const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  const configs = [
    {
      name: 'With password from .env',
      config: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'genai_db'
      }
    },
    {
      name: 'Without password (empty)',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'genai_db'
      }
    },
    {
      name: 'Without database (just server)',
      config: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: ''
      }
    }
  ];

  for (const test of configs) {
    console.log(`\n📋 Testing: ${test.name}`);
    console.log(`   Host: ${test.config.host}:${test.config.port}`);
    console.log(`   User: ${test.config.user}`);
    console.log(`   Database: ${test.config.database || 'N/A'}`);
    
    try {
      const connection = await mysql.createConnection(test.config);
      console.log('   ✅ Connection successful!');
      
      // Test if database exists
      if (test.config.database) {
        try {
          const [rows] = await connection.execute('SHOW TABLES');
          console.log(`   📊 Database has ${rows.length} tables`);
        } catch (dbError) {
          console.log(`   ⚠️  Database '${test.config.database}' doesn't exist or no access`);
        }
      }
      
      await connection.end();
      console.log('   ✅ Connection closed');
      
    } catch (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
    }
  }
  
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Make sure MySQL server is running');
  console.log('2. Check if you need a password for root user');
  console.log('3. Try creating the database manually in phpMyAdmin');
  console.log('4. Check if the user has proper privileges');
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection();
}

module.exports = testDatabaseConnection; 