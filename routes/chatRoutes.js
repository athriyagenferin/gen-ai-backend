const express = require('express');
const router = express.Router();
const {
  getAllChats,
  getChatById,
  createChat,
  getChatsByKeyword,
  deleteChat
} = require('../controllers/chatController');

// Get all chats
router.get('/', getAllChats);

// Get chats by keyword ID (static route must come before dynamic)
router.get('/keyword/:keywordId', getChatsByKeyword);

// Get chat by ID
router.get('/:id', getChatById);

// Create new chat
router.post('/', createChat);

// Delete chat
router.delete('/:id', deleteChat);

module.exports = router; 