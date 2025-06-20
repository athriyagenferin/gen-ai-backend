const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { parseFileContent } = require('../utils/fileParser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

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
  const { text, keyword_id } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });

  try {
    const result = await callGeminiAPI(text);
    
    // Save chat history to database
    if (result) {
      await Chat.create({
        user_message: text,
        ai_response: result,
        keyword_id: keyword_id || null
      });
    }
    
    res.json({ response: result });
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
    const result = await callGeminiAPI(fileText);
    
    // Save chat history to database
    if (result) {
      await Chat.create({
        user_message: `[File Upload: ${req.file.originalname}] ${fileText.substring(0, 100)}...`,
        ai_response: result,
        keyword_id: null
      });
    }
    
    fs.unlinkSync(filePath); // delete file after processing
    res.json({ response: result });
  } catch (err) {
    console.error('Error in askFile:', err);
    res.status(500).json({ error: JSON.stringify(err.message) });
  }
};