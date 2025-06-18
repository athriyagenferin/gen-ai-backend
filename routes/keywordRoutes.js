const express = require('express');
const router = express.Router();
const {
  getAllKeywords,
  getKeywordById,
  createKeyword,
  updateKeyword,
  deleteKeyword,
  searchKeywords
} = require('../controllers/keywordController');

// Get all keywords
router.get('/', getAllKeywords);

// Search keywords by title
router.get('/search', searchKeywords);

// Get keyword by ID
router.get('/:id', getKeywordById);

// Create new keyword
router.post('/', createKeyword);

// Update keyword
router.put('/:id', updateKeyword);

// Delete keyword
router.delete('/:id', deleteKeyword);

module.exports = router; 