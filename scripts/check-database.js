const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  console.log('🔍 Checking database...');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'genai_db'
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Available tables:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    // Check keywords table
    console.log('\n🔑 Keywords table:');
    const [keywords] = await connection.execute('SELECT * FROM keywords ORDER BY created_at DESC');
    if (keywords.length > 0) {
      keywords.forEach(keyword => {
        console.log(`   ID: ${keyword.id} | Title: ${keyword.title}`);
      });
    } else {
      console.log('   ❌ No keywords found');
    }

    // Check chats table
    console.log('\n💬 Chats table:');
    const [chats] = await connection.execute('SELECT * FROM chats ORDER BY created_at DESC LIMIT 5');
    if (chats.length > 0) {
      chats.forEach(chat => {
        console.log(`   ID: ${chat.id} | User: ${chat.user_message}`);
      });
    } else {
      console.log('   ❌ No chats found');
    }

    await connection.end();
    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  checkDatabase();
}

module.exports = checkDatabase;