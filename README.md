# GenAI Backend - Integrasi Frontend-Backend

Backend server untuk aplikasi GenAI yang terintegrasi dengan frontend React.

## 🚀 Fitur

- **AI Chat Integration** - Integrasi dengan Google Gemini AI
- **Keyword Management** - CRUD operasi untuk keyword prompts
- **Chat History** - Penyimpanan riwayat chat di database
- **File Upload** - Upload dan proses file (PDF, DOCX, XLSX)
- **Database Integration** - MySQL database dengan phpMyAdmin
- **CORS Support** - Dukungan untuk frontend React

## 📋 Prerequisites

- Node.js (v16 atau lebih baru)
- MySQL Server
- phpMyAdmin (untuk manajemen database)
- Google Gemini AI API Key

## 🛠️ Instalasi

1. **Clone repository dan install dependencies:**
```bash
npm install
```

2. **Setup Database:**
   - Buka phpMyAdmin
   - Import file `database/schema.sql`
   - Atau jalankan query SQL secara manual

3. **Konfigurasi Environment:**
   - Copy `.env.example` ke `.env`
   - Isi konfigurasi database dan API key

4. **Install dependencies tambahan:**
```bash
npm install cors mysql2
```

## 🔧 Konfigurasi

### Environment Variables (.env)
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=genai_db
```

### Database Schema
- **keywords** - Tabel untuk menyimpan keyword prompts
- **chats** - Tabel untuk menyimpan riwayat chat

## 🚀 Menjalankan Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /health
```

### AI Chat
```
POST /api/ask/text
POST /api/ask/file
```

### Keywords Management
```
GET    /api/keywords          # Get all keywords
GET    /api/keywords/:id      # Get keyword by ID
POST   /api/keywords          # Create new keyword
PUT    /api/keywords/:id      # Update keyword
DELETE /api/keywords/:id      # Delete keyword
GET    /api/keywords/search   # Search keywords by title
```

### Chat History
```
GET    /api/chats             # Get all chats
GET    /api/chats/:id         # Get chat by ID
POST   /api/chats             # Create new chat
GET    /api/chats/keyword/:id # Get chats by keyword
DELETE /api/chats/:id         # Delete chat
```

## 🔄 Integrasi Frontend

### CORS Configuration
Backend sudah dikonfigurasi untuk menerima request dari:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Create React App)
- `http://127.0.0.1:5173`

### Contoh Request dari Frontend

#### Chat dengan AI
```javascript
// Text chat
const response = await fetch('http://localhost:5000/api/ask/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Hello AI',
    keyword_id: 1 // optional
  })
});

// File upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/ask/file', {
  method: 'POST',
  body: formData
});
```

#### Keyword Management
```javascript
// Get all keywords
const keywords = await fetch('http://localhost:5000/api/keywords').then(r => r.json());

// Create keyword
const newKeyword = await fetch('http://localhost:5000/api/keywords', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Keyword',
    prompt: 'Prompt text',
    category: 'general'
  })
}).then(r => r.json());
```

## 📁 Struktur Project

```
genai-backend/
├── app.js                 # Entry point
├── package.json           # Dependencies
├── routes/                # API routes
│   ├── aiRoutes.js       # AI endpoints
│   ├── keywordRoutes.js  # Keyword endpoints
│   └── chatRoutes.js     # Chat endpoints
├── controllers/           # Business logic
│   ├── aiController.js   # AI processing
│   ├── keywordController.js # Keyword CRUD
│   └── chatController.js # Chat history
├── models/               # Database models
│   ├── Keyword.js       # Keyword model
│   └── Chat.js          # Chat model
├── utils/               # Utilities
│   ├── fileParser.js    # File parsing
│   └── db.js           # Database connection
├── database/            # Database files
│   └── schema.sql      # Database schema
└── uploads/            # File upload directory
```

## 🔍 Testing API

### Health Check
```bash
curl http://localhost:5000/health
```

### Test AI Chat
```bash
curl -X POST http://localhost:5000/api/ask/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello AI"}'
```

### Test Keywords
```bash
# Get all keywords
curl http://localhost:5000/api/keywords

# Create keyword
curl -X POST http://localhost:5000/api/keywords \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "prompt": "Test prompt", "category": "test"}'
```

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan MySQL server berjalan
- Periksa konfigurasi database di `.env`
- Pastikan database `genai_db` sudah dibuat

### CORS Error
- Periksa origin frontend di konfigurasi CORS
- Pastikan frontend berjalan di port yang benar

### File Upload Error
- Pastikan folder `uploads/` ada dan memiliki permission write
- Periksa ukuran file (default max 50MB)

## 📝 Notes

- File yang diupload akan dihapus setelah diproses
- Chat history otomatis tersimpan ke database
- Keyword bisa dikategorikan untuk organisasi yang lebih baik
- API responses menggunakan format standar dengan `success` dan `data/error` fields
