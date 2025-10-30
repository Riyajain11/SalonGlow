import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const [customer, setCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const [actionAppointment, setActionAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("");
  const [resLoading, setResLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    if (!customerId) {
      alert("You are not logged in");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const resCustomer = await axios.get(
          `${API}/api/auth/customer/${customerId}`
        );
        setCustomer(resCustomer.data.customer);

        const resAppointments = await axios.get(
          `${API}/api/appointment/${customerId}`
        );
        const appts =
          resAppointments.data?.appointments ?? resAppointments.data ?? [];
        setAppointments(appts);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch profile data");
      }
    };

    fetchData();
  }, [customerId, navigate]);

  const fetchAppointments = async () => {
    try {
      const resAppointments = await axios.get(
        `${API}/api/appointment/${customerId}`
      );
      const appts =
        resAppointments.data?.appointments ?? resAppointments.data ?? [];
      setAppointments(appts);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customerId");
    navigate("/login");
  };

  const statusLabel = (s) => {
    if (!s || s === "SC") return { text: "Upcoming", variant: "success" };
    if (s === "CP") return { text: "Completed", variant: "primary" };
    if (s === "CA") return { text: "Cancelled", variant: "danger" };
    return { text: s, variant: "secondary" };
  };

  const renderStars = (num) => {
    const n = Number(num) || 0;
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: "#ffc107", fontSize: "1rem" }}>
        {i < n ? "★" : "☆"}
      </span>
    ));
  };

  const openRescheduleModal = (appointment) => {
    setActionAppointment(appointment);
    setResDate(appointment.date || "");
    setResTime(appointment.time || "");
    setShowRescheduleModal(true);
    setOpenDropdown(null);
  };

  const submitReschedule = async () => {
    if (!actionAppointment) return;
    if (!resDate || !resTime) return alert("Please select date and time");

    setResLoading(true);
    try {
      await axios.patch(`${API}/api/appointment/${actionAppointment._id}`, {
        date: resDate,
        time: resTime,
      });
      await fetchAppointments();
      setShowRescheduleModal(false);
      setActionAppointment(null);
      alert("Appointment rescheduled successfully!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to reschedule appointment");
    } finally {
      setResLoading(false);
    }
  };

  const openCancelModal = (appointment) => {
    setActionAppointment(appointment);
    setShowCancelModal(true);
    setOpenDropdown(null);
  };

  const confirmCancel = async () => {
    if (!actionAppointment) return;
    setCancelLoading(true);

    try {
      await axios.patch(`${API}/api/appointment/${actionAppointment._id}`, {
        status: "CA",
      });

      await fetchAppointments(); // re-fetch to update UI

      setShowCancelModal(false);
      setActionAppointment(null);
      alert("Appointment cancelled and removed!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCall = (appointment) => {
    const phone =
      appointment?.stylistId?.phone ||
      appointment?.stylistId?.contact ||
      appointment?.stylistPhone ||
      "";
    if (!phone) return alert("Stylist phone number not available");
    window.open(`tel:+91${phone}`);
    setOpenDropdown(null);
  };

  const handleChat = (appointment) => {
    alert("Chat feature placeholder.");
    setOpenDropdown(null);
  };

  const openReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setReviewText(appointment.review || "");
    setRating(appointment.rating || 0);
    setShowReviewModal(true);
    setOpenDropdown(null);
  };

  const submitReview = async () => {
    if (!selectedAppointment) return;
    if (!reviewText) return alert("Please enter review text");

    try {
      await axios.post(
        `${API}/api/appointment/review/${selectedAppointment._id}`,
        {
          review: reviewText,
          rating,
        }
      );

      await fetchAppointments();
      setShowReviewModal(false);
      setSelectedAppointment(null);
      setReviewText("");
      setRating(0);
      alert("Review submitted.");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to submit review");
    }
  };

  const handleBookAgain = (appointment) => {
    const sid = appointment.stylistId?._id || appointment.stylistId;
    navigate(`/stylists?stylistId=${sid}`);
    setOpenDropdown(null);
  };

  if (!customer)
    return <div className="text-center py-5">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-200 via-orange-100 to-rose-100 relative overflow-hidden py-8">
      <nav className="w-full flex justify-between items-center px-6 py-4 md:px-12 bg-white/30 backdrop-blur-lg shadow-md fixed top-0 z-50 rounded-b-lg">
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

      <div className="max-w-6xl mx-auto px-4 mt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className="text-2xl md:text-3xl font-bold text-amber-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              My Profile
            </h3>
            <p className="text-sm text-amber-800/80 mt-1">
              Manage your info and appointments
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h5 className="text-lg font-semibold text-amber-900 mb-3">
            Personal Info
          </h5>
          <p>
            <strong>Name:</strong> {customer.name || "Not Provided"}
          </p>
          <p>
            <strong>Age:</strong> {customer.age || "Not Provided"}
          </p>
          <p>
            <strong>Gender:</strong> {customer.gender || "Not Provided"}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h5 className="text-lg font-semibold text-amber-900 mb-4">
            Appointments
          </h5>

          {appointments.length === 0 ? (
            <div className="text-center mt-6 text-amber-900">
              No appointments booked yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {appointments.map((a) => {
                const s = a.status || "SC";
                const badge = statusLabel(s);

                return (
                  <div
                    key={a._id}
                    className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h6 className="text-lg font-semibold text-amber-900 truncate">
                          {a.stylistId?.name || a.stylistName || "Stylist"}
                        </h6>
                        <p className="text-sm text-gray-600">
                          {a.date} at {a.time}
                        </p>
                        <div className="text-sm text-gray-600 mt-1">
                          <small>
                            {a.stylistId?.category || a.category} -{" "}
                            {a.stylistId?.subCategory || a.subCategory}
                          </small>
                        </div>

                        {a.review ? (
                          <div className="mt-3">
                            <div>{renderStars(a.rating)}</div>
                            <div className="mt-1">
                              <strong>Review:</strong> {a.review}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 text-muted">
                            <small>No review yet.</small>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === a._id ? null : a._id
                            )
                          }
                          className="px-2 py-1 rounded-full hover:bg-gray-100"
                          aria-label="open actions"
                        >
                          ⋮
                        </button>

                        {openDropdown === a._id && (
                          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 z-40">
                            {(s === "SC" || s === "CP") && (
                              <>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-50"
                                  onClick={() => openRescheduleModal(a)}
                                >
                                  Reschedule
                                </button>

                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                  onClick={() => handleCall(a)}
                                >
                                  Call Stylist
                                </button>

                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                  onClick={() => handleChat(a)}
                                >
                                  Chat with Stylist
                                </button>

                                <button
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-green-50"
                                  onClick={() => openReviewModal(a)}
                                >
                                  Write / Edit Review
                                </button>
                              </>
                            )}

                            {s === "SC" && (
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50"
                                onClick={() => openCancelModal(a)}
                              >
                                Cancel Appointment
                              </button>
                            )}

                            {s === "CA" && (
                              <button
                                className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50"
                                onClick={() => handleBookAgain(a)}
                              >
                                Book Again
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          badge.variant === "success"
                            ? "bg-green-100 text-green-800"
                            : badge.variant === "danger"
                            ? "bg-red-100 text-red-800"
                            : badge.variant === "primary"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {badge.text}
                      </span>

                      <div className="text-right text-sm text-gray-500">
                        {a.review ? (
                          <span>Reviewed</span>
                        ) : (
                          <span>No review</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowRescheduleModal(false);
              setActionAppointment(null);
            }}
          />
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-50">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              Reschedule Appointment
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">Date</label>
                <input
                  type="date"
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Time</label>
                <input
                  type="time"
                  value={resTime}
                  onChange={(e) => setResTime(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setActionAppointment(null);
                }}
                className="px-4 py-2 rounded-md bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={submitReschedule}
                disabled={resLoading}
                className="px-4 py-2 rounded-md bg-amber-600 text-white"
              >
                {resLoading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-50">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              Cancel Appointment
            </h3>
            <p>
              Are you sure you want to cancel this appointment? This action can
              be undone only by booking again.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="px-4 py-2 rounded-md bg-gray-200"
              >
                No
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelLoading}
                className="px-4 py-2 rounded-md bg-red-600 text-white"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowReviewModal(false)}
          />
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-50">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              Add / Edit Review
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Review</label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border rounded-md p-2"
                ></textarea>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={submitReview}
                className="px-4 py-2 rounded-md bg-amber-600 text-white"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
