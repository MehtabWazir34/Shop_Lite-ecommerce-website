import React from "react";
import { useNavigate } from "react-router-dom";

function OAuthFail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-3">Google Login Failed</h2>
      <p className="mb-4 text-gray-600">Something went wrong during authentication.</p>

      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}

export default OAuthFail;
