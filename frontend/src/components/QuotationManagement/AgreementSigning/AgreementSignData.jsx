import React, { useState, useEffect, useRef } from "react";
import { iconsImgs } from "../../../utils/images";
import "./AgreementSignData.css";
import { useNavigate } from "react-router-dom";
import AgreementShowData from "./AgreementShowData";
import ClientSignPopupData from "./ClientSignPopupData";

const AgreementSignData = () => {
  const navigate = useNavigate();
  const hiddenFileInputSignature = useRef(null);
  const [agreementData, setAgreementData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [clientSign, setClientSign] = useState(false);

  //--------------- Client Signature Section -----------------//
  const sigClientCanvas = useRef(null);
  const [isSignatureClientEmpty, setIsSignatureClientEmpty] = useState(true);

  // Function to clear the signature
  const clearClientSignature = () => {
    sigClientCanvas.current.clear();
    setIsSignatureClientEmpty(true);
  };

  const saveClientSignature = () => {
    const originalCanvas = sigClientCanvas.current.getTrimmedCanvas();

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

    // Get existing data from localStorage
    const existingData =
      JSON.parse(localStorage.getItem("formAgreementData")) || [];

    // Check if there's a valid index and update the clientSignature field at that index
    if (currentIndex !== null && existingData[currentIndex]) {
      existingData[currentIndex].clientSignature = resizedDataUrl;


      console.log("DatanewExisting",existingData);

      // Save updated data back to localStorage
      localStorage.setItem("formAgreementData", JSON.stringify(existingData));
      alert("Your Signature Upload ")
      // Update the agreementData state
      setAgreementData([...existingData]);
    }
  };

  const handleButtonClientSignature = (index) => {
    setCurrentIndex(index);
    setClientSign(true);
    sigClientCanvas.current.click();
  };

  const handlePopupClientSignature = () =>{
    setClientSign(false);
  }

  // Check if the signature pad is empty or has content
  const checkClientSignature = () => {
    if (sigClientCanvas.current && sigClientCanvas.current.isEmpty()) {
      setIsSignatureClientEmpty(true);
    } else {
      setIsSignatureClientEmpty(false);
    }
  };

  useEffect(() => {
    // Set up event listener to check if user is drawing
    const interval = setInterval(checkClientSignature, 500);
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  //--------------- Client Signature Section -----------------//

  const handleFileChangePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Get existing data from localStorage
        const existingData =
          JSON.parse(localStorage.getItem("formAgreementData")) || [];

        if (currentIndex !== null && existingData[currentIndex]) {
          // Update clientSignature at the correct index
          existingData[currentIndex].clientSignature = reader.result;

          // Save updated data back to localStorage
          localStorage.setItem(
            "formAgreementData",
            JSON.stringify(existingData)
          );

          // Update state to reflect changes
          setAgreementData([...existingData]);
        }
      };
      reader.readAsDataURL(file); // Read the file as base64 data
    }
  };

  // Handle the button click, store the current index
  const handleButtonClickSignature = (index) => {
    setCurrentIndex(index);
    hiddenFileInputSignature.current.click(); // Trigger the hidden file input
  };

  useEffect(() => {
    const savedAgreements =
      JSON.parse(localStorage.getItem("formAgreementData")) || [];
    setAgreementData(savedAgreements);
  }, []);

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold flex items-center cursor-pointer" onClick={() => navigate(-1)}>
              <svg
                width="25"
                height="25"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => navigate(-1)}
                className="cursor-pointer"
              >
                <path
                  d="M22.5 27L13.5 18L22.5 9"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="border border-gray-300 px-3 rounded-[5px]">Back</span> &nbsp;&nbsp;&nbsp;Agreement Data
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div>
              {/* <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search Quotation"
              /> */}
            </div>
            <div>
              {/* <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"

              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Add Quotation in pdf/Docx
              </button> */}
            </div>
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
          {/*------- Show the Quotation -------*/}
          <div className="grid grid-row-1 md:grid-cols-2 gap-6 px-6">
            {agreementData.map((agreement, index) => (
              <AgreementShowData
                key={index}
                index={index}
                agreement={agreement}
                handleButtonClickSignature={handleButtonClickSignature}
                handleButtonClientSignature={handleButtonClientSignature}
                handleFileChangePhoto={handleFileChangePhoto}
                hiddenFileInputSignature={hiddenFileInputSignature}
                setClientSign={setClientSign}
                clientSign={clientSign}
              />
            ))}
          </div>

          {clientSign && (
            <ClientSignPopupData
              sigClientCanvas={sigClientCanvas}
              clearClientSignature={clearClientSignature}
              saveClientSignature={saveClientSignature}
              isSignatureClientEmpty={isSignatureClientEmpty}
              setClientSign={setClientSign}
              handlePopupClientSignature={handlePopupClientSignature}
              className="hidden"
            />
          )}

          {/*------- Show the Quotation -------*/}
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
    </div>
  );
};

export default AgreementSignData;
