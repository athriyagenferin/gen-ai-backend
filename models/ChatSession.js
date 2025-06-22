const { getConnectionPool } = require('../utils/db');

class ChatSession {
  static async getAll() {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      // Check if chat_sessions table exists
      const [tables] = await connPool.execute(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = 'genai_db' 
        AND TABLE_NAME = 'chat_sessions'
      `);
      
      if (tables.length === 0) {
        // Return empty array if table doesn't exist
        return [];
      }
      
      const [rows] = await connPool.execute(`
        SELECT cs.*, 
               COUNT(c.id) as message_count,
               MAX(c.created_at) as last_message_at
        FROM chat_sessions cs
        LEFT JOIN chats c ON cs.id = c.session_id
        WHERE cs.is_active = TRUE
        GROUP BY cs.id
        ORDER BY cs.updated_at DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching chat sessions: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [rows] = await connPool.execute('SELECT * FROM chat_sessions WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching chat session: ${error.message}`);
    }
  }

  static async create(sessionData) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      // Check if chat_sessions table exists
      const [tables] = await connPool.execute(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = 'genai_db' 
        AND TABLE_NAME = 'chat_sessions'
      `);
      
      if (tables.length === 0) {
        throw new Error('Chat sessions table does not exist. Please run the setup script first.');
      }
      
      const { title, first_message } = sessionData;
      const [result] = await connPool.execute(
        'INSERT INTO chat_sessions (title, first_message, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [title, first_message]
      );
      return { id: result.insertId, ...sessionData };
    } catch (error) {
      throw new Error(`Error creating chat session: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const { title } = updateData;
      const [result] = await connPool.execute(
        'UPDATE chat_sessions SET title = ?, updated_at = NOW() WHERE id = ?',
        [title, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating chat session: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      // Soft delete - set is_active to false
      const [result] = await connPool.execute(
        'UPDATE chat_sessions SET is_active = FALSE WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting chat session: ${error.message}`);
    }
  }

  static async getChatsBySessionId(sessionId) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [rows] = await connPool.execute(`
        SELECT c.*, k.title as keyword_title
        FROM chats c
        LEFT JOIN keywords k ON c.keyword_id = k.id
        WHERE c.session_id = ?
        ORDER BY c.created_at ASC
      `, [sessionId]);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching chats by session: ${error.message}`);
    }
  }

  static generateTitle(firstMessage) {
    // Generate title from first message (truncate to 50 chars)
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 47) + '...' 
      : firstMessage;
    return title;
  }
}

module.exports = ChatSession; 