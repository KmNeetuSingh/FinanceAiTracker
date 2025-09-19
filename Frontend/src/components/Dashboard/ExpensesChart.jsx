import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ExpenseChart = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="card h-80 flex items-center justify-center">
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white-900 mb-4">Expense Breakdown</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;