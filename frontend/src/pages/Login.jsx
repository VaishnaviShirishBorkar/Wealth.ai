import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      const { hasCompletedOnboarding } = res.data.user;
      console.log("hasCompletedOnboarding =", hasCompletedOnboarding);
      

      if (hasCompletedOnboarding) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 space-y-10 text-black">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500">
            Login to continue managing your wealth
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded">
            {error}
          </div>
        )}

        <form className="space-y-7" onSubmit={handleSubmit}>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Login;
