import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionFromURL } from "../lib/utils";
import { api } from "../lib/api";

export const SSO = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const authenticate = async () => {
      const { token, projectId } = getSessionFromURL();

      if (!token || !projectId) {
        setError("Missing authentication token. Please return to the main site and try again.");
        return;
      }

      try {
        // Hit the backend to verify the token and get project data
        // We will build this backend route next
        const response = await api.get(`/auth/verify?projectId=${projectId}`);
        
        if (response.data.success) {
          // Successfully verified. Go to dashboard.
          navigate("/dashboard", { replace: true });
        } else {
          setError("Failed to verify session.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Invalid or expired token. Please return to the main site.");
      }
    };

    authenticate();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-red-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = import.meta.env.VITE_MAIN_SITE_URL || "https://totlesoft.com"}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black transition"
          >
            Return to Totlesoft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Securely authenticating...</p>
    </div>
  );
};