import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { useMemo, useState } from "react";

/*
  transactions: full transaction array
*/
const filters = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "All", value: "all" }
];

const TransactionChart = ({ transactions }) => {
  const [range, setRange] = useState(30);

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    let filtered = transactions;

    if (range !== "all") {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - range);

      filtered = transactions.filter(
        tx => new Date(tx.date) >= fromDate
      );
    }

    // Group by date
    const grouped = {};

    filtered.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString();

      if (!grouped[date]) {
        grouped[date] = { date, income: 0, expense: 0 };
      }

      if (tx.type === "income") {
        grouped[date].income += tx.amount;
      } else {
        grouped[date].expense += tx.amount;
      }
    });

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, range]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Income vs Expense Trend
        </h3>

        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.label}
              onClick={() => setRange(f.value)}
              className={`px-3 py-1 text-sm rounded ${
                range === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#16a34a"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#dc2626"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TransactionChart;
