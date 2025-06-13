const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { parseFileContent } = require('../utils/fileParser');
const { GoogleGenAI} = require('@google/genai')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGeminiAPI(text) {
    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
      });
      const config = {
        responseMimeType: 'text/plain',
        systemInstruction: 'kamu adalah seorang asisten pribadi yang memberi kritik dan saran untuk konten yang diberikan oleh user',
        // maxoutputTokens: 65.536,
        // temperature: 1.0,
    
      };
      // const model = 'gemini-2.0-flash';
      const model = 'gemini-2.5-flash-preview-05-20';
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: text,
            },
          ],
        },
      ];
    
      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });
      
      console.log(response.text);
      
      return response.text
}

exports.askText = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required.' });

  try {
    const result = await callGeminiAPI(text);
    res.json({ response: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.askFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File is required.' });

  try {
    const filePath = path.join(__dirname, '..', req.file.path);
    const fileText = await parseFileContent(filePath);
    const result = await callGeminiAPI(fileText);
    fs.unlinkSync(filePath); // delete file after processing
    res.json({ response: result });
  } catch (err) {
    res.status(500).json({ error: JSON.stringify(err.message) });
  }
};
