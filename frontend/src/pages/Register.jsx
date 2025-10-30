import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register() {
  const loc = useLocation();
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
  const id = loc.state?.customerId || localStorage.getItem("customerId");
  if (!id) {
    setTimeout(() => {
      navigate("/login");
    }, 100); 
    return;
  }
  setCustomerId(id);

  const checkExistingProfile = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/customer/${id}`);
      const c = res.data?.customer;
      if (c?.name && c?.age && c?.gender) {
        navigate("/"); 
      }
    } catch (err) {
      console.error("Profile check failed:", err);
    }
  };
  checkExistingProfile();
}, [loc, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !age || !gender) return alert("All fields are required");

    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        customerId,
        name,
        age,
        gender,
      });
      localStorage.setItem("customerId", res.data.customer._id);
      alert("Registration successful!");
      navigate("/"); 
    } catch (err) {
      console.error("Registration error:", err);
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-amber-400 via-orange-300 to-rose-200 relative overflow-hidden px-4">
      <div className="absolute w-65 h-65 bg-white/20 rounded-full top-[-4rem] left-[-4rem] blur-2xl animate-pulse"></div>
      <div className="absolute w-65 h-65 bg-white/10 rounded-full bottom-[-6rem] right-[-6rem] blur-3xl animate-pulse"></div>
      
      <div className="relative w-full max-w-md p-8 md:p-10 rounded-3xl bg-white/30 backdrop-blur-lg shadow-2xl transition-transform duration-500 hover:scale-105">
        <h2
          className="text-3xl md:text-4xl font-bold text-amber-900 text-center mb-8"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Complete Your Profile
        </h2>

        <form onSubmit={submit} className="flex flex-col gap-6">
          <div>
            <label className="block mb-2 text-amber-900 font-medium">
              Full Name
            </label>
            <input
              className="w-full px-5 py-3 rounded-xl bg-white/40 backdrop-blur-sm text-amber-900 placeholder-amber-700 border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-amber-900 font-medium">Age</label>
            <input
              type="number"
              className="w-full px-5 py-3 rounded-xl bg-white/40 backdrop-blur-sm text-amber-900 placeholder-amber-700 border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-amber-900 font-medium">
              Gender
            </label>
            <select
              className="w-full px-5 py-3 rounded-xl bg-white/40 backdrop-blur-sm text-amber-900 placeholder-amber-700 border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-rose-300 text-amber-900 font-semibold shadow-lg hover:scale-105 transition transform"
          >
            Register
          </button>
        </form>

        <div className="text-center text-amber-900/80 text-sm mt-6">
          Customer ID: {customerId}
        </div>
      </div>
    </div>
  );
}
