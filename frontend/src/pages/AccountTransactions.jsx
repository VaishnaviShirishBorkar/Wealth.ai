import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TransactionChart from "../components/TransactionChart";

const typeFilters = ["all", "income", "expense"];

const AccountTransactions = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [account, setAccount] = useState(null);


  const fetchTransactions = async () => {
    const res = await axios.get(
      `/api/transaction/account/${accountId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // console.log(res.data);
    
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, [accountId]);

  const fetchAccount = async () => {
  const res = await axios.get(
    `/api/account/${accountId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  setAccount(res.data);
   console.log(res.data);
};

useEffect(() => {
  fetchTransactions();
  fetchAccount();
}, [accountId]);


  const visibleTxs = transactions
    .filter(tx => (type === "all" ? true : tx.type === type))
    .filter(tx =>
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (txId) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this transaction?"
      );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `/api/transaction/${txId}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Transaction deleted successfully");

    // remove deleted transaction from UI
    setTransactions(prev =>
      prev.filter(tx => tx._id !== txId)
    );

  } catch (error) {
    console.error("Delete failed", error);
    alert("Failed to delete transaction");
  }
};

const currentMonthExpense = transactions
  .filter(tx => {
    const d = new Date(tx.date);
    const now = new Date();
    return (
      tx.type === "expense" &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  })
  .reduce((sum, tx) => sum + tx.amount, 0);


  return (
    <div className="min-h-screen bg-slate-100 text-black">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-10">

        <h2 className="text-2xl font-bold mb-6">Transactions</h2>

        {account?.monthlySavingGoal > 0 && (
  <div className="bg-white p-4 rounded-xl shadow mb-6">
    <div className="flex justify-between mb-2">
      <span className="font-semibold">Monthly Budget</span>
      <span>
        ₹{currentMonthExpense} / ₹{account.monthlySavingGoal}
      </span>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all ${
          currentMonthExpense > account.monthlySavingGoal * 0.9
            ? "bg-red-500"
            : "bg-green-500"
        }`}
        style={{
          width: `${Math.min(
            (currentMonthExpense / account.monthlySavingGoal) * 100,
            100
          )}%`
        }}
      />
    </div>

    {currentMonthExpense > account.monthlySavingGoal * 0.9 && (
      <p className="text-red-600 text-sm mt-2">
        ⚠️ Budget exceeded — email alert sent
      </p>
    )}
  </div>
)}


        <TransactionChart transactions={transactions} />

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="px-3 py-2 border rounded-lg"
        >
            {typeFilters.map(t => (
            <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
            ))}
        </select>

        <button
            onClick={() => navigate(`/account/${accountId}/create`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
            + Add Transaction
        </button>

        <button
          onClick={() => navigate(`/account/${accountId}/advisor/chat`)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
        >
           💡Fianancial Advisor
        </button>

        <input
            type="text"
            placeholder="Search title or category..."
            className="ml-auto px-4 py-2 border rounded-lg"
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
        </div>


        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Type</th>
                <th className="p-3 text-center">Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleTxs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}

              {visibleTxs.map(tx => (
                <tr key={tx._id} className="border-b">
                  <td className="p-3">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{tx.title}</td>
                  <td className="p-3 text-center">{tx.category}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                  </td>

                  {/* actions */}
                  <td className="p-3 text-center space-x-4">
                    <button className="text-blue-600 hover:underline" onClick={() => navigate(`/account/${accountId}/transaction/${tx._id}/edit`)
                  }>
                    Edit
                    </button>

                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(tx._id)}>
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AccountTransactions;
