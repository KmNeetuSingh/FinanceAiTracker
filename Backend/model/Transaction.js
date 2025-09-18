const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['food', 'utilities', 'entertainment', 'transportation', 'healthcare', 'shopping', 'income', 'transfer', 'other'],
    default: 'other'
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  merchant: {
    type: String,
    default: '',
    trim: true
  },
  sourceFile: {
    type: String,
    default: ''
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);