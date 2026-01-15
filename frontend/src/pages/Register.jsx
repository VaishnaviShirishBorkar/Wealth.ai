  import React from "react";
  import { Mail, Lock, ArrowRight, Phone, User} from "lucide-react";
  import { Link, useNavigate } from "react-router-dom";
  import { useState } from "react";
  import axios from 'axios'

  const Register = () => {

    const [form, setForm] = useState({
      name: '',
      phone: '',
      email: '',
      password: ''
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
      setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const res = await axios.post("/api/auth/register", form);
        // localStorage.setItem("token", res.data.token);
        console.log(res.data.msg);
        navigate("/login");
        
      } catch (error) {
        setError(error.response?.data?.msg || ' Registration failed')
      }
    }

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

        {/* Card */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 space-y-10 text-black">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Register to continue managing your wealth
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-200 p-2 rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-7" onSubmit={handleSubmit}>

              {/* name */}
              <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            {/* name */}
              <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:opacity-90 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition"
            >
              {loading? "Registering..." : 'Register'}
            </button>

          </form>

          {/* FOOTER */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </div>

        </div>

      </div>
    );
  };

  export default Register;
