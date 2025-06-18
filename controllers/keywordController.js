const Keyword = require('../models/Keyword');

// Get all keywords
exports.getAllKeywords = async (req, res) => {
  try {
    const keywords = await Keyword.getAll();
    res.json({ success: true, data: keywords });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get keyword by ID
exports.getKeywordById = async (req, res) => {
  try {
    const { id } = req.params;
    const keyword = await Keyword.getById(id);
    
    if (!keyword) {
      return res.status(404).json({ success: false, error: 'Keyword not found' });
    }
    
    res.json({ success: true, data: keyword });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new keyword
exports.createKeyword = async (req, res) => {
  try {
    const { title, prompt } = req.body;
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Title is required and cannot be empty' 
      });
    }
    
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required and cannot be empty' 
      });
    }
    
    // Trim whitespace
    const cleanTitle = title.trim();
    const cleanPrompt = prompt.trim();
    
    const newKeyword = await Keyword.create({ 
      title: cleanTitle, 
      prompt: cleanPrompt 
    });
    
    res.status(201).json({ success: true, data: newKeyword });
  } catch (error) {
    console.error('Error creating keyword:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update keyword
exports.updateKeyword = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, prompt } = req.body;
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Title is required and cannot be empty' 
      });
    }
    
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required and cannot be empty' 
      });
    }
    
    // Trim whitespace
    const cleanTitle = title.trim();
    const cleanPrompt = prompt.trim();
    
    const updated = await Keyword.update(id, { 
      title: cleanTitle, 
      prompt: cleanPrompt 
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Keyword not found' });
    }
    
    res.json({ success: true, message: 'Keyword updated successfully' });
  } catch (error) {
    console.error('Error updating keyword:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete keyword
exports.deleteKeyword = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Keyword.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Keyword not found' });
    }
    
    res.json({ success: true, message: 'Keyword deleted successfully' });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Search keywords by title
exports.searchKeywords = async (req, res) => {
  try {
    const { title } = req.query;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Search title is required and cannot be empty' 
      });
    }
    
    const keywords = await Keyword.searchByTitle(title.trim());
    res.json({ success: true, data: keywords });
  } catch (error) {
    console.error('Error searching keywords:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}; 