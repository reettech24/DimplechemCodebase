import React from "react";

const SecureDocumentEmailPreview = ({ downloadLink, password }) => {
  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg bg-white text-gray-800 shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📄 Secure Document Shared
      </h2>

      <p className="mb-4 text-sm">
        A secure document has been shared with you. You can download it from the link below:
      </p>

      <a
        href={downloadLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        📥 Download Secure Document
      </a>

      <p className="mt-4 text-sm">
        <strong>Password:</strong>{" "}
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-medium ml-2">
          {password}
        </span>
      </p>

      <p className="text-xs text-gray-500 mt-6">
        Please do not share this password with anyone else.
      </p>
    </div>
  );
};

export default SecureDocumentEmailPreview;
    