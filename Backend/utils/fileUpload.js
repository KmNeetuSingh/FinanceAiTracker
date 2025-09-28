const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter for allowed formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.csv', '.txt'];
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, CSV, and text files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Extract text from different file types
const extractTextFromFile = async (filePath, fileType) => {
  try {
    if (fileType === '.txt') {
      return await fs.promises.readFile(filePath, 'utf8');
    } else if (fileType === '.csv') {
      const csv = require('csv-parser');
      const results = [];
      
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            // Convert CSV data to text format for AI processing
            const textContent = results.map(row => 
              Object.values(row).join(' | ')
            ).join('\n');
            resolve(textContent);
          })
          .on('error', reject);
      });
    } else if (fileType === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

const isBankStatement = (text) => {
  const keywords = ['account', 'balance', 'transaction', 'debit', 'credit', 'bank', 'statement', 'deposit', 'withdrawal', 'cheque', 'atm', 'transfer', 'salary', 'bill', 'payment', 'interest', 'fee', 'opening balance', 'closing balance', 'account number'];
  const lowerText = text.toLowerCase();
  const matches = keywords.filter(keyword => lowerText.includes(keyword));
  return matches.length >= 5;
};

module.exports = { upload, extractTextFromFile, isBankStatement };
