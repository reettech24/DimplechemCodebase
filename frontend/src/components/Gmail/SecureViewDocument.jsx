import React, { useState } from "react";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const SecureViewDocument = () => {
  const { token } = useParams(); // ⬅️ Get token from URL
  const [password, setPassword] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState("");

  //console.log("token",token);

  const handleVerify = async () => {
    try {
      const btoken = getAuthToken();
      const response = await fetch(`${API_URL}/auth/verify-secure-doc`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${btoken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (result.success) {
        setDownloadLink(result.downloadUrl);
        setError("");
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  const downloadDocument = async (downloadLink) => {
    try {
      const btoken = getAuthToken();
      const response = await fetch(downloadLink, {
        headers: {
          Authorization: `Bearer ${btoken}`,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "secure-document.zip";
      link.click();
    } catch (err) {
      console.error("Error downloading document:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen bg-gradient-to-r from-[#1e1e2dd4] to-[#1e1e2d] p-2">
      <div className="flex flex-col justify-center items-center rounded-[16px] bg-[#2e2e3c] w-full p-2 py-8 md:w-[480px] md:h-auto">
        <h2 className="text-2xl text-white font-semibold border-b border-[#fe6c00e6] pb-3 mb-5">
          🔒 Enter Document Password
        </h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-[8px] mb-4 focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:text-[#667877] text-black"
        />

        <button
          onClick={handleVerify}
          className="w-full py-2 bg-[#fe6c00] text-white font-semibold rounded-[8px] hover:bg-[#fe6c00e6] transition"
        >
          Unlock Document
        </button>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

        {downloadLink && (
          <div className="mt-6 w-full text-center">
            <p className="text-green-500 text-base mb-2">
              ✅ Password matched!
            </p>
            <a
              onClick={downloadDocument}
              className="text-[#fe6c00] underline cursor-pointer font-medium"
            >
              📄 Download Document
            </a>
            <p className="text-xs text-gray-400 mt-2">
              ⚠️ Do not share this password with anyone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureViewDocument;
