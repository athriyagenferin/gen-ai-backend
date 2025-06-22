const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { parseFileContent } = require('../utils/fileParser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const ChatSession = require('../models/ChatSession');
const Keyword = require('../models/Keyword');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGeminiAPI(text) {
    const genAI = new GoogleGenerativeAI("AIzaSyAba8AFgSwHLh1EtsCsJ9BgH9nxEAPBzIs");
    
    // List of models to try (in order of preference)
    const models = [
  
        "gemini-2.0-flash",
        // "gemini-1.5-flash",
        // "gemini-2.5-flash-preview-05-20"
        // "gemini-1.5-pro", 
        // "gemini-1.0-pro"
    ];
    
    const prompt = text;
    
    for (const modelName of models) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
    
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const textResponse = response.text();
            
            console.log(`✅ Success with model: ${modelName}`);
            console.log('AI Response:', textResponse);
            return textResponse;
            
        } catch (error) {
            console.error(`❌ Failed with model ${modelName}:`, error.message);
            // Continue to next model if this one fails
            continue;
        }
    }
    
    // If all models fail
    throw new Error('All Gemini models are unavailable. Please check your API key and try again later.');
}

exports.askText = async (req, res) => {
  const { text, keyword_id, session_id } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });

  try {
    let contextPrompt = '';
    if (session_id) {
      // Ambil seluruh chat sebelumnya dalam sesi ini
      const chats = await Chat.getBySessionId(session_id);
      if (chats && chats.length > 0) {
        // Gabungkan user_message dan ai_response secara berurutan
        contextPrompt = chats.map(chat => `User: ${chat.user_message}\nAI: ${chat.ai_response}`).join('\n');
        contextPrompt += '\n';
      }
    }
    // Tambahkan prompt baru user di akhir
    contextPrompt += `User: ${text}\nAI:`;

    const result = await callGeminiAPI(contextPrompt);
    
    // Save chat history to database
    if (result) {
      try {
        // Try to create session and chat
        let currentSessionId = session_id;
        
        // If no session_id provided, create a new session
        if (!currentSessionId) {
          const sessionTitle = ChatSession.generateTitle(text);
          const newSession = await ChatSession.create({
            title: sessionTitle,
            first_message: text
          });
          currentSessionId = newSession.id;
        }
        
        const chat = await Chat.create({
          session_id: currentSessionId,
          user_message: text,
          ai_response: result,
          keyword_id: keyword_id || null,
          file_name: req.file?.originalname,
          file_size: req.file?.size
        });
        
        res.json({ 
          response: result, 
          session_id: currentSessionId,
          chat_id: chat.id 
        });
      } catch (dbError) {
        console.error('Database error (sessions not ready):', dbError.message);
        // Fallback to old method without sessions
        try {
          await Chat.create({
            user_message: text,
            ai_response: result,
            keyword_id: keyword_id || null,
            file_name: req.file?.originalname,
            file_size: req.file?.size
          });
        } catch (fallbackError) {
          console.error('Fallback database error:', fallbackError.message);
        }
        // Still return the response even if database fails
        res.json({ response: result });
      }
    } else {
      res.json({ response: result });
    }
  } catch (err) {
    console.error('Error in askText:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.askFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required.' });

  try {
    const filePath = path.join(__dirname, '..', req.file.path);
    const fileText = await parseFileContent(filePath);
    const { keyword_id, text, session_id } = req.body;
    let keywordDesc = '';
    if (keyword_id) {
      const keyword = await Keyword.getById(keyword_id);
      if (keyword && keyword.prompt) {
        keywordDesc = keyword.prompt;
      }
    }
    let aiPrompt = `${fileText}\n`;
    if (keywordDesc) {
      aiPrompt += `\nInstruksi: ${keywordDesc}`;
    }
    if (text) {
      aiPrompt += `\nPertanyaan: ${text}`;
    }

    // Gabungkan konteks sesi (history chat) seperti pada askText
    let contextPrompt = '';
    if (session_id) {
      const chats = await Chat.getBySessionId(session_id);
      if (chats && chats.length > 0) {
        contextPrompt = chats.map(chat => `User: ${chat.user_message}\nAI: ${chat.ai_response}`).join('\n');
        contextPrompt += '\n';
      }
    }
    contextPrompt += `User: ${aiPrompt}\nAI:`;

    const result = await callGeminiAPI(contextPrompt);
    
    // Save chat history to database
    if (result) {
      try {
        let currentSessionId = session_id;
        
        // If no session_id provided, create a new session
        if (!currentSessionId) {
          const userMessage = `[File Upload: ${req.file.originalname}] ${text || 'Analyze this file'}`;
          const sessionTitle = ChatSession.generateTitle(userMessage);
          const newSession = await ChatSession.create({
            title: sessionTitle,
            first_message: userMessage
          });
          currentSessionId = newSession.id;
        }
        
        const chat = await Chat.create({
          session_id: currentSessionId,
          user_message: `[File Upload: ${req.file.originalname}] ${fileText.substring(0, 100)}...`,
          ai_response: result,
          keyword_id: keyword_id || null,
          file_name: req.file?.originalname,
          file_size: req.file?.size
        });
        
        fs.unlinkSync(filePath); // delete file after processing
        res.json({ 
          response: result, 
          session_id: currentSessionId,
          chat_id: chat.id 
        });
      } catch (dbError) {
        console.error('Database error (sessions not ready):', dbError.message);
        fs.unlinkSync(filePath);
        // Fallback to old method without sessions
        try {
          await Chat.create({
            user_message: `[File Upload: ${req.file.originalname}] ${fileText.substring(0, 100)}...`,
            ai_response: result,
            keyword_id: keyword_id || null,
            file_name: req.file?.originalname,
            file_size: req.file?.size
          });
        } catch (fallbackError) {
          console.error('Fallback database error:', fallbackError.message);
        }
        // Still return the response even if database fails
        res.json({ response: result });
      }
    } else {
      fs.unlinkSync(filePath);
      res.json({ response: result });
    }
  } catch (err) {
    console.error('Error in askFile:', err);
    res.status(500).json({ error: JSON.stringify(err.message) });
  }
};