import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CreateTransaction = () => {
  const { accountId, transactionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const isEdit = Boolean(transactionId);

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "expense",
    amount: "",
    date: ""
  });

  /* =========================
     PREFILL FOR EDIT MODE
  ========================= */
  useEffect(() => {
    if (!isEdit) return;

    const fetchTransaction = async () => {
      try {
        const res = await axios.get(
          `/api/transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setForm({
          title: res.data.title,
          category: res.data.category,
          type: res.data.type,
          amount: res.data.amount,
          date: res.data.date.slice(0, 10)
        });
      } catch (err) {
        console.error("Failed to load transaction");
      }
    };

    fetchTransaction();
  }, [isEdit, transactionId, token]);

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExtracting(true);

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await axios.post(
        "/api/transaction/extract",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setForm({
        title: res.data.title || "",
        category: res.data.category || "",
        type: res.data.type || "expense",
        amount: res.data.amount || "",
        date: res.data.date || ""
      });
    } catch (error) {
      console.error("Image processing failed!");
    } finally {
      setExtracting(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     if (isEdit) {
  //       await axios.put(
  //         `http://localhost:5001/api/transaction/${transactionId}/edit`,
  //         {
  //           ...form,
  //           accountId,
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${token}` }
  //         }
  //       );

  //     } else {
  //       await axios.delete(
  //         `http://localhost:5001/api/transaction/${transactionId}/delete`,
  //         // {
  //         //   ...form,
  //         //   accountId
  //         // },
  //         {
  //           headers: { Authorization: `Bearer ${token}` }
  //         }
  //       );
  //     }

  //     navigate(`/account/${accountId}`);
  //   } catch (err) {
  //     console.error("Transaction save failed", err);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEdit) {
      // UPDATE
      await axios.put(
        `/api/transaction/${transactionId}/edit`,
        {
          ...form,
          accountId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } else {
      // CREATE (manual OR extracted – both work)
      await axios.post(
        "/api/transaction/create",
        {
          ...form,
          accountId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    }

    navigate(`/account/${accountId}`);
  } catch (err) {
    console.error("Transaction save failed", err);
    alert("Failed to save transaction");
  }
};


  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");

    if(!confirmDelete) return;

    try {
      await axios.delete(
        `/api/transaction/${transactionId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Transaction delete sucessfully!");
      navigate(`/account/${accountId}`);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete transaction!");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-xl mx-auto px-6 pt-28">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-6 rounded-xl shadow space-y-4"
        >
          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">
               Upload Bill / Receipt <span className="text-gray-400">(optional)</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border p-2 rounded"
            />

            {extracting && (
              <p className="text-blue-600 text-sm mt-1">
                Extracting data from image…
              </p>
            )}
          </div>

          <input
            name="title"
            placeholder="Title"
            className="w-full border px-4 py-2 rounded"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            className="w-full border px-4 py-2 rounded"
            value={form.category}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            className="w-full border px-4 py-2 rounded"
            value={form.type}
            onChange={handleChange}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            className="w-full border px-4 py-2 rounded"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <input
            name="date"
            type="date"
            className="w-full border px-4 py-2 rounded"
            value={form.date}
            onChange={handleChange}
            required
          />

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 justify-between">
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {transactionId ? "Update" : "Create"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-300 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

            {transactionId && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>


        </form>
      </div>
    </div>
  );
};

export default CreateTransaction;
