const express = require('express');
const dotenv = require('dotenv');
const aiRoutes = require('./routes/aiRoutes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/ask', aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
