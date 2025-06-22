const express = require('express');
const router = express.Router();
const {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  addChatToSession
} = require('../controllers/chatSessionController');

// Get all chat sessions
router.get('/', getAllSessions);

// Get chat session by ID with all chats
router.get('/:id', getSessionById);

// Create new chat session
router.post('/', createSession);

// Update chat session title
router.put('/:id', updateSession);

// Delete chat session (soft delete)
router.delete('/:id', deleteSession);

// Add chat to existing session
router.post('/:sessionId/chats', addChatToSession);

module.exports = router; 