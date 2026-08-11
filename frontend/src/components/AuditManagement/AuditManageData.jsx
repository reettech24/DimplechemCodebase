import React, { useState, useEffect, useRef } from "react";
import { iconsImgs } from "../../utils/images";
import "./AuditManageData.css";
import AuditListShow from "./AuditListShow";
import AuditManageUserModal from "./AuditManageUserModal";
import AuditListShowData from "./AuditListShowData";

const AuditManageData = () => {
  const [audits, setAudits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState(null);
  const [ncFormData, setNcFormData] = useState({
    description: "",
    actionPlan: "",
    dueDate: "",
    digitalSignature: "",
  });

  useEffect(() => {
    const storedAudits = JSON.parse(localStorage.getItem("audits")) || [];
    if (storedAudits.length === 0) {
      const initialAudits = [
        {
          id: 1,
          client: "ABC Pvt Ltd",
          status: "Pending Review",
          date: "31 January 2025",
          reviewed: false,
          detailsShared: false,
          ncFormAttached: false,
          signed: false,
          digitalSignature: "",
          description:"",
          actionPlan:"",
          dueDate:""
        },
        {
          id: 2,
          client: "XYZ Corp",
          status: "Under Review",
          date: "25 January 2025",
          reviewed: false,
          detailsShared: false,
          ncFormAttached: false,
          signed: false,
          digitalSignature: "",
          description:"",
          actionPlan:"",
          dueDate:""
        },
      ];
      localStorage.setItem("audits", JSON.stringify(initialAudits));
      setAudits(initialAudits);
    } else {
      setAudits(storedAudits);
    }
  }, []);

  const saveAudits = (newAudits) => {
    setAudits(newAudits);
    localStorage.setItem("audits", JSON.stringify(newAudits));
  };

  const completeReview = (id) => {
    const newAudits = audits.map((audit) =>
      audit.id === id ? { ...audit, reviewed: true, status: "Reviewed" } : audit
    );
    saveAudits(newAudits);
  };

  const shareAuditDetails = (id) => {
    const newAudits = audits.map((audit) =>
      audit.id === id ? { ...audit, detailsShared: true } : audit
    );
    saveAudits(newAudits);
  };

  const generateNCForm = (id) => {
    setSelectedAuditId(id);
    setShowModal(true);
  };

  const handleNcFormChange = (e) => {
    const { name, value } = e.target;
    setNcFormData({ ...ncFormData, [name]: value });
  };

  const handleDigitalSignatureChange = () => {
    setNcFormData({
      ...ncFormData,
      digitalSignature: !ncFormData.digitalSignature,
    });
  };

  const shareNCFormWithClient = () => {
    if (!ncFormData.digitalSignature) {
      alert("Please provide a digital signature to share the NC Form.");
      return;
    }

    // Logic to share the NC form with the client (e.g., send an email or API call)
    alert("NC Form shared with the client. and also Add the NC Form Data in the Audit Report");
    console.log("ncformData",ncFormData)
     // Get existing data from localStorage
     const existingData = JSON.parse(localStorage.getItem("audits")) || [];

     // Check if there's a valid index and update the clientSignature field at that index
     if (currentIndex !== null && existingData[currentIndex]) {
       
     // Update the correct audit object
       existingAudits[currentIndex] = {
         ...existingAudits[currentIndex],
         digitalSignature: resizedDataUrl,
         description: ncFormData.description, // Ensure other fields are updated
         actionPlan: ncFormData.actionPlan,
         dueDate: ncFormData.dueDate,
       };
 
       // Save updated data back to localStorage
       localStorage.setItem("audits", JSON.stringify(existingData));
       alert("Your Signature Upload ");
       // Update the agreementData state
       setAudits([...existingData]);
     }
    const newAudits = audits.map((audit) =>
      audit.id === selectedAuditId
        ? { ...audit, signed: true, status: "Signed by Client" }
        : audit
    );
    saveAudits(newAudits);
    setShowModal(false); // Close the modal after sharing
  };

  //--------- Signature Data ----------//
  const sigauditCanvas = useRef(null);
  const [isSignatureauditEmpty, setIsSignatureauditEmpty] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Function to clear the signature
  const clearauditSignature = () => {
    sigauditCanvas.current.clear();
    setIsSignatureauditEmpty(true);
  };

  const saveauditSignature = () => {
    const originalCanvas = sigauditCanvas.current.getTrimmedCanvas();

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

    setNcFormData((prevData) => ({
      ...prevData,
      digitalSignature: resizedDataUrl,
    }));

   alert("Saved Signature");
  };

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Audit Management Report Data
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div>
              {/* <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
              /> */}
            </div>
            {/* <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={() => setAddUserModalOpen(true)}
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Add New Document
              </button>
            </div> */}
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
          {/*------- Show the Audit Management Data -------*/}

          <div className="grid grid-row-1 md:grid-cols-2 gap-4">
            {audits.map((audit, index) => (
              <AuditListShowData
                key={audit.id}
                audit={audit}
                completeReview={completeReview}
                shareAuditDetails={shareAuditDetails}
                generateNCForm={generateNCForm}
              />
            ))}
          </div>
          {/* <AuditListShow
            audits={audits}
            completeReview={completeReview}
            shareAuditDetails={shareAuditDetails}
            generateNCForm={generateNCForm}
          /> */}
          {/*------- Show the Audit Management Data -------*/}
        </div>
        <div className="flex justify-between">
          {/* Pagination Controls with Number */}
          {/* <PaginationCR
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          /> */}
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <AuditManageUserModal
          ncFormData={ncFormData}
          handleNcFormChange={handleNcFormChange}
          handleDigitalSignatureChange={handleDigitalSignatureChange}
          shareNCFormWithClient={shareNCFormWithClient}
          setShowModal={setShowModal}
          sigauditCanvas={sigauditCanvas}
          clearauditSignature={clearauditSignature}
          saveauditSignature={saveauditSignature}
          isSignatureauditEmpty={isSignatureauditEmpty}
          setIsSignatureauditEmpty={setIsSignatureauditEmpty}
        />
      )}
    </div>
  );
};

export default AuditManageData;
