-- Database schema for GenAI Backend
-- Run this in your phpMyAdmin or MySQL client

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS genai_db;
USE genai_db;

-- Keywords table
CREATE TABLE IF NOT EXISTS keywords (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_created_at (created_at)
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    keyword_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE SET NULL,
    INDEX idx_keyword_id (keyword_id),
    INDEX idx_created_at (created_at)
);

-- Insert sample keywords
INSERT INTO keywords (title, prompt) VALUES
('Kritik Artikel', 'Berikan kritik dan saran untuk artikel berikut ini:'),
('Analisis Dokumen', 'Analisis dokumen berikut dan berikan ringkasan:'),
('Saran Konten', 'Berikan saran untuk meningkatkan konten berikut:'),
('Review Laporan', 'Review laporan berikut dan berikan feedback:'),
('Evaluasi Proposal', 'Evaluasi proposal berikut dan berikan rekomendasi:');