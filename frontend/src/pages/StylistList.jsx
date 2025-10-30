import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StylistList() {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category || "Men";
  const subCategory = location.state?.subCategory || "Hair";

  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);

  const defaultImage =
    category === "Men"
      ? "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400"
      : "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80";

  useEffect(() => {
    const fetchStylists = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/stylist/category/${category}`);
        const data = res.data || [];

        const styledData = data.map((stylist) => ({
          ...stylist,
          imageUrl: stylist.imageUrl || defaultImage,
        }));

        setStylists(styledData);
      } catch (err) {
        console.error("Failed to fetch stylists:", err);
        setStylists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStylists();
  }, [category]);

  const bookStylist = (id) => {
    navigate(`/booking/${id}`, { state: { category, subCategory } });
  };

  const viewCertifications = (stylist) => {
    setSelectedStylist(stylist);
    setShowCertModal(true);
  };

  const closeCertModal = () => {
    setShowCertModal(false);
    setSelectedStylist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-200 via-orange-100 to-rose-100 relative overflow-hidden py-8">
  
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className="text-2xl md:text-3xl font-bold text-amber-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Stylists for{" "}
              <span className="text-orange-600">{category}</span> —{" "}
              <span className="text-orange-600">{subCategory}</span>
            </h3>
            <p className="text-sm text-amber-800/80 mt-1">
              Choose a stylist and book your slot
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-amber-900">
            Loading stylists...
          </div>
        ) : stylists.length === 0 ? (
          <div className="text-center py-12 text-amber-900">
            No stylists available for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stylists.map((stylist, index) => {
              const rating = stylist.rating ?? "N/A";
              const experience = stylist.experience ?? "N/A";
              const specialization = stylist.specialization ?? subCategory;

              return (
                <div
                  key={stylist._id || index}
                  className="bg-white rounded-2xl shadow-lg p-5 flex flex-col h-full hover:shadow-2xl transform transition-transform duration-200 hover:-translate-y-1"
                >
                 
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-200">
                      <img
                        src={stylist.imageUrl}
                        alt={stylist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-amber-900 truncate">
                        {stylist.name || "Unnamed"}
                      </h4>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Spec:</span>{" "}
                        {specialization}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Exp:</span>{" "}
                        {experience} yrs
                      </div>
                      <div className="text-sm text-gray-700 mt-1 flex items-center gap-2">
                        <span className="font-medium">Rating:</span>
                        <span className="text-amber-600">{rating}</span>
                        <span className="text-amber-500">★</span>
                      </div>
                    </div>
                  </div>

  
                  {stylist.bio && (
                    <p className="text-sm text-gray-600 mt-4 line-clamp-3">
                      {stylist.bio}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => bookStylist(stylist._id)}
                      className="flex-1 py-2 rounded-full text-white font-medium text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition"
                    >
                      Book
                    </button>

                    <button
                      onClick={() => viewCertifications(stylist)}
                      className="px-3 py-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm transition"
                    >
                      📜 View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      
      <Modal show={showCertModal} onHide={closeCertModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStylist?.name || "Certifications"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-disc pl-5">
            {(selectedStylist?.certifications && selectedStylist.certifications.length
              ? selectedStylist.certifications
              : [
                  "Advanced Hair Styling Course - 2022",
                  "Color Specialist Certification - 2021",
                  "Salon Management Diploma - 2020",
                ]
            ).map((cert, idx) => (
              <li key={idx} className="text-sm text-gray-700 mb-1">
                {cert}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCertModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
