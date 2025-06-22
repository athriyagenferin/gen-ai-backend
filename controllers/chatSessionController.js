const ChatSession = require('../models/ChatSession');
const Chat = require('../models/Chat');

// Get all chat sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.getAll();
    res.json({ sessions });
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get chat session by ID with all chats
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await ChatSession.getById(id);
    
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    const chats = await Chat.getBySessionId(id);
    res.json({ session, chats });
  } catch (error) {
    console.error('Error getting chat session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create new chat session
exports.createSession = async (req, res) => {
  try {
    const { title, first_message } = req.body;
    
    if (!first_message) {
      return res.status(400).json({ error: 'First message is required' });
    }
    
    const sessionTitle = title || ChatSession.generateTitle(first_message);
    const session = await ChatSession.create({
      title: sessionTitle,
      first_message: first_message
    });
    
    res.status(201).json({ session });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update chat session title
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const success = await ChatSession.update(id, { title });
    
    if (!success) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    res.json({ message: 'Chat session updated successfully' });
  } catch (error) {
    console.error('Error updating chat session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete chat session (soft delete)
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await ChatSession.delete(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add chat to existing session
exports.addChatToSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { user_message, ai_response, keyword_id } = req.body;
    
    if (!user_message || !ai_response) {
      return res.status(400).json({ error: 'User message and AI response are required' });
    }
    
    const chat = await Chat.create({
      session_id: sessionId,
      user_message,
      ai_response,
      keyword_id
    });
    
    res.status(201).json({ chat });
  } catch (error) {
    console.error('Error adding chat to session:', error);
    res.status(500).json({ error: error.message });
  }
}; 