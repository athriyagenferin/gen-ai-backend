const Chat = require('../models/Chat');

// Get all chats
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.getAll();
    res.json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.getById(id);
    
    if (!chat) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }
    
    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new chat
exports.createChat = async (req, res) => {
  try {
    const { user_message, ai_response, keyword_id } = req.body;
    
    if (!user_message || !ai_response) {
      return res.status(400).json({ 
        success: false, 
        error: 'User message and AI response are required' 
      });
    }
    
    const newChat = await Chat.create({ user_message, ai_response, keyword_id });
    res.status(201).json({ success: true, data: newChat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get chats by keyword ID
exports.getChatsByKeyword = async (req, res) => {
  try {
    const { keywordId } = req.params;
    const chats = await Chat.getByKeywordId(keywordId);
    res.json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Chat.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Chat not found' });
    }
    
    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 