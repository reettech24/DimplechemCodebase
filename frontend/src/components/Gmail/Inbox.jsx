import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-regular-svg-icons";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Inbox = ({
  gmailAccessToken,
  fetchInboxMessages,
  labelName = "INBOX",
  getMessageDetail,
}) => {
  //console.log("labelName" ,labelName);
  const [emails, setEmails] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [currentPageToken, setCurrentPageToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [pdfToOpen, setPdfToOpen] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [sentMailCount, setSentMailCount] = useState(0);
  const [allRecipients, setAllRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [isRecipientDropdownOpen, setRecipientDropdownOpen] = useState(false);
  const [recipientSearchTerm, setRecipientSearchTerm] = useState("");

  const toggleRecipientDropdown = () => {
    setRecipientDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isRecipientDropdownOpen) setRecipientSearchTerm("");
  }, [isRecipientDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest("#recipient-dropdown-button") &&
        !e.target.closest("#recipient-dropdown-panel")
      ) {
        setRecipientDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getRandomColor = (key) => {
    const colors = [
      "#FF5722",
      "#3F51B5",
      "#9C27B0",
      "#4CAF50",
      "#FFC107",
      "#E91E63",
      "#00BCD4",
    ];
    const index = key.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // const getInbox = async () => {
  //   try {
  //     const msgs = await fetchInboxMessages(labelName);
  //     setEmails(msgs);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     setLoading(false);
  //   }
  // };
  const getToRecipients = (headers) => {
    const toHeader = headers.find((header) => header.name === "To");
    if (!toHeader) return [];

    // Split by comma for multiple recipients
    const recipients = toHeader.value
      .split(",")
      .map((recipient) => recipient.trim());

    // Map into { name, email } objects
    return recipients.map((r) => {
      const match = r.match(/(.*)<(.*)>/);
      if (match) {
        return { name: match[1].trim(), email: match[2].trim() };
      } else {
        return { name: r, email: r };
      }
    });
  };

  const filteredEmails = emails?.filter((email) => {
    if (!selectedRecipient) return true;
    const recipients = getToRecipients(email.headers);
    const targetEmail = selectedRecipient.match(/\(([^)]+)\)/)?.[1];
    return recipients.some((r) => r.email === targetEmail);
  });

  const getInbox = async (token = "") => {
    try {
      const result = await fetchInboxMessages(labelName, token);
      const cleanRecipientMap = new Map();
      // process your emails here
      const newRecipients = result.messages.forEach((email) => {
        getToRecipients(email.headers).forEach((r) => {
          const cleanEmail = r.email.trim().toLowerCase();
          if (!cleanRecipientMap.has(cleanEmail)) {
            cleanRecipientMap.set(cleanEmail, `${r.name} (${cleanEmail})`);
          }
        });
      });

      // Add unique recipients to state
      setAllRecipients((prev) =>
        Array.from(
          new Set([...prev, ...Array.from(cleanRecipientMap.values())])
        )
      );

      setSentMailCount(result.resultSizeEstimate);
      setEmails(result.messages);
      setNextPageToken(result.nextPageToken);
      setCurrentPageToken(token);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getMessageFullDetail = async (msgid) => {
    try {
      const msgs = await getMessageDetail(msgid);
      setSelectedMessage(msgs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gmailAccessToken) {
      getInbox();
    }
  }, [gmailAccessToken, labelName]);

  function getHeader(headers, name) {
    if (!headers) return "";
    const header = headers.find((h) => h.name === name);
    return header ? header.value : "";
  }

  //old function
  // function getBody(payload) {
  //   if (!payload) return "No content available";

  //   let encodedBody = "";
  //   if (payload.parts) {
  //     const htmlPart = payload.parts.find(
  //       (part) => part.mimeType === "text/html"
  //     );
  //     encodedBody = htmlPart?.body?.data;
  //   } else {
  //     encodedBody = payload.body?.data;
  //   }

  //   if (!encodedBody) return "No content";

  //   return atob(encodedBody.replace(/-/g, "+").replace(/_/g, "/"));
  // }

  function getBody(payload) {
    if (!payload) return "No content available";

    let encodedBody = "";

    if (payload.parts) {
      // Prioritize text/html
      const htmlPart = payload.parts.find(
        (part) => part.mimeType === "text/html"
      );
      if (htmlPart?.body?.data) {
        encodedBody = htmlPart.body.data;
      } else {
        // Fallback to text/plain
        const textPart = payload.parts.find(
          (part) => part.mimeType === "text/plain"
        );
        if (textPart?.body?.data) {
          encodedBody = textPart.body.data;
          return `<pre>${atob(
            encodedBody.replace(/-/g, "+").replace(/_/g, "/")
          )}</pre>`;
        }
      }
    } else if (payload.body?.data) {
      encodedBody = payload.body.data;
    }

    if (!encodedBody) return "No content";

    return atob(encodedBody.replace(/-/g, "+").replace(/_/g, "/"));
  }

  const decodeBody = (bodyData) => {
    const decoded = atob(bodyData.replace(/-/g, "+").replace(/_/g, "/"));
    return decoded;
  };

  const handleConfirmPassword = (enteredPassword) => {
    const correctPassword = "yourSecret123"; // or fetch dynamically based on attachment if needed

    if (enteredPassword === correctPassword) {
      const byteCharacters = atob(pdfToOpen.dataUrl.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: pdfToOpen.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } else {
      alert("Incorrect password.");
    }

    setIsPasswordModalOpen(false);
  };

  const openProtectedPDF = (att) => {
    setPdfToOpen(att);
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-black">
        <FontAwesomeIcon icon={faEnvelopeOpenText} className="text-blue-600" />
        {labelName}
        {/* {labelName === "SENT" && `(${sentMailCount})`} */}
        {labelName === "SENT" && `(${filteredEmails?.length})`}
      </h2>
      {labelName === "SENT" && (
        <div className="relative">
          {/* To button */}
          <button
            id="recipient-dropdown-button"
            onClick={toggleRecipientDropdown}
            className="flex items-center border bg-blue-100 text-blue-700 font-medium rounded px-2 py-1 gap-1"
          >
            {selectedRecipient ? (
              <span className="flex items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                  style={{
                    backgroundColor: getRandomColor(
                      selectedRecipient.charAt(0)
                    ),
                  }}
                >
                  {selectedRecipient.charAt(0).toUpperCase()}
                </div>
                {selectedRecipient?.match(/\(([^)]+)\)/)?.[1] ||
                  selectedRecipient}
                <svg
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRecipient(null);
                  }}
                  className="w-4 h-4 cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 
           1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 
           1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 
           10 6.293 7.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ) : (
              "To"
            )}
            <svg
              className="w-4 h-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 
      0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 
      8.27a.75.75 0 01-.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {isRecipientDropdownOpen && (
            <div
              id="recipient-dropdown-panel"
              className="absolute left-0 top-8 w-[350px] rounded border bg-white shadow-lg overflow-y-auto max-h-96 z-50"
            >
              <input
                type="text"
                placeholder="Name or email"
                value={recipientSearchTerm}
                onChange={(e) => setRecipientSearchTerm(e.target.value)}
                className="w-full border-b p-2 outline-none text-sm text-black"
              />

              <div className="divide-y">
                {allRecipients
                  .filter((recipient) =>
                    recipient
                      .toLowerCase()
                      .includes(recipientSearchTerm.toLowerCase())
                  )
                  .map((recipient, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedRecipient(recipient);
                        setRecipientDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          backgroundColor: getRandomColor(recipient.charAt(0)),
                        }}
                      >
                        {recipient.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium truncate text-black">
                          {recipient.split(" (")[0]}
                        </span>
                        <span className="text-gray-500 text-xs truncate">
                          {recipient.match(/\(([^)]+)\)/)?.[1]}
                        </span>
                      </div>
                    </div>
                  ))}
                {/* No result found message */}
                {allRecipients.filter((recipient) =>
                  recipient
                    .toLowerCase()
                    .includes(recipientSearchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="p-3 text-gray-500 text-center text-sm">
                    No recipients found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-black">Loading emails...</p>
      ) : selectedMessage && selectedMessage.payload ? (
        // Show the full message details if a message is selected
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="border bg-bgDataNew rounded-[5px] w-fit pl-1 pr-3">
            <button
              className="back-button text-blue-600 flex items-center border mb-1 text-white"
              onClick={() => setSelectedMessage(null)} // Set to null to go back to the list
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 36 36"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer mt-[1px]"
              >
                <path
                  d="M22.5 27L13.5 18L22.5 9"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>{" "}
              Back to inbox
            </button>
          </div>

          <h3 className="text-[17px] font-bold mt-2 mb-1 text-gray-500">
            {getHeader(selectedMessage.payload.headers, "Subject")}
          </h3>
          <p className="text-gray-500">
            <strong>From:</strong>{" "}
            {getHeader(selectedMessage.payload.headers, "From")}
          </p>
          <p className="text-gray-500">
            <strong>Date:</strong>{" "}
            {getHeader(selectedMessage.payload.headers, "Date")}
          </p>
          <div
            className="mt-4 border-t pt-4 text-gray-500"
            dangerouslySetInnerHTML={{
              __html: getBody(selectedMessage.payload),
            }}
          ></div>

          {/* Show images */}
          {selectedMessage.attachments &&
            selectedMessage.attachments
              .filter((att) => att.mimeType.startsWith("image/"))
              .map((att, idx) => (
                <div key={idx} className="mt-4">
                  <strong>{att.filename}</strong>
                  <img
                    src={att.dataUrl}
                    alt={att.filename}
                    className="max-w-full h-auto border rounded shadow"
                  />
                </div>
              ))}

          {selectedMessage.attachments &&
            selectedMessage.attachments
              .filter((att) => att.mimeType === "application/pdf")
              .map((att, idx) => (
                <div
                  key={idx}
                  className="mt-4 flex items-center gap-4 border p-3 rounded shadow"
                >
                  <img
                    src="/pdf-icon.png" // use your own PDF icon here
                    alt="PDF"
                    className="w-12 h-12"
                  />
                  <div>
                    <strong className="block">{att.filename}</strong>
                    <div className="flex gap-3 mt-2">
                      {/* Download button */}
                      <a
                        href={att.dataUrl}
                        download={att.filename}
                        className="text-blue-600 underline cursor-pointer"
                      >
                        Download
                      </a>

                      {/* View in new tab */}
                      <a
                        onClick={() => openProtectedPDF(att)}
                        className="text-green-600 underline cursor-pointer"
                      >
                        View (Protected)
                      </a>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      ) : (
        // Show the list of emails when no message is selected
        <>
          <div className="border rounded-lg bg-white divide-y">
            {filteredEmails?.map((email) => (
              <div
                key={email.id}
                onClick={() => {
                  getMessageFullDetail(email.id); // Fetch message details on click
                  setSelectedMessage(email); // Set the selected email
                }}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition cursor-pointer"
              >
                {/* Left icons */}
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="form-checkbox" />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-blue-500"
                  />
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                </div>

                {/* Email content */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-4 overflow-hidden">
                  <div className="font-medium truncate w-32 sm:w-40 text-gray-500">
                    {email?.from}
                  </div>
                  <div className="truncate flex-1">
                    <span className="font-medium text-gray-400">
                    {(email?.subject?.slice(0, 30) || "") +
                      (email?.subject?.length > 30 ? "..." : "")}{" "}
                    -
                  </span>{" "}
                  <span className="text-gray-800">
                    {(email?.snippet?.slice(0, 30) || "") +
                      (email?.snippet?.length > 30 ? "..." : "")}
                  </span>
                  </div>
                </div>

                {/* Time */}
                <div className="text-sm text-gray-500 w-16 text-right">
                  {email?.time}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 my-4">
              <button
                onClick={() => getInbox()} // First page
                className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-[#fd6c00bf] mt-4 ml-4"
              >
                Previous
              </button>

              <button
                disabled={!nextPageToken}
                onClick={() => getInbox(nextPageToken)}
                className={`px-3 py-1 ${
                  !nextPageToken ? "bg-gray-300" : "bg-bgDataNew text-white px-3 py-1 rounded hover:bg-[#fd6c00bf] mt-4 mr-4"
                } rounded`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Inbox;
