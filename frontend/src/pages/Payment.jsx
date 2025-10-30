import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentOption, setPaymentOption] = useState("");

  const totalAmount = 499;
  const advanceAmount = 199;

  const handlePayment = () => {
    if (!paymentOption) return alert("Please select a payment option");

    const amountToPay = paymentOption === "full" ? totalAmount : advanceAmount;

    setIsPaying(true);

    setTimeout(() => {
      alert(`Payment Successful - Paid ₹${amountToPay}`);
      navigate("/profile");
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white">
      <nav className="w-full flex justify-between items-center px-6 py-4 md:px-12 bg-white/30 backdrop-blur-lg shadow-md fixed top-0 z-50">
        <div
          className="text-2xl font-bold text-amber-900"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          SalonGlow
        </div>
        <div className="hidden md:flex gap-6 text-amber-900 font-medium ml-auto mr-6">
          <button onClick={() => navigate("/home")}>Home</button>
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
      <div className="flex justify-center items-center pt-32 pb-16 px-4">
        <div className="w-full max-w-md bg-white/50 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-amber-100">
          <button
            onClick={() => navigate(-1)}
            className="text-amber-900 mb-4 flex items-center gap-2 hover:text-orange-600 transition-colors"
          >
            <span className="text-lg">←</span> Back
          </button>

          <h2 className="text-2xl font-bold text-center text-amber-900 mb-3">
            Payment
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Select your payment option below — This is a test transaction.
          </p>

          <div className="space-y-3 mb-5">
            <label className="flex items-center gap-3 cursor-pointer bg-white/60 p-3 rounded-lg shadow-sm border hover:shadow-md transition-all">
              <input
                type="radio"
                name="paymentOption"
                value="full"
                checked={paymentOption === "full"}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              <span className="text-amber-900 font-medium">
                Pay Full Amount (₹{totalAmount})
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer bg-white/60 p-3 rounded-lg shadow-sm border hover:shadow-md transition-all">
              <input
                type="radio"
                name="paymentOption"
                value="advance"
                checked={paymentOption === "advance"}
                onChange={(e) => setPaymentOption(e.target.value)}
              />
              <span className="text-amber-900 font-medium">
                Pay Advance (₹{advanceAmount})
              </span>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">
              Amount to Pay
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-amber-900 bg-white/70"
              value={
                paymentOption
                  ? `₹${
                      paymentOption === "full" ? totalAmount : advanceAmount
                    }`
                  : ""
              }
              disabled
            />
          </div>
          
          <button
            onClick={handlePayment}
            disabled={isPaying}
            className={`w-full py-3 rounded-full text-white font-medium transition-all shadow-md ${
              isPaying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-amber-600 hover:scale-105"
            }`}
          >
            {isPaying ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
