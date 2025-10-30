import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Men",
      img: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Women",
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80"
    },
    {
      name: "Child",
      img: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const selectCategory = (cat) => {
    navigate("/subcategory", { state: { category: cat } });
  };

 const handleLogout = () => {
    localStorage.removeItem("customerId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-200 via-orange-100 to-rose-100 relative overflow-hidden">
    <nav className="w-full flex justify-between items-center px-6 py-4 md:px-12 bg-white/30 backdrop-blur-lg shadow-md fixed top-0 z-50">
  <div className="text-2xl font-bold text-amber-900" style={{ fontFamily: "Poppins, sans-serif" }}>
    SalonGlow
        </div>
        
  <div className="hidden md:flex gap-6 text-amber-900 font-medium ml-auto mr-6">
    <button className="hover:text-orange-500 transition">Home</button>
    <button className="hover:text-orange-500 transition">About</button>
    <button className="hover:text-orange-500 transition">Services</button>
    <button className="hover:text-orange-500 transition">Contact</button>
  </div>

  <button
    onClick={handleLogout}
    className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2 rounded-full shadow-md transition-all duration-300"
  >
    Logout
  </button>
</nav>

      <div className="pt-28 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 transition-all duration-300 hover:scale-105"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          Choose Your Category
        </h1>
      </div>

      <div className="px-4 md:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => selectCategory(cat.name)}
            className="group cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 bg-white/40 backdrop-blur-md"
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="p-4 text-center">
              <h3 className="text-2xl font-bold text-amber-900">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-amber-900/80 text-lg md:text-xl px-4">
        Book your slot now and experience the ultimate salon care!
      </div>

      <div className="absolute w-72 h-72 bg-white/20 rounded-full top-[-4rem] left-[-4rem] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-white/10 rounded-full bottom-[-6rem] right-[-6rem] animate-pulse"></div>
    </div>
  );
}
