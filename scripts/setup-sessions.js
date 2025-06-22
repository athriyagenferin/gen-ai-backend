const { getConnectionPool } = require('../utils/db');

async function setupSessions() {
  try {
    const connPool = getConnectionPool();
    if (!connPool) {
      throw new Error('Database connection not available');
    }

    console.log('🚀 Setting up chat sessions...');

    // 1. Create chat_sessions table
    console.log('📋 Creating chat_sessions table...');
    await connPool.execute(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        first_message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        INDEX idx_title (title),
        INDEX idx_created_at (created_at),
        INDEX idx_is_active (is_active)
      )
    `);

    // 2. Check if session_id column exists in chats table
    console.log('🔍 Checking chats table structure...');
    const [columns] = await connPool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'genai_db' 
      AND TABLE_NAME = 'chats' 
      AND COLUMN_NAME = 'session_id'
    `);

    if (columns.length === 0) {
      console.log('🔧 Adding session_id column to chats table...');
      await connPool.execute('ALTER TABLE chats ADD COLUMN session_id INT');
      
      // Add foreign key constraint
      try {
        await connPool.execute(`
          ALTER TABLE chats 
          ADD CONSTRAINT fk_chats_session_id 
          FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
        `);
        console.log('✅ Foreign key constraint added');
      } catch (error) {
        console.log('⚠️ Foreign key constraint already exists or failed to add');
      }
    } else {
      console.log('✅ session_id column already exists');
    }

    console.log('🎉 Chat sessions setup completed!');
    console.log('📝 You can now use the chat history feature');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupSessions()
    .then(() => {
      console.log('✅ Setup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup script failed:', error);
      process.exit(1);
    });
}

module.exports = { setupSessions }; 