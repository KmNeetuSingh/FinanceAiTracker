import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { transactionsAPI } from '../services/api'; // ✅ fixed import

const UploadArea = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('statement', file);

    try {
      const response = await transactionsAPI.uploadStatement(formData);
      setUploadStatus({ type: 'success', message: response?.message || 'File uploaded and processed successfully!' });
      if (onUploadComplete) {
        const transactions = Array.isArray(response?.transactions) ? response.transactions : [];
        const totalTransactions = transactions.length;
        const totals = transactions.reduce((acc, t) => {
          const amount = Number(t.amount) || 0;
          if (amount > 0) acc.totalIncome += amount;
          if (amount < 0) acc.totalExpenses += Math.abs(amount);
          return acc;
        }, { totalIncome: 0, totalExpenses: 0 });
        onUploadComplete({
          success: true,
          message: response?.message || 'Upload successful',
          data: {
            totalTransactions,
            totalIncome: totals.totalIncome,
            totalExpenses: totals.totalExpenses,
            transactions,
          },
        });
      }
      // Redirect to dashboard after brief success toast
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Upload failed. Please try again.';
      setUploadStatus({ type: 'error', message });
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Processing your file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop the file here' : 'Drag & drop your bank statement'}
            </p>
            <p className="text-sm text-gray-500">CSV, TXT, or PDF files accepted</p>
            <p className="text-xs text-gray-400 mt-2">Click to browse files</p>
          </div>
        )}
      </div>

      {uploadStatus && (
        <div
          className={`p-4 rounded-lg flex items-start ${
            uploadStatus.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
          )}
          <p
            className={
              uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }
          >
            {uploadStatus.message}
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Supported Formats
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• CSV files with Date, Description, Amount columns</li>
          <li>• Text files with transaction data</li>
          <li>• PDF bank statements (limited support)</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadArea;
