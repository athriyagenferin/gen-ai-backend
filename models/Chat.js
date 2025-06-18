const { getConnectionPool } = require('../utils/db');

class Chat {
  static async getAll() {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [rows] = await connPool.execute('SELECT * FROM chats ORDER BY created_at DESC');
      return rows;
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
      
      const [rows] = await connPool.execute('SELECT * FROM chats WHERE id = ?', [id]);
      return rows[0];
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
      
      const { user_message, ai_response, keyword_id } = chatData;
      const [result] = await connPool.execute(
        'INSERT INTO chats (user_message, ai_response, keyword_id, created_at) VALUES (?, ?, ?, NOW())',
        [user_message, ai_response, keyword_id]
      );
      return { id: result.insertId, ...chatData };
    } catch (error) {
      throw new Error(`Error creating chat: ${error.message}`);
    }
  }

  static async getByKeywordId(keywordId) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [rows] = await connPool.execute(
        'SELECT * FROM chats WHERE keyword_id = ? ORDER BY created_at DESC',
        [keywordId]
      );
      return rows;
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