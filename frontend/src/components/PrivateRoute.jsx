import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const customerId = localStorage.getItem("customerId");

  return customerId ? children : <Navigate to="/login" replace />;
}
