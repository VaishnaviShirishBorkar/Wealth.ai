import { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {Layers, PiggyBank, PlusCircle, Wallet} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);

  const [form, setForm] = useState({
    accountName: "",
    accountType: "",
    startingBalance: "",
    monthlySavingGoal: "",
    isDefault: false
  });

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("/api/account/fetch", 
        {
          headers: {Authorization: `Bearer ${token}`}
        }
      );

      setAccounts(res.data);

    } catch (error) {
      console.log('accounts failed ', error);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);


  const createAccount = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "/api/account/create",
      form,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // ✅ INSTANT UI UPDATE
    setAccounts(prev => [...prev, res.data]);

    setForm({
      accountName: "",
      accountType: "",
      startingBalance: "",
      monthlySavingGoal: "",
      isDefault: false
    });

    setShowModal(false);

  } catch (error) {
    console.error("Create account error", error);
  }
};

  const openEdit = (acc) => {
    setEditAccount(acc);
  }

  const updateAccount = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/account/${editAccount._id}`,
        {
          accountName: editAccount.accountName,
          monthlySavingGoal: editAccount.monthlySavingGoal,
          accountType: editAccount.accountType,
          isDefault: editAccount.isDefault
        },
        {
          headers: {Authorization: `Bearer ${token}`}  
        }
      );

      setEditAccount(null);
      fetchAccounts();

    } catch (error) {
        console.error("Update failed", error);
    }
  }

  const deleteAccount = async (id) => {
    if(!window.confirm("Delete this account permanently?")) return;
    try {
      await axios.delete(
        `/api/account/${id}`,
        {
          headers: {Authorization: `Bearer ${token}`}
        }
      );

      fetchAccounts();
    } catch (error) {
      console.error('could not delete account ', error);
    }
  }

  const totalAccounts = accounts.length;

  const totalBalance = accounts.reduce(
    (acc, a) => acc + (Number(a.currentBalance) || 0), 0
  );

  const totalSavingGoal = accounts.reduce(
    (acc, a) => acc + (Number(a.monthlySavingGoal) || 0), 0
  );

  return(
    <div className='min-h-screen bg-slate-100 text-black'>
      <div className='max-w-7xl mx-auto px-6 pt-28 pb-12 text-black'>
      {/* analytics */}
      <section className="grid md:grid-cols-3 gap-5 mb-10">
        
          <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
            <Layers size={36} className="text-indigo-600" />
            <div>
              <p className="text-gray-500">Total Accounts</p>
              <p>{totalAccounts}</p>
            </div>
          </div>

        <div className='bg-white rounded-2xl p-6 shadow flex items-center gap-4'>
          <Wallet size={32} className='text-indigo-600' />
          <div>
            <p>Total Balance</p>
            <p>₹{totalBalance.toLocaleString()}</p>
          </div>
        </div>

        <div className='bg-white rounded-2xl p-6 shadow flex items-center gap-4'>
          <PiggyBank size={32} className='text-indigo-600' />
          <div>
            <p className='text-gray-600'>Monthly Saving Goal</p>
            <p>
                ₹{totalSavingGoal.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* accounts  */}
      <section>
        <div className='flex justify-between items-center mb-6 text-black'>
         <h2 className='text-2xl font-bold'>Your Accounts</h2>

         <button className='bg-blue-500 hover:bg-blue-700 flex items-center text-white px-5 py-2.5 rounded-lg shadow transition'
         onClick={() => setShowModal(true)}
         >
          <PlusCircle size={25}  
          />
          Add Account
         </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {accounts.length === 0 && (
            <p className='text-gray-500 col-span-full text-center mt-10'>
              No accounts yet. Click 'Add Account' to get started
            </p>
          )}

          {accounts.map(acc => (
            <div 
              key={acc._id}
              onClick={() => navigate(`/account/${acc._id}`)}
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition cursor-pointer
                        text-black relative overflow-hidden"
            >

              <h3 className="text-xl font-semibold mb-1">
                {acc.accountName}
              </h3>

              <div className="flex gap-2 mb-2">

                <span className="bg-indigo-100 text-indigo-600 text-xs px-3 py-1 rounded-full">
                  {acc.accountType}
                </span>

                {acc.isDefault && (
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Default
                  </span>
                )}

              </div>

              <p>
                Balance:
                <span className="font-medium"> ₹{acc.currentBalance}</span>
              </p>

              <p className="text-blue-500 text-sm">
                Monthly goal: ₹{acc.monthlySavingGoal}
              </p>

              {/* ACTION BUTTONS */}
              <div 
                className="absolute top-4 right-4 hidden group-hover:flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >

                <button
                  onClick={() => openEdit(acc)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAccount(acc._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-800"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}


        </div>
      </section>
      </div>

      {showModal && (
        <div className='fixed inset-0 z-30 bg-black/40 flex items-center justify-center'>
          <div className='bg-white w-full max-w-md rounded-2xl p-6 space-y-5'>

            <h2 className='text-xl font-semibold'>Create new account</h2>
            <form onSubmit={createAccount} className='space-y-5'>
              <input 
                className='w-full p-2.5 border rounded'
                type="text" 
                placeholder='Account Name'
                value={form.accountName}
                required
                onChange={(e) => setForm({...form, accountName: e.target.value})}
              />

                <div className="space-y-2">
                <p className="text-sm font-medium">Account Type</p>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accountType"
                    value="Current"
                    checked={form.accountType === "Current"}
                    onChange={(e) =>
                      setForm({...form, accountType: e.target.value})
                    }
                  />
                  Current Account
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accountType"
                    value="Savings"
                    checked={form.accountType === "Savings"}
                    onChange={(e) =>
                      setForm({...form, accountType: e.target.value})
                    }
                  />
                  Savings Account
                </label>
              </div>

              <input 
                className='w-full border rounded p-2.5 text-black'
                type="number" 
                placeholder='Starting balance'
                value={form.startingBalance}
                onChange={(e) => setForm({...form, startingBalance: e.target.value})}
              />

              <input 
                className='w-full rounded p-2.5 border'
                type="number" 
                placeholder='Monthly Saving Goal'
                value={form.monthlySavingGoal}
                onChange={(e) => setForm({...form, monthlySavingGoal: e.target.value})}
              />

              <label className='flex items-center gap-2'>
                <input 
                  type="checkbox" 
                  checked={form.isDefault}
                  onChange={(e) => setForm({...form, isDefault: e.target.checked})}
                />

                Set as Default Account
              </label>

              <button 
                type='submit'
                className='w-full px-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white py-2'>
                Create Account
              </button>

              <button 
                type='button'
                onClick={() => setShowModal(false)}
                className='w-full bg-gray-300 hover:bg-gray-400 py-2 rounded-lg'>
                Cancel
              </button>
            </form>

          </div>
        </div>
      )}

        {editAccount && (
        <div className="fixed inset-0 z-40 bg-black/40 flex justify-center items-center">

        <div className="bg-white max-w-md w-full p-6 rounded-2xl">

          <h2 className="text-xl font-semibold mb-4">
            Edit Account
          </h2>

          <form onSubmit={updateAccount} className="space-y-4">

          <input
            className="w-full border p-2.5 rounded"
            value={editAccount.accountName}
            onChange={(e) =>
              setEditAccount({
                ...editAccount,
                accountName: e.target.value
              })
            }
          />

          <input
            className="w-full border p-2.5 rounded"
            type="number"
            value={editAccount.monthlySavingGoal}
            onChange={(e) =>
              setEditAccount({
                ...editAccount,
                monthlySavingGoal: e.target.value
              })
            }
          />

          <div className="space-y-2">

            <p className="font-medium">Account Type</p>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                value="Current"
                checked={editAccount.accountType === "Current"}
                onChange={(e) =>
                  setEditAccount({
                    ...editAccount,
                    accountType: e.target.value
                  })
                }
              />
              Current
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                value="Savings"
                checked={editAccount.accountType === "Savings"}
                onChange={(e) =>
                  setEditAccount({
                    ...editAccount,
                    accountType: e.target.value
                  })
                }
              />
              Savings
            </label>

          </div>

          <label className="flex gap-2 items-center">

            <input
              type="checkbox"
              checked={editAccount.isDefault}
              onChange={(e) =>
                setEditAccount({
                  ...editAccount,
                  isDefault: e.target.checked
                })
              }
            />

            Set as Default
          </label>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800"
          >
            Save Changes
          </button>


              <button
                type="button"
                onClick={() => setEditAccount(null)}
                className="w-full bg-gray-300 hover:bg-gray-400 py-2 rounded-lg"
              >
                Cancel
              </button>

            </form>
          </div>

        </div>
      )}

    </div>
  );
} 

export default Dashboard;