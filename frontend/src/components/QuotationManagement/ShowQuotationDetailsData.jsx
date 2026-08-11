import React, { useRef, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ApproveQuotation from "./QuotationStatus/ApproveQuotation";
import RejectQuotation from "./QuotationStatus/RejectQuotation";
import AgreementCreateForm from "./AgreementSigning/AgreementCreateForm";
import { useNavigate } from "react-router-dom";
import AgreementSignData from "./AgreementSigning/AgreementSignData";

const ShowQuotationDetailsData = ({ quotation, index }) => {
  const [acceptQuotationPopup, setAcceptQuotationPopup] = useState(false);
  const [rejectQuotationPopup, setRejectQuotationPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAccepted, setIsAccepted] = useState(quotation.accepted || false);
  const [isRejected, setIsRejected] = useState(quotation.rejected || false);
  const navigate = useNavigate();
  //-------------- Agreement -------------//
  const [createAgreementPopup, setCreateAgreementPopup] = useState(false);
  const [errorAgreement, setErrorAgreement] = useState("");
  const sigCanvas = useRef(null);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [formAgreementData, setFormAgreementData] = useState({
    clientName: "",
    email: "p@gmail.com",
    contact: "9584575462",
    companyDate: new Date().toISOString().split("T")[0],
    address: "jdhd hhdhd hbdbdb ",
    totalCost: "4567458",
    paymentMethod: "axis",
    milestoneSchedule:
      "50% ($500): Before starting the project. 50% ($500): Upon project completion and delivery.",
    scopeOfWork:
      "Develop a responsive and custom website using React (Frontend), MongoDB (Database), and Node.js (Backend).",
    developersResponsibilities:
      "Deliver a fully functional, responsive, and bug-free website as per the agreed specifications. Provide testing and debugging before final delivery.",
    clientsResponsibilities:
      "Provide timely feedback and all necessary content (text, images, branding materials). Adhere to the payment terms mentioned above.",
    idiceSignature: "",
  });

  //----Signature Data---//
  const [activeButtonSignature, setActiveButtonSignature] =
    useState("signature");

  // Function to clear the signature
  const clearSignature = () => {
    sigCanvas.current.clear();
    setIsSignatureEmpty(true);
    setFormAgreementData((prevData) => ({
      ...prevData,
      idiceSignature: "",
    }));
  };

  // Function to save the signature as an image and update state
  // const saveSignature = () => {
  //   const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
  //   setFormAgreementData((prevData) => ({
  //     ...prevData,
  //     idiceSignature: dataUrl,
  //   }));
  // };

  const saveSignature = () => {
    const originalCanvas = sigCanvas.current.getTrimmedCanvas();

    // Set the willReadFrequently attribute before any read operation
    const ctx = originalCanvas.getContext("2d");
    ctx.willReadFrequently = true; // Enable this flag to optimize read operations

    const resizeWidth = 300;
    const aspectRatio = originalCanvas.height / originalCanvas.width;
    const resizeHeight = resizeWidth * aspectRatio;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = resizeWidth;
    tempCanvas.height = resizeHeight;

    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(originalCanvas, 0, 0, resizeWidth, resizeHeight);

    const resizedDataUrl = tempCanvas.toDataURL("image/png");

    setFormAgreementData((prevData) => ({
      ...prevData,
      idiceSignature: resizedDataUrl,
    }));
  };

  // Check if the signature pad is empty or has content
  const checkSignature = () => {
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      setIsSignatureEmpty(true);
    } else {
      setIsSignatureEmpty(false);
    }
  };

  useEffect(() => {
    // Set up event listener to check if user is drawing
    const interval = setInterval(checkSignature, 500);
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  const toggleSectionSignature = (buttonName) => {
    setActiveButtonSignature(buttonName);
    setFormAgreementData((prevData) => ({
      ...prevData,
      idiceSignature: "",
    }));
  };

  // Handle input change
  const handleAgreementChange = (e) => {
    const { name, value } = e.target;
    setFormAgreementData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorAgreement("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;

        // Update the formAgreementData with the new image data
        setFormAgreementData((prevData) => {
          const updatedData = { ...prevData, idiceSignature: imageData };
          localStorage.setItem(
            "formAgreementData",
            JSON.stringify(updatedData)
          ); // Save to localStorage
          return updatedData;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form fields
  const isFormValid = () => {
    return Object.values(formAgreementData).every(
      (field) => field.trim() !== "" || field === "idiceSignature"
    );
  };

  // Save data to local storage on form submission
  // const handleAgreemnetSubmit = (e) => {
  //   e.preventDefault();
  //   if (isFormValid()) {
  //     const existingData =
  //       JSON.parse(localStorage.getItem("formAgreementData")) || [];
  //     existingData.push(formAgreementData);
  //     localStorage.setItem("formAgreementData", JSON.stringify(existingData));
  //     alert("Agreement data saved successfully!");
  //     navigate("/quotation-creation/quotation-details/agreement-signing");
  //     setFormAgreementData({
  //       clientName: "",
  //       email: "",
  //       contact: "",
  //       companyDate: new Date().toISOString().split("T")[0],
  //       address: "",
  //       totalCost: "",
  //       paymentMethod: "",
  //       milestoneSchedule: "",
  //       scopeOfWork: "",
  //       developersResponsibilities: "",
  //       clientsResponsibilities: "",
  //       idiceSignature: "",
  //     });
  //     setCreateAgreementPopup(false);
  //   } else {
  //     setErrorAgreement("Please fill in all fields before submitting.");
  //   }
  // };

  const handleAgreemnetSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      // Get the existing data from localStorage, or default to an empty array
      let existingData = localStorage.getItem("formAgreementData");

      // If the data doesn't exist or is corrupted, initialize it as an empty array
      if (!existingData) {
        existingData = [];
      } else {
        // Otherwise, try to parse the existing data
        try {
          existingData = JSON.parse(existingData);
          // Ensure it's an array, in case the data is corrupted
          if (!Array.isArray(existingData)) {
            existingData = [];
          }
        } catch (error) {
          // If parsing fails (due to corrupted data), reset to an empty array
          existingData = [];
        }
      }

      const consolidatedData = {
        ...formAgreementData, // Include all form data fields
        activeButtonSignature, // Add the value of activeButtonSignature
      };
  
      // Push the consolidated object to the existing data array
      existingData.push(consolidatedData);

      // Save the updated data back to localStorage
      localStorage.setItem("formAgreementData", JSON.stringify(existingData));

      alert("Agreement data saved successfully!");
      navigate("/quotation-creation/quotation-details/agreement-signing");

      // Reset the form data
      setFormAgreementData({
        clientName: "",
        email: "",
        contact: "",
        companyDate: new Date().toISOString().split("T")[0],
        address: "",
        totalCost: "",
        paymentMethod: "",
        milestoneSchedule: "",
        scopeOfWork: "",
        developersResponsibilities: "",
        clientsResponsibilities: "",
        idiceSignature: "",
      });

      setCreateAgreementPopup(false);
    } else {
      setErrorAgreement("Please fill in all fields before submitting.");
    }
  };
  

  //-------------- Agreement -------------//
  useEffect(() => {
    // Save updated state to localStorage
    const savedQuotations =
      JSON.parse(localStorage.getItem("quotations")) || [];
    savedQuotations[index] = {
      ...quotation,
      accepted: isAccepted,
      rejected: isRejected,
      rejectionReason: rejectionReason,
    };
    localStorage.setItem("quotations", JSON.stringify(savedQuotations));
  }, [isAccepted, isRejected, rejectionReason, quotation, index]);

  const quotationRef = useRef();
  const generateQuotationPDF = async () => {
    const element = quotationRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Quotation of ${quotation.projectname}.pdf`);
  };

  const handleQuotationAccept = () => {
    const isSure = window.confirm(
      "Are you sure you want to accept this quotation?"
    );
    if (isSure) {
      setIsAccepted(true);
      setAcceptQuotationPopup(true);
    }
  };

  const handleQuotationReject = () => {
    setRejectQuotationPopup(true);
  };

  const handleSubmitRejection = () => {
    if (rejectionReason.trim()) {
      setIsRejected(true);
      setIsAccepted(false);
      setShowRejectForm(false);
      setRejectQuotationPopup(false);
    } else {
      alert("Please provide a reason for rejection.");
    }
  };

  return (
    <div>
      <div
        className="bg-white max-h-[calc(100vh-200px)] flex flex-col justify-start shadow-lg p-6 rounded-lg"
        ref={quotationRef}
      >
        {/* Header */}
        <header className="flex justify-between items-center border-b-2 border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quotation for : <br />
            {quotation.projectname}
          </h1>
        </header>

        {/* Client Information */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Business Requirements Document For:
          </h2>
          <p className="text-sm text-gray-600">{quotation.projectname}</p>
        </section>

        {/* Invoice Items */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-black">
                <th className="py-2 text-start">Cost</th>
                <th className="py-2 text-start">Start Date</th>
                <th className="py-2 text-start">End Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b text-sm text-gray-800">
                <td className="py-2">${Number(quotation.cost).toFixed(2)}</td>
                <td className="py-2">{quotation.startDate}</td>
                <td className="py-2">{quotation.endDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <section className="text-left md:mt-2 mb-5">
          <div className="flex gap-3 items-center mt-2">
            <span className="text-md text-black font-semibold">Services:</span>
            <span className="text-sm text-gray-800">{quotation.services}</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          Thank you for your business!
        </footer>
      </div>
      <div className="flex items-end justify-center gap-2">
        {/* Show Accept and Reject buttons only if not already accepted or rejected */}
        {!isAccepted && !isRejected && (
          <>
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleQuotationAccept}
            >
              Accept
            </button>
            <button
              className="bg-red-700 text-white px-3 py-2 rounded mt-2 hover:bg-red-900"
              onClick={handleQuotationReject}
            >
              Reject
            </button>
          </>
        )}

        {/* Show Accepted button if accepted */}
        {isAccepted && (
          <button
            className="bg-gray-400 text-white px-3 py-2 rounded mt-2 cursor-not-allowed"
            disabled
          >
            Accepted
          </button>
        )}

        {/* Show Rejected button if rejected */}
        {isRejected && (
          <button
            className="bg-gray-400 text-white px-3 py-2 rounded mt-2 cursor-not-allowed"
            disabled
          >
            Rejected
          </button>
        )}
        {/*<button className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
          Share
        </button> */}
        <button
          className="mt-4 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700"
          onClick={generateQuotationPDF}
        >
          Download
        </button>

        {!isRejected && (
          <button
            className={`mt-4 px-3 py-2 rounded ${
              isAccepted
                ? "bg-bgDataNew text-white hover:bg-[#fc6b001c]"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!isAccepted}
            onClick={() => setCreateAgreementPopup(true)}
          >
            Create Aggrement
          </button>
        )}
      </div>

      {createAgreementPopup && (
        <AgreementCreateForm
          setCreateAgreementPopup={setCreateAgreementPopup}
          formAgreementData={formAgreementData}
          handleAgreemnetSubmit={handleAgreemnetSubmit}
          handleAgreementChange={handleAgreementChange}
          errorAgreement={errorAgreement}
          isFormValid={isFormValid}
          activeButtonSignature={activeButtonSignature}
          toggleSectionSignature={toggleSectionSignature}
          sigCanvas={sigCanvas}
          clearSignature={clearSignature}
          saveSignature={saveSignature}
          isSignatureEmpty={isSignatureEmpty}
          handleImageChange={handleImageChange}
        />
      )}

      {acceptQuotationPopup && (
        <ApproveQuotation
          message={`Thank you for accepting the "${quotation.projectname}" Project. I am confident that your expertise will bring valuable insights and help achieve the project's goals effectively.`}
          setAcceptQuotationPopup={setAcceptQuotationPopup}
        />
      )}

      {rejectQuotationPopup && (
        <RejectQuotation
          setRejectQuotationPopup={setRejectQuotationPopup}
          setRejectionReason={setRejectionReason}
          handleSubmitRejection={handleSubmitRejection}
          rejectionReason={rejectionReason}
        />
      )}
    </div>
  );
};

export default ShowQuotationDetailsData;
