import React from "react";
import { Navigate } from "react-router-dom";

// AdminRoute component to protect admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if the user is admin
  if (user.role !== "admin") {
    // If not admin, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If user is admin, allow access
  return <>{children}</>;
};

export default AdminRoute;
