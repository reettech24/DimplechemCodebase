import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const ComposeEmail = ({ gmailAccessToken, onClose }) => {
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [attachment, setAttachment] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComposeData({ ...composeData, [name]: value });
  };

  const handleAttachment = (e) => {
    setAttachment(e.target.files[0]);
  };

  // const sendEmail = async () => {
  //   const boundary = "foo_bar_baz";
  //   let base64FileContent = "";

  //   // Read file as base64 if there's an attachment
  //   if (attachment) {
  //     const fileContent = await readFileAsBase64(attachment);
  //     base64FileContent = fileContent.replace(/\r?\n|\r/g, "");
  //   }

  //   // Compose email headers and body parts
  //   let emailParts = [
  //     `To: ${composeData.to}`,
  //     `Cc: umasharma0821@gmail.com`,
  //     `Subject: ${composeData.subject}`,
  //     "MIME-Version: 1.0",
  //     `Content-Type: multipart/mixed; boundary="${boundary}"`,
  //     "",
  //     `--${boundary}`,
  //     "Content-Type: text/plain; charset=UTF-8",
  //     "Content-Transfer-Encoding: 7bit",
  //     "",
  //     composeData.message,
  //   ];

  //   // If attachment exists, add it to email body
  //   if (attachment) {
  //     emailParts = emailParts.concat([
  //       "",
  //       `--${boundary}`,
  //       `Content-Type: ${attachment.type || "application/octet-stream"}; name="${attachment.name}"`,
  //       "Content-Transfer-Encoding: base64",
  //       `Content-Disposition: attachment; filename="${attachment.name}"`,
  //       "",
  //       base64FileContent,
  //     ]);
  //   }

  //   // Close the MIME boundary
  //   emailParts.push(`--${boundary}--`);

  //   // Encode final email body
  //   const email = emailParts.join("\r\n");
  //   const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
  //     .replace(/\+/g, "-")
  //     .replace(/\//g, "_")
  //     .replace(/=+$/, "");

  //   // Send email via Gmail API
  //   try {
  //     const response = await fetch(
  //       "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${gmailAccessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ raw: base64EncodedEmail }),
  //       }
  //     );

  //     if (response.ok) {
  //       alert("Email sent successfully!");
  //       onClose();
  //     } else {
  //       const error = await response.json();
  //       console.error("Send email error:", error);
  //       alert("Failed to send email.");
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //   }
  // };

  // // Helper: read file as base64

  const sendEmail = async () => {
    const token = getAuthToken();
    const boundary = "foo_bar_baz";
    let secureDocInfo = null;

    // Upload file securely if attachment exists
    // if (attachment) {
    const formData = new FormData();
    formData.append("to_email", composeData.to);
    formData.append("subject", composeData.subject);
    formData.append("body", composeData.message);

    if (attachment) {
      formData.append("file", attachment);
    }

    const uploadRes = await fetch(`${API_URL}/auth/upload-secure-doc`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (uploadRes.ok) {
      secureDocInfo = await uploadRes.json();
    } else {
      alert("File upload failed. Cannot send email.");
      return;
    }
    // }

    // Compose email body
    let emailBody = composeData.message;

    // If uploaded document info exists, append download link + password
    if (secureDocInfo) {
      // emailBody += `\n\n🔒 Secure Document:\n${secureDocInfo.downloadLink}\nPassword: ${secureDocInfo.password}`;
      // emailBody += `
      //   <p>🔒 Secure Document:<br/>
      //   <a className="text-black" style="color:black;" href="${secureDocInfo.downloadLink}" target="_blank">${secureDocInfo.downloadLink}</a><br/>
      //   <strong>Password:</strong> ${secureDocInfo.password}</p>
      // `;
      emailBody += `
  <div style="
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #222;
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #ffffff;
    margin-top: 20px;
  ">
    <h3 style="margin: 0 0 12px; color: #111;">🔒 Secure Document Available</h3>
    
    <p style="margin: 0 0 14px; line-height: 1.6; color: #333;">
      You have received a secure, password-protected document. 
      Click the button below to download it.
    </p>

    <a href="${secureDocInfo.downloadLink}" target="_blank" style="
      display: inline-block;
      padding: 12px 20px;
      background: #2563eb;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin-bottom: 14px;
    ">
      📄 Download Document
    </a>

    <p style="margin: 0 0 10px; line-height: 1.5; color: #333;">
      <strong>Password:</strong>
      <span style="
        color: #e63946;
        font-weight: bold;
        font-size: 15px;
      ">${secureDocInfo.password}</span>
    </p>

    <p style="margin: 14px 0 0; font-size: 13px; color: #666;">
      ⚠️ Please do not share this password with anyone. 
      This document is intended for your use only.
    </p>

    <p style="margin: 8px 0 0; font-size: 13px; color: #666;">
      📌 Click the button above to securely download your document.
    </p>
  </div>
`;
    }

    // Compose MIME message parts
    let emailParts = [
      `To: ${composeData.to}`,
      `Cc: umasharma0821@gmail.com`,
      `Subject: ${composeData.subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      emailBody,
      "",
      `--${boundary}--`,
    ];

    // Encode final email body
    const email = emailParts.join("\r\n");
    const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send email via Gmail API
    try {
      const response = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${gmailAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: base64EncodedEmail }),
        }
      );

      if (response.ok) {
        alert("Email sent successfully!");
        onClose();
      } else {
        const error = await response.json();
        console.error("Send email error:", error);
        alert("Failed to send email.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Return base64 content without the Data URL prefix
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 p-2 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h3 className="text-xl font-semibold mb-4">Compose Email</h3>

        <input
          type="email"
          name="to"
          placeholder="To"
          value={composeData.to}
          onChange={handleChange}
          className="block w-full mb-2 rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={composeData.subject}
          onChange={handleChange}
          className="block w-full mb-2 rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={composeData.message}
          onChange={handleChange}
          className="block w-full mb-2 rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
        ></textarea>

        <input type="file" onChange={handleAttachment} className="mb-3" />
        {/* ✅ Show file name if attached */}
        {attachment && (
          <p className="text-sm text-gray-700 mb-3">
            📎 <strong>Attached:</strong> {attachment.name}
          </p>
        )}

        <button
          onClick={sendEmail}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ComposeEmail;
