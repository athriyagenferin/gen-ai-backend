const { getConnectionPool } = require('../utils/db');

class Chat {
  static async getAll() {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      // Check if session_id column exists
      const [columns] = await connPool.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'genai_db' 
        AND TABLE_NAME = 'chats' 
        AND COLUMN_NAME = 'session_id'
      `);
      
      if (columns.length > 0) {
        // Use new format with session_id
        const [rows] = await connPool.execute(`
          SELECT c.*, k.title as keyword_title, cs.title as session_title
          FROM chats c
          LEFT JOIN keywords k ON c.keyword_id = k.id
          LEFT JOIN chat_sessions cs ON c.session_id = cs.id
          ORDER BY c.created_at DESC
        `);
        return rows;
      } else {
        // Fallback to old format without session_id
        const [rows] = await connPool.execute(`
          SELECT c.*, k.title as keyword_title
          FROM chats c
          LEFT JOIN keywords k ON c.keyword_id = k.id
          ORDER BY c.created_at DESC
        `);
        return rows;
      }
    } catch (error) {
      throw new Error(`Error fetching chats: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      // Check if session_id column exists
      const [columns] = await connPool.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'genai_db' 
        AND TABLE_NAME = 'chats' 
        AND COLUMN_NAME = 'session_id'
      `);
      
      if (columns.length > 0) {
        // Use new format with session_id
        const [rows] = await connPool.execute(`
          SELECT c.*, k.title as keyword_title, cs.title as session_title
          FROM chats c
          LEFT JOIN keywords k ON c.keyword_id = k.id
          LEFT JOIN chat_sessions cs ON c.session_id = cs.id
          WHERE c.id = ?
        `, [id]);
        return rows[0];
      } else {
        // Fallback to old format without session_id
        const [rows] = await connPool.execute(`
          SELECT c.*, k.title as keyword_title
          FROM chats c
          LEFT JOIN keywords k ON c.keyword_id = k.id
          WHERE c.id = ?
        `, [id]);
        return rows[0];
      }
    } catch (error) {
      throw new Error(`Error fetching chat: ${error.message}`);
    }
  }

  static async create(chatData) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const { session_id, user_message, ai_response, keyword_id, file_name, file_size } = chatData;
      
      // Check if session_id column exists
      const [columns] = await connPool.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'genai_db' 
        AND TABLE_NAME = 'chats' 
        AND COLUMN_NAME = 'session_id'
      `);
      
      if (columns.length > 0 && session_id) {
        // Use new format with session_id and file info
        const [result] = await connPool.execute(
          'INSERT INTO chats (session_id, user_message, ai_response, keyword_id, file_name, file_size, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [session_id, user_message, ai_response, keyword_id, file_name || null, file_size || null]
        );
        return { id: result.insertId, ...chatData };
      } else {
        // Fallback to old format without session_id and file info
        const [result] = await connPool.execute(
          'INSERT INTO chats (user_message, ai_response, keyword_id, created_at) VALUES (?, ?, ?, NOW())',
          [user_message, ai_response, keyword_id]
        );
        return { id: result.insertId, ...chatData };
      }
    } catch (error) {
      throw new Error(`Error creating chat: ${error.message}`);
    }
  }

  static async getBySessionId(sessionId) {
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
      
      if (tables.length > 0) {
        // Use new format with session_id
        const [rows] = await connPool.execute(`
          SELECT c.*, k.title as keyword_title
          FROM chats c
          LEFT JOIN keywords k ON c.keyword_id = k.id
          WHERE c.session_id = ?
          ORDER BY c.created_at ASC
        `, [sessionId]);
        return rows;
      } else {
        // Return empty array if sessions not set up yet
        return [];
      }
    } catch (error) {
      throw new Error(`Error fetching chats by session: ${error.message}`);
    }
  }

  static async getByKeywordId(keywordId) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      // Check if session_id column exists
      const [columns] = await connPool.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'genai_db' 
        AND TABLE_NAME = 'chats' 
        AND COLUMN_NAME = 'session_id'
      `);
      
      if (columns.length > 0) {
        // Use new format with session_id
        const [rows] = await connPool.execute(`
          SELECT c.*, k.title as keyword_title, cs.title as session_title
          FROM chats c
          LEFT JOIN keywords k ON c.keyword_id = k.id
          LEFT JOIN chat_sessions cs ON c.session_id = cs.id
          WHERE c.keyword_id = ?
          ORDER BY c.created_at DESC
        `, [keywordId]);
        return rows;
      } else {
        // Fallback to old format without session_id
        const [rows] = await connPool.execute(`
          SELECT c.*, k.title as keyword_title
          FROM chats c
          LEFT JOIN keywords k ON c.keyword_id = k.id
          WHERE c.keyword_id = ?
          ORDER BY c.created_at DESC
        `, [keywordId]);
        return rows;
      }
    } catch (error) {
      throw new Error(`Error fetching chats by keyword: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [result] = await connPool.execute('DELETE FROM chats WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting chat: ${error.message}`);
    }
  }

  static async deleteBySessionId(sessionId) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [result] = await connPool.execute('DELETE FROM chats WHERE session_id = ?', [sessionId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting chats by session: ${error.message}`);
    }
  }

  static async deleteByKeywordId(keywordId) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [result] = await connPool.execute('DELETE FROM chats WHERE keyword_id = ?', [keywordId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting chats by keyword: ${error.message}`);
    }
  }
}

module.exports = Chat; 