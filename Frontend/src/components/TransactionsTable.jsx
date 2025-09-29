import { useState, useEffect } from 'react';
import { Edit3, Trash2, Filter, Search } from 'lucide-react';

const TransactionsTable = ({
  transactions,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalTransactions,
  limit,
  onPageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Update filters when transactions change to avoid stale filter options
  const categories = [...new Set(transactions.map(t => t.category))].filter(Boolean);
  const types = ['income', 'expense'];

  // Filter transactions based on search and selected filters
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
        <p className="text-white">No transactions found. Upload a bank statement to get started.</p>
      </div>
    );
  }

  return (
    <div className="card text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-white">Transactions</h2>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-white mr-2" />
          <span className="text-sm text-white mr-2">Filter:</span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <table className="min-w-full divide-y divide-gray-200 text-white">
          <thead className="bg-gray-50 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-black">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-600 px-4 py-3 mt-4 bg-gray-800">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white-500">
                Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * limit, totalTransactions)}</span> of{' '}
                <span className="font-medium">{totalTransactions}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium text-white-500 hover:bg-gray-600 disabled:opacity-50"
                >
                  <span>Previous</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium ${
                      page === currentPage ? 'z-10 bg-blue-600 border-blue-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium text-white-500 hover:bg-gray-600 disabled:opacity-50"
                >
                  <span>Next</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* No match */}
      {filteredTransactions.length === 0 && transactions.length > 0 && (
        <div className="text-center py-10">
          <p className="text-white">No transactions match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
