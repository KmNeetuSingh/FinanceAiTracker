const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, extractTextFromFile } = require('../utils/fileUpload');
const { parseStatementWithAI } = require('../utils/aiParser');
const Transaction = require('../model/Transaction');

// Upload and process bank statement
router.post('/', auth, upload.single('statement'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from file based on type
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let textContent;
    
    try {
      textContent = await extractTextFromFile(req.file.path, fileExt);
    } catch (error) {
      return res.status(400).json({ error: `Error reading file: ${error.message}` });
    }

    // Process with AI
    let transactions;
    try {
      transactions = await parseStatementWithAI(textContent);
    } catch (error) {
      return res.status(500).json({ error: `AI processing failed: ${error.message}` });
    }

    // Save transactions to database
    const transactionPromises = transactions.map(transaction => {
      return new Transaction({
        ...transaction,
        userId: req.user._id,
        sourceFile: req.file.filename
      }).save();
    });

    const savedTransactions = await Promise.all(transactionPromises);

    res.json({
      success: true,
      message: `Processed ${savedTransactions.length} transactions successfully`,
      transactions: savedTransactions
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file in case of error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ error: 'Server error during file processing' });
  }
});

module.exports = router;