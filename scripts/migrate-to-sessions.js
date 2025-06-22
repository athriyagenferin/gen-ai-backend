const { getConnectionPool } = require('../utils/db');

async function migrateToSessions() {
  try {
    const connPool = getConnectionPool();
    if (!connPool) {
      throw new Error('Database connection not available');
    }

    console.log('🚀 Starting migration to chat sessions...');

    // 1. Create chat_sessions table if not exists
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

    // 2. Add session_id column to chats table if not exists
    console.log('🔧 Adding session_id column to chats table...');
    try {
      await connPool.execute('ALTER TABLE chats ADD COLUMN session_id INT');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('✅ session_id column already exists');
      } else {
        throw error;
      }
    }

    // 3. Add foreign key constraint if not exists
    console.log('🔗 Adding foreign key constraint...');
    try {
      await connPool.execute(`
        ALTER TABLE chats 
        ADD CONSTRAINT fk_chats_session_id 
        FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
      `);
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('✅ Foreign key constraint already exists');
      } else {
        throw error;
      }
    }

    // 4. Get all existing chats
    console.log('📊 Fetching existing chats...');
    const [existingChats] = await connPool.execute('SELECT * FROM chats ORDER BY created_at ASC');

    if (existingChats.length === 0) {
      console.log('✅ No existing chats to migrate');
      return;
    }

    console.log(`📝 Found ${existingChats.length} chats to migrate`);

    // 5. Group chats by date (same day = same session)
    const chatGroups = {};
    existingChats.forEach(chat => {
      const date = new Date(chat.created_at).toDateString();
      if (!chatGroups[date]) {
        chatGroups[date] = [];
      }
      chatGroups[date].push(chat);
    });

    console.log(`📅 Grouped into ${Object.keys(chatGroups).length} sessions`);

    // 6. Create sessions and update chats
    for (const [date, chats] of Object.entries(chatGroups)) {
      const firstChat = chats[0];
      const sessionTitle = firstChat.user_message.length > 50 
        ? firstChat.user_message.substring(0, 47) + '...' 
        : firstChat.user_message;

      console.log(`🆕 Creating session: "${sessionTitle}"`);

      // Create session
      const [sessionResult] = await connPool.execute(
        'INSERT INTO chat_sessions (title, first_message, created_at) VALUES (?, ?, ?)',
        [sessionTitle, firstChat.user_message, firstChat.created_at]
      );
      const sessionId = sessionResult.insertId;

      // Update all chats in this group
      for (const chat of chats) {
        await connPool.execute(
          'UPDATE chats SET session_id = ? WHERE id = ?',
          [sessionId, chat.id]
        );
      }

      console.log(`✅ Updated ${chats.length} chats for session ${sessionId}`);
    }

    // 7. Make session_id NOT NULL
    console.log('🔒 Making session_id NOT NULL...');
    await connPool.execute('ALTER TABLE chats MODIFY COLUMN session_id INT NOT NULL');

    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Migrated ${existingChats.length} chats into ${Object.keys(chatGroups).length} sessions`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateToSessions()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateToSessions }; 