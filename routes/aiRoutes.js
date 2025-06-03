const express = require('express');
const router = express.Router();
const multer = require('multer');
const { askText, askFile } = require('../controllers/aiController');

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
router.post('/text', askText);
router.post('/file', upload.single('file'), askFile);

module.exports = router;
