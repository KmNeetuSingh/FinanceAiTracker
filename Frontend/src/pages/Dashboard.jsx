import { useState, useEffect } from "react";
import { transactionsAPI } from "../services/api";
import SummaryCards from "../components/Dashboard/SummaryCard";
import ExpenseChart from "../components/Dashboard/ExpensesChart";
import TransactionsTable from "../components/TransactionsTable";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Track errors

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to view the dashboard.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

  
      const [summaryResponse, transactionsResponse] = await Promise.all([
        transactionsAPI.getDashboardSummary(),
        transactionsAPI.getAll(),
      ]);

      setDashboardData(summaryResponse); // direct data from backend
      const txns = Array.isArray(transactionsResponse)
        ? transactionsResponse
        : transactionsResponse?.transactions || [];
      setTransactions(txns);
    } catch (err) {
      console.error("Error fetching dashboard data:", err.response?.data || err.message);
      setError("Failed to load dashboard. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    const confirmed = window.confirm('Delete this transaction?');
    if (!confirmed) return;
    try {
      await transactionsAPI.delete(transactionId);
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
      // Optionally refresh summary
      try {
        const summaryResponse = await transactionsAPI.getDashboardSummary();
        setDashboardData(summaryResponse);
      } catch (_) {}
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete transaction');
    }
  };

  const handleEdit = async (transaction) => {
    try {
      const description = window.prompt('Description', transaction.description);
      if (description === null) return;
      const amountInput = window.prompt('Amount (use negative for expense)', String(transaction.amount));
      if (amountInput === null) return;
      const amount = Number(amountInput);
      if (Number.isNaN(amount)) {
        alert('Amount must be a number');
        return;
      }
      const category = window.prompt('Category', transaction.category || 'other');
      if (category === null) return;
      const date = window.prompt('Date (YYYY-MM-DD)', new Date(transaction.date).toISOString().slice(0,10));
      if (date === null) return;
      const type = amount >= 0 ? 'income' : 'expense';

      const updates = { description, amount, category, date, type };
      const updated = await transactionsAPI.update(transaction._id, updates);
      const updatedTx = updated?.transaction || { ...transaction, ...updates };
      setTransactions((prev) => prev.map((t) => (t._id === transaction._id ? updatedTx : t)));
      // Optionally refresh summary
      try {
        const summaryResponse = await transactionsAPI.getDashboardSummary();
        setDashboardData(summaryResponse);
      } catch (_) {}
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update transaction');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {dashboardData && (
        <>
          <SummaryCards data={dashboardData.summary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ExpenseChart data={dashboardData.categoryBreakdown} />

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()} •{" "}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.category}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`font-medium ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <TransactionsTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Dashboard;
