// src/utils/useTokenExpiry.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useTokenExpiry = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiryTime = sessionStorage.getItem("expiry");
      if (expiryTime && new Date().getTime() > expiryTime) {
        // Token has expired
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("expiry");
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    };

    // Run the check every minute (or adjust as needed)
    const intervalId = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [navigate]);
};

export default useTokenExpiry;
