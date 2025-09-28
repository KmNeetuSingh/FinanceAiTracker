import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { transactionsAPI } from '../services/api'; // ✅ fixed import

const UploadArea = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  // const [uploadStatus, setUploadStatus] = useState(null); // Removed
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    // setUploadStatus(null); // Removed

    const formData = new FormData();
    formData.append('statement', file);

    try {
      const response = await transactionsAPI.uploadStatement(formData);
      // setUploadStatus({ type: 'success', message: response?.message || 'File uploaded and processed successfully!' }); // Removed
      if (onUploadComplete) {
        // Pass the entire response object
        onUploadComplete({
          success: true,
          message: response?.message || 'Upload successful',
          data: {
            totalTransactions: response.transactions.length,
            totalIncome: response.financeSummary.totalIncome,
            totalExpenses: response.financeSummary.totalExpense,
            transactions: response.transactions,
          },
          financeSummary: response.financeSummary, // Pass the finance summary
        });
      }
      // Redirect to dashboard after brief success toast
      // setTimeout(() => navigate('/dashboard'), 800); // Removed redirection
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Upload failed. Please try again.';
      // setUploadStatus({ type: 'error', message }); // Removed
      if (onUploadComplete) {
        onUploadComplete({
          success: false,
          message: message,
          data: null,
          financeSummary: null,
        });
      }
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
            <p className="text-white-600">Processing your file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-white-400 mb-4" />
            <p className="text-lg font-medium text-white-900 mb-2">
              {isDragActive ? 'Drop the file here' : 'Drag & drop your bank statement'}
            </p>
            <p className="text-sm text-gray-500">CSV, TXT, or PDF files accepted</p>
            <p className="text-xs text-gray-400 mt-2">Click to browse files</p>
          </div>
        )}
      </div>

      {/* Removed uploadStatus and its related JSX */}

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
