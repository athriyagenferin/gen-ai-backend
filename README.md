# Gemini Clone - GenAI Chat App

Aplikasi kloning Google Gemini berbasis **React** (frontend) dan **Node.js/Express** (backend) dengan integrasi AI, multi-session chat, upload file, dan manajemen keyword.

---

## 🚀 Fitur Utama

- **Chat AI Multisession**: Simpan riwayat chat dalam beberapa sesi berbeda.
- **Integrasi AI (Gemini/Google Generative AI)**: Jawaban AI cerdas, bisa diubah modelnya.
- **Manajemen Keyword**: CRUD keyword prompt untuk customisasi instruksi AI.
- **Upload & Analisis File**: Kirim file (PDF, DOCX, XLSX) untuk dianalisis AI.
- **Database Relasional**: Semua data chat, sesi, dan keyword tersimpan di MySQL.
- **Frontend Modern**: UI responsif dengan React, Vite, dan komponen modular.
- **API Terbuka**: Endpoint RESTful untuk integrasi lebih lanjut.
- **CORS & Keamanan**: Mendukung integrasi lintas domain.

---

## 🏗️ Struktur Project

```
genai/
├── gemini-clone/         # Frontend (React)
│   ├── src/
│   │   ├── components/   # Komponen utama (Main, Sidebar, FileUpload, dsb)
│   │   ├── services/     # API service (axios)
│   │   ├── config/       # Konfigurasi (AI, dsb)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # Context API
│   │   └── App.jsx, main.jsx, index.css
│   └── public/
│
└── genai-backend/        # Backend (Node.js/Express)
    ├── app.js            # Entry point
    ├── controllers/      # Logika utama (AI, chat, keyword, session)
    ├── routes/           # API endpoints
    ├── models/           # Model database
    ├── database/         # schema.sql
    ├── uploads/          # File upload sementara
    └── utils/            # Utility (parser file, koneksi DB)
```

---

## ⚙️ Instalasi & Menjalankan

### 1. **Clone Repo & Install Dependencies**

```bash
# Frontend
cd gemini-clone
npm install

# Backend
cd ../genai-backend
npm install
```

### 2. **Setup Database**

- Pastikan MySQL aktif.
- Import `genai-backend/database/schema.sql` via phpMyAdmin atau MySQL CLI.

### 3. **Konfigurasi Environment**

Salin `.env.example` ke `.env` di folder backend, lalu isi:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=genai_db
```

### 4. **Jalankan Aplikasi**

```bash
# Backend
cd genai-backend
npm run dev

# Frontend (tab baru)
cd gemini-clone
npm run dev
```
Frontend: [http://localhost:5173](http://localhost:5173)  
Backend: [http://localhost:5000](http://localhost:5000)

---

## 🧠 Cara Kerja Singkat

1. **User** mengetik pesan/chat di frontend.
2. **Frontend** mengirim request ke backend (API).
3. **Backend** memproses, menyimpan chat, dan memanggil AI (Gemini/Google Generative AI).
4. **AI** membalas, backend mengirim balasan ke frontend.
5. **Frontend** menampilkan balasan, riwayat chat tersimpan per sesi.

---

## 📡 API Endpoints (Backend)

- **AI Chat**
  - `POST /api/ask/text` — Kirim chat teks ke AI
  - `POST /api/ask/file` — Upload file untuk dianalisis AI
- **Keyword**
  - `GET /api/keywords` — List keyword
  - `POST /api/keywords` — Tambah keyword
  - `PUT /api/keywords/:id` — Edit keyword
  - `DELETE /api/keywords/:id` — Hapus keyword
- **Chat**
  - `GET /api/chats` — Semua chat
  - `GET /api/chats/:id` — Detail chat
  - `DELETE /api/chats/:id` — Hapus chat
- **Session**
  - `GET /api/sessions` — Semua sesi chat
  - `POST /api/sessions` — Buat sesi baru
  - `PUT /api/sessions/:id` — Edit judul sesi
  - `DELETE /api/sessions/:id` — Hapus sesi

---

## 🗄️ Struktur Database

- **keywords**: id, title, prompt, created_at, updated_at
- **chat_sessions**: id, title, first_message, created_at, updated_at, is_active
- **chats**: id, session_id, user_message, ai_response, keyword_id, created_at

---

## 🖼️ Fitur Frontend

- **Sidebar**: Navigasi sesi chat, tambah/hapus sesi.
- **Main Chat**: Area chat dengan AI, dukungan markdown, highlight kode.
- **File Upload**: Kirim file untuk dianalisis AI.
- **KeywordPage**: Kelola prompt keyword.
- **Testing**: Komponen untuk pengujian fitur.

---

## 🧩 Teknologi yang Digunakan

- **Frontend**: React, Vite, Axios, React Router, React Markdown, Lucide Icons
- **Backend**: Node.js, Express, MySQL, Multer (upload), Google Generative AI SDK
- **Database**: MySQL
- **Lainnya**: ESLint, dotenv, cors, pdf-parse, mammoth, xlsx

---

## 📝 FAQ

**Q: Apakah ini pakai Gemini asli dari Google?**  
A: Backend terintegrasi dengan Google Generative AI (Gemini) via API key. Bisa diganti model lain jika diinginkan.

**Q: Apakah data chat saya aman?**  
A: Data hanya tersimpan di server lokal/developer, tidak dikirim ke pihak ketiga selain API AI.

**Q: Bisa upload file apa saja?**  
A: PDF, DOCX, XLSX. File dihapus otomatis setelah diproses.

**Q: Bagaimana mengatur panjang respon AI?**  
A: Saat ini mengikuti default model Gemini. Untuk custom, edit parameter di backend (`aiController.js`).

---

## 🐞 Troubleshooting

- **Database Error**: Pastikan MySQL aktif & konfigurasi benar.
- **CORS Error**: Pastikan frontend & backend berjalan di port yang diizinkan.
- **File Upload Error**: Pastikan folder `uploads/` ada & permission write.

---

## 📬 Kontribusi

Pull request & issue sangat diterima!  
Silakan fork, buat branch, dan ajukan PR.

---

## 📄 Lisensi

MIT License

---
