import { useState } from 'react';
import UploadArea from '../components/UploadArea';
import { AlertCircle, CheckCircle, FileText, RefreshCw } from 'lucide-react';

const Upload = () => {
  const [uploadResult, setUploadResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadComplete = (result) => {
    setUploadResult(result);
  };

  const handleProcessNew = () => {
    setUploadResult(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white-900">Upload Bank Statement</h1>
        {uploadResult && (
          <button
            onClick={handleProcessNew}
            className="btn btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Process New File
          </button>
        )}
      </div>

      {!uploadResult ? (
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-lg font-semibold text-white-900 mb-4">
              Upload your bank statement
            </h2>
            <p className="text-white-600 mb-6">
              Upload your bank statement in CSV, TXT, or PDF format. Our AI will automatically
              categorize and process your transactions.
            </p>
            
            <UploadArea onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className={`p-4 rounded-lg mb-6 flex items-center ${
            uploadResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {uploadResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            )}
            <span className={
              uploadResult.success ? 'text-green-800' : 'text-red-800'
            }>
              {uploadResult.message}
            </span>
          </div>

          {uploadResult.data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {uploadResult.data.totalTransactions}
                </div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
              
              <div className="card text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  ₹{uploadResult.data.totalIncome?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Income</div>
              </div>
              
              <div className="card text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  ₹{uploadResult.data.totalExpenses?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Expenses</div>
              </div>
            </div>
          )}

          {uploadResult.data?.transactions && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Processed Transactions
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadResult.data.transactions.slice(0, 10).map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}₹
                          {Math.abs(transaction.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {uploadResult.data.transactions.length > 10 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing first 10 of {uploadResult.data.transactions.length} transactions
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;