import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Subcategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || "Men";

  const subcategories = [
    { name: "Hair", icon: "💇" },
    { name: "Body", icon: "💆" },
    { name: "Nail", icon: "💅" },
    { name: "Spa", icon: "🧖" },
  ];

  const selectSubcategory = (sub) => {
    navigate("/stylists", { state: { category, subCategory: sub } });
  };

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-200 via-orange-100 to-rose-100 relative overflow-hidden">
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

      <div className="pt-28 text-center px-4">
        <h3
          className="text-3xl font-bold text-amber-900"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Select Subcategory ({category})
        </h3>
        <p className="text-lg text-amber-800/80 mt-2">
          Choose a service type to explore our skilled stylists
        </p>
      </div>

      <div className="px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
        {subcategories.map((sub, index) => (
          <div
            key={sub.name}
            onClick={() => selectSubcategory(sub.name)}
            className={`group bg-white rounded-2xl shadow-lg p-8 flex items-center gap-5 cursor-pointer transform transition-all duration-500 hover:scale-[1.03] animate-fade-up`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: "forwards",
            }}
          >
            
            <div className="text-5xl group-hover:scale-125 transition-all">
              {sub.icon}
            </div>

            <div className="flex-1 text-left">
              <h4 className="text-2xl font-semibold text-amber-900">
                {sub.name}
              </h4>
              <p className="text-sm text-gray-600">
                Premium {sub.name} care just for you
              </p>
            </div>

            
            <div className="text-2xl text-orange-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
              ➜
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

