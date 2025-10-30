import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });
  const navigate = useNavigate();

  const openSnack = (msg, severity = "info") => setSnack({ open: true, message: msg, severity });
  const closeSnack = () => setSnack({ ...snack, open: false });

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return openSnack("Enter valid phone number", "warning");

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/send-otp`, { phone });
      openSnack(res.data?.message || "OTP sent successfully", "success");
      setStep("otp");
    } catch (err) {
      console.error("OTP send error:", err);
      openSnack(err?.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return openSnack("Please enter OTP", "warning");

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/verify-otp`, { phone, otp });
      const customer = res.data.customer;

      if (!customer?._id) throw new Error("Invalid response from server");

      localStorage.setItem("customerId", customer._id);

      openSnack("OTP verified successfully", "success");

      if (customer.name && customer.age && customer.gender) {
        navigate("/"); // Go to home
      } else {
        navigate("/register", { state: { customerId: customer._id } });
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      openSnack(err?.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    if (customerId) navigate("/");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-amber-400 via-orange-300 to-rose-200 relative overflow-hidden px-4">
      <div className="absolute w-72 h-72 bg-white/20 rounded-full top-[-4rem] left-[-4rem] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-white/10 rounded-full bottom-[-6rem] right-[-6rem] animate-pulse"></div>

      <div className="relative w-full max-w-md md:max-w-lg p-10 rounded-3xl bg-white/30 backdrop-blur-lg shadow-2xl transition-transform duration-500 hover:scale-105">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900 text-center mb-8" style={{ fontFamily: "Poppins, sans-serif" }}>
          Salon — Login
        </h2>

        {step === "phone" && (
          <form onSubmit={sendOtp} className="flex flex-col gap-6">
            <input
              type="tel"
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-white/40 backdrop-blur-sm text-amber-900 placeholder-amber-700 border border-white/30 focus:outline-none focus:ring-2 focus:ring-amber-600 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-rose-300 text-amber-900 font-semibold shadow-lg hover:scale-105 transition transform"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-white/40 backdrop-blur-sm text-amber-900 placeholder-amber-700 border border-white/30 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-green-200 via-amber-200 to-rose-100 text-amber-900 font-semibold shadow-lg hover:scale-105 transition transform"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="flex-1 px-4 py-3 rounded-full border border-amber-300 text-amber-900 font-semibold hover:bg-white/20 transition"
              >
                Back
              </button>
            </div>
           </form>
        )}

        <div className="text-center mt-8 text-amber-900/80 text-sm">
          Don’t have an account? Just enter your phone — you’ll register next.
        </div>
      </div>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
