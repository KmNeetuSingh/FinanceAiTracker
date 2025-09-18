const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../model/Transaction');

// Get all transactions for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, category, type } = req.query;
    
    // Build filter object
    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (type) filter.type = type;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { date: -1 }
    };
    
    const transactions = await Transaction.find(filter)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);
    
    const total = await Transaction.countDocuments(filter);
    
    res.json({
      transactions,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Error fetching transaction' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { description, amount, category, date, merchant, type } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        description, 
        amount, 
        category, 
        date, 
        merchant, 
        type,
        isEdited: true 
      },
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

// Get financial summary
router.get('/dashboard/summary', auth, async (req, res) => {
  try {
    // Get all transactions for the user
    const transactions = await Transaction.find({ userId: req.user._id });
    
    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const netBalance = totalIncome - totalExpenses;
    
    // Category-wise breakdown (only for expenses)
    const categoryBreakdown = {};
    transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const amount = Math.abs(t.amount);
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + amount;
      });
    
    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance
      },
      categoryBreakdown,
      transactionCount: transactions.length
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Error generating dashboard summary' });
  }
});

module.exports = router;