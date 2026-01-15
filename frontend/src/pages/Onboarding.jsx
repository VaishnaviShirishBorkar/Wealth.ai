import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categoriesList = [
  "Groceries",
  "Food",
  "Travel",
  "Subscriptions",
  "Education",
  "Rent",
  "Shopping",
  "Entertainment",
  "Medical",
  "Fuel"
];

export default function Onboarding(){
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    incomeRange: "",
    monthlyExpensesEstimate: "",
    goal: "",
    monthlySavingTarget: "",
    categories: []
  });

  const toggleCategory = (cat) => {
    setData({...data, categories: 
      data.categories.includes(cat)? data.categories.filter(c => c != cat) : [...data.categories, cat]});
  }

  const handleSubmit = async (e) => {
    try {
      await axios.post("/api/onboarding/save", 
        {data},
        {
          headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        }
      );

      navigate("/dashboard");
    } catch (error) {
      console.log("error ",error);
    }
  }

  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg space-y-6 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black"> Step {step} of 3</h2>
        </div>
        
        {/* step 1 */}
        {step == 1 && (
          <>
          <h3 className="font-semibold text-blackx">Monthly overview</h3>
          <select className="border w-full p-3 rounded text-black"
           onChange={(e) => setData({...data, incomeRange: e.target.value})}
          >
            <option value="">Select income range</option>
            <option value="<20k">Below ₹20k</option>
            <option value="20k-50k">Between ₹20k and ₹50k</option>
            <option className="text-black" value="50k-1L"></option>
            <option value=">1L"></option>
          </select>

          <input 
            type="number"
            placeholder="Estimated monthly expense"
            className="w-full rounded p-2 border text-black"
            value={data.monthlyExpensesEstimate}
            onChange={(e) => setData({...data, monthlyExpensesEstimate: e.target.value})}
          />

          <button className="btn-primary text-black" onClick={() => setStep(2)}>
            Next
          </button>
          </>
        )}

        {step == 2 && (
          <>
          <input type="text" 
            className="w-full rounded p-2 border text-black"
            placeholder="Enter goal"
            value={data.goal}
            onChange={(e) => setData({...data, goal: e.target.value})}
          />

          <input type="number" 
            placeholder="Enter Monthly Savings Target"
            className="w-full rounded border p-2 text-black"
            value={data.monthlySavingTarget}
            onChange={(e) => setData({...data, monthlySavingTarget: e.target.value})}
          />

          <div className="flex justify-between">
            <button className="text-black" onClick={() => setStep(1)}>Back</button>
            <button className="text-black" onClick={() => setStep(3)}>Next</button>
          </div>
          </>
        )}

        {step == 3 && (
          <>
          <h3>Select categories to track</h3>

          <div className="grid grid-cols-2 gap-2 text-black">
            {categoriesList.map((cat) => (
              <button key={cat} onClick={() => toggleCategory(cat)}
                className={`p-2 border rounded 
                  ${data.categories.includes(cat)? "bg-blue-500 text-white": ""}`}
                >
                  {cat}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button className="rounded text-black" onClick={() => setStep(2)}>Back</button>
            <button className="bg-blue-600 text-white p-2 rounded" onClick={handleSubmit}>Finish</button>
          </div>
          </>
        )}

      </div>
    </div>
  );
}
