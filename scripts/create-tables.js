const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables() {
  console.log('🚀 Creating database tables...');
  
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

    // Create keywords table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS keywords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        prompt TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_title (title),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✅ Keywords table created');

    // Create chats table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_message TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        keyword_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE SET NULL,
        INDEX idx_keyword_id (keyword_id),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✅ Chats table created');

    // Insert sample keywords if table is empty
    const [existingKeywords] = await connection.execute('SELECT COUNT(*) as count FROM keywords');
    if (existingKeywords[0].count === 0) {
      await connection.execute(`
        INSERT INTO keywords (title, prompt) VALUES
        ('Kritik Artikel', 'Berikan kritik dan saran untuk artikel berikut ini:'),
        ('Analisis Dokumen', 'Analisis dokumen berikut dan berikan ringkasan:'),
        ('Saran Konten', 'Berikan saran untuk meningkatkan konten berikut:'),
        ('Review Laporan', 'Review laporan berikut dan berikan feedback:'),
        ('Evaluasi Proposal', 'Evaluasi proposal berikut dan berikan rekomendasi:')
      `);
      console.log('✅ Sample keywords inserted');
    }

    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Available tables:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log('🎉 Database tables setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Make sure the database exists');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createTables();
}

module.exports = createTables;