const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const path = require('path');

async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function parseDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

function parseXLSX(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_csv(sheet);
}

exports.parseFileContent = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') return await parsePDF(filePath);
  if (ext === '.docx') return await parseDOCX(filePath);
  if (ext === '.xlsx' || ext === '.xls') return parseXLSX(filePath);
  throw new Error('Unsupported file type.');
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
    res.status(500).json({ error: err.message });
  }
};