import { useState } from 'react';
import { Edit3, Trash2, Filter, Search } from 'lucide-react';

const TransactionsTable = ({ transactions, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const categories = [...new Set(transactions.map(t => t.category))].filter(Boolean);
  const types = ['income', 'expense'];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const formatAmount = (amount, type) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
    return type === 'expense' ? `-${formatted}` : formatted;
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-orange-100 text-orange-800',
      shopping: 'bg-blue-100 text-blue-800',
      utilities: 'bg-purple-100 text-purple-800',
      transportation: 'bg-green-100 text-green-800',
      entertainment: 'bg-pink-100 text-pink-800',
      healthcare: 'bg-red-100 text-red-800',
      income: 'bg-emerald-100 text-emerald-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  if (transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-black">No transactions found. Upload a bank statement to get started.</p>
      </div>
    );
  }

  return (
    <div className="card text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-black">Transactions</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-black mr-2" />
          <span className="text-sm text-black mr-2">Filter:</span>
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
        >
          <option value="all">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-black">
          <thead className="bg-gray-50 text-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="max-w-xs truncate" title={transaction.description}>{transaction.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button onClick={() => onEdit(transaction)} className="text-blue-700 hover:text-blue-900" title="Edit transaction">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(transaction._id)} className="text-red-700 hover:text-red-900" title="Delete transaction">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No match */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-black">No transactions match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
