-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS your_database_name;
USE your_database_name;

-- Buat tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);

-- Insert sample data (opsional)
INSERT INTO users (name, email, phone, address) VALUES
('John Doe', 'john@example.com', '081234567890', 'Jl. Contoh No. 123'),
('Jane Smith', 'jane@example.com', '081234567891', 'Jl. Sample No. 456'),
('Bob Johnson', 'bob@example.com', '081234567892', 'Jl. Test No. 789'); 