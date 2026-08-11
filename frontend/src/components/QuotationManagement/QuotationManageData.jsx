import React, { useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./QuotationManageData.css";
import QuotationShow from "./QuotationShow";
import { useNavigate } from "react-router-dom";

const QuotationManageData = () => {
  const navigate = useNavigate();
  const [quotationAddPopup, setQuotationAddPopup] = useState(false);
  const [formQuotationData, setFormQuotationData] = useState({
    projectname:"",
    cost: "",
    startDate: "",
    endDate: "",
    services: "",
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormQuotationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuotationSubmit = () => {
    const { projectname, cost, startDate, endDate, services } = formQuotationData;

    if (!projectname || !cost || !startDate || !endDate || !services) {
      alert("Please fill in all fields before submitting the form.");
      return;
    }

    // Store data in localStorage
    const existingData = JSON.parse(localStorage.getItem("quotations")) || [];
    localStorage.setItem(
      "quotations",
      JSON.stringify([...existingData, formQuotationData])
    );

    // Clear form data after submission
    setFormQuotationData({
      projectname:"",
      cost: "",
      startDate: "",
      endDate: "",
      services: "",
    });

    alert("Form submitted successfully!");
    navigate("/quotation-creation/quotation-details");
  };

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Quotation Management
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
            <QuotationShow
              setQuotationAddPopup={setQuotationAddPopup}
              handleQuotationSubmit={handleQuotationSubmit}
              handleChange={handleChange}
              today={today}
              formQuotationData={formQuotationData}
              quotationAddPopup={quotationAddPopup}
            />
          </div>

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

export default QuotationManageData;
