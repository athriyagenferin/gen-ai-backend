const { getConnectionPool } = require('../utils/db');

class Keyword {
  static async getAll() {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [rows] = await connPool.execute('SELECT * FROM keywords ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error fetching keywords: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [rows] = await connPool.execute('SELECT * FROM keywords WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching keyword: ${error.message}`);
    }
  }

  static async create(keywordData) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const { title, prompt } = keywordData;
      
      // Validate required fields
      if (!title || typeof title !== 'string') {
        throw new Error('Title is required and must be a string');
      }
      
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt is required and must be a string');
      }
      
      const [result] = await connPool.execute(
        'INSERT INTO keywords (title, prompt, created_at) VALUES (?, ?, NOW())',
        [title, prompt]
      );
      
      return { 
        id: result.insertId, 
        title, 
        prompt,
        created_at: new Date()
      };
    } catch (error) {
      throw new Error(`Error creating keyword: ${error.message}`);
    }
  }

  static async update(id, keywordData) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const { title, prompt } = keywordData;
      
      // Validate required fields
      if (!title || typeof title !== 'string') {
        throw new Error('Title is required and must be a string');
      }
      
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt is required and must be a string');
      }
      
      const [result] = await connPool.execute(
        'UPDATE keywords SET title = ?, prompt = ?, updated_at = NOW() WHERE id = ?',
        [title, prompt, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating keyword: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [result] = await connPool.execute('DELETE FROM keywords WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting keyword: ${error.message}`);
    }
  }

  static async searchByTitle(title) {
    try {
      const connPool = getConnectionPool();
      if (!connPool) {
        throw new Error('Database connection not available');
      }
      
      const [rows] = await connPool.execute(
        'SELECT * FROM keywords WHERE title LIKE ? ORDER BY created_at DESC',
        [`%${title}%`]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error searching keywords: ${error.message}`);
    }
  }
}

module.exports = Keyword;