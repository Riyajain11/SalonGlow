import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Booking() {
  const { id: stylistId } = useParams(); // stylistId from URL
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customerId) navigate("/login");
  }, [customerId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!date || !time) return alert("Please select date and time");

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/appointment/book`, {
        customerId,
        stylistId,
        date,
        time,
      });
      alert("Appointment booked successfully!");
      navigate("/payment");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("customerId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-200 via-orange-100 to-rose-100">
      <nav className="w-full flex justify-between items-center px-6 py-4 md:px-12 bg-white/30 backdrop-blur-lg shadow-md fixed top-0 z-50">
        <div
          className="text-2xl font-bold text-amber-900"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          SalonGlow
        </div>
        <div className="hidden md:flex gap-6 text-amber-900 font-medium ml-auto mr-6">
          <button>Home</button>
          <button>About</button>
          <button>Services</button>
          <button>Contact</button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-full shadow-md transition-all"
        >
          Logout
        </button>
      </nav>
      <div className="pt-28 flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/40">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-orange-600 font-medium mb-4 hover:text-orange-700 transition"
          >
            ← Back
          </button>

          <h2
            className="text-2xl font-bold text-amber-900 text-center mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Book Appointment
          </h2>

          <form onSubmit={handleBooking} className="space-y-5">
            <div>
              <label className="block text-amber-900 font-medium mb-1">
                Select Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none text-amber-900 bg-white/80"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-amber-900 font-medium mb-1">
                Select Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none text-amber-900 bg-white/80"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-full shadow-md transition-all duration-200"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
