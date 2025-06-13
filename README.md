# GenAI Backend - CRUD API

Backend API untuk operasi CRUD (Create, Read, Update, Delete) dengan database MySQL.

## Fitur

- ✅ CRUD operations untuk User
- ✅ Database MySQL dengan connection pool
- ✅ CORS support untuk frontend
- ✅ Error handling yang baik
- ✅ Validasi input
- ✅ RESTful API endpoints

## Struktur Proyek

```
genai-backend/
├── app.js                 # Entry point aplikasi
├── package.json           # Dependencies
├── .env                   # Environment variables
├── models/
│   └── User.js           # Model untuk operasi database
├── controllers/
│   ├── aiController.js   # Controller AI (existing)
│   └── userController.js # Controller CRUD user
├── routes/
│   ├── aiRoutes.js       # Routes AI (existing)
│   └── userRoutes.js     # Routes CRUD user
├── utils/
│   ├── db.js            # Database connection
│   └── fileParser.js    # File parser (existing)
├── database/
│   └── schema.sql       # SQL schema untuk database
└── frontend-example.html # Contoh frontend untuk testing
```

## Instalasi

1. **Clone repository dan install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   - Buat database MySQL
   - Jalankan script SQL di `database/schema.sql`
   - Atau buat tabel manual:
   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE,
     phone VARCHAR(20),
     address TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

3. **Konfigurasi environment variables:**
   Buat file `.env` dengan konfigurasi berikut:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=your_database_name
   
   # Server Configuration
   PORT=5000
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

4. **Jalankan server:**
   ```bash
   npm start
   ```

## API Endpoints

### User CRUD Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Mengambil semua user |
| GET | `/api/users/:id` | Mengambil user berdasarkan ID |
| POST | `/api/users` | Membuat user baru |
| PUT | `/api/users/:id` | Mengupdate user |
| DELETE | `/api/users/:id` | Menghapus user |

### Request/Response Format

#### Create User (POST /api/users)
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "address": "Jl. Contoh No. 123"
}

// Response
{
  "success": true,
  "message": "User berhasil ditambahkan",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "address": "Jl. Contoh No. 123"
  }
}
```

#### Get All Users (GET /api/users)
```json
// Response
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "081234567890",
      "address": "Jl. Contoh No. 123",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Testing

### Menggunakan Frontend Example

1. Buka file `frontend-example.html` di browser
2. Pastikan server backend berjalan di port 5000
3. Test semua operasi CRUD melalui interface

### Menggunakan Postman/Insomnia

1. Import collection dengan endpoints berikut:
   - `GET http://localhost:5000/api/users`
   - `POST http://localhost:5000/api/users`
   - `GET http://localhost:5000/api/users/:id`
   - `PUT http://localhost:5000/api/users/:id`
   - `DELETE http://localhost:5000/api/users/:id`

### Menggunakan cURL

```bash
# Get all users
curl -X GET http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"081234567890","address":"Jl. Contoh No. 123"}'

# Get user by ID
curl -X GET http://localhost:5000/api/users/1

# Update user
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated","email":"john@example.com","phone":"081234567890","address":"Jl. Baru No. 456"}'

# Delete user
curl -X DELETE http://localhost:5000/api/users/1
```

## Integrasi dengan Frontend

### JavaScript/Fetch API
```javascript
const API_BASE_URL = 'http://localhost:5000/api/users';

// Create user
const createUser = async (userData) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Get all users
const getUsers = async () => {
  const response = await fetch(API_BASE_URL);
  return response.json();
};

// Update user
const updateUser = async (id, userData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Delete user
const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};
```

### React Example
```jsx
import { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User Management</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name} - {user.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Error Handling

API mengembalikan response dengan format yang konsisten:

```json
{
  "success": false,
  "message": "Pesan error",
  "error": "Detail error (opsional)"
}
```

## CORS Configuration

Backend sudah dikonfigurasi untuk menerima request dari frontend dengan CORS. Pastikan URL frontend sesuai dengan konfigurasi di `.env`.

## Troubleshooting

### Database Connection Error
- Pastikan MySQL server berjalan
- Periksa konfigurasi database di `.env`
- Pastikan database dan tabel sudah dibuat

### CORS Error
- Periksa URL frontend di konfigurasi CORS
- Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend

### Port Already in Use
- Ganti port di `.env` atau hentikan proses yang menggunakan port tersebut

## Dependencies

- `express`: Web framework
- `mysql2`: MySQL driver
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables
- `@google/genai`: Google AI (existing)
- `multer`: File upload (existing)
- `pdf-parse`: PDF parsing (existing)
- `xlsx`: Excel parsing (existing)

