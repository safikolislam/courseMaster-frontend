import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [isValid, setIsValid] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Verify token is valid and check role for admin-only routes
    getMe()
      .then((res) => {
        const user = res?.data || res;
        if (adminOnly && user?.role !== "admin") {
          setIsValid("forbidden");
          return;
        }
        setIsValid(true);
      })
      .catch(() => {
        clearToken();
        setIsValid(false);
      });
  }, [token, adminOnly]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isValid === "forbidden") {
    return <Navigate to="/student" replace />;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
