import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentTop from "../../ContentTop/ContentTop";
import EmailSentTableReport from "./EmailSentTableReport";
import ViewDocumnetList from "./ViewDocumnetList";
import Pagination from "./Pagination";
import { getEmailSentReportData } from "../../../redux/userSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const EmailSentReportData = () => {
  const dispatch = useDispatch();
  const { emailSentData, totalPages, userLoading, userError } = useSelector(
    (state) => state.user
  );

  const [isViewReportOpen, setIsViewReportOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  const [selectedDocList, setSelectedDocList] = useState({});
  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const abpPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  useEffect(() => {
    dispatch(
      getEmailSentReportData({
        page: currentPage,
        limit: abpPerPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm, abpPerPage, entriesPerPageNewData]);


  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExportData = () => {
    const exportData = emailSentData?.data?.map((user, index) => ({
      "Sr. No.": index + 1,
      "Employee Name": user?.employee?.fullname || "-",
      "Customer Name": user?.customer?.company_name || "-",
      "Customer Email": user?.customer?.email_id || "-",
      "Sent Email": user?.email_count || 0,
      "Sent Document": user?.document_count || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Customize column widths
    const colWidths = [
      { wch: 10 }, // Sr. No.
      { wch: 25 }, // Employee Name
      { wch: 25 }, // Customer Name
      { wch: 30 }, // Customer Email
      { wch: 12 }, // Sent Email
      { wch: 15 }, // Sent Document
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Email Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `Email_Sent_Report_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    saveAs(data, fileName);
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Email Sent Report
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div>
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={handleExportData}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
        <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide mb-4">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*--------- New Pagination Code Start  ---------*/}
            <div className="flex justify-end items-center mb-5 text-white rounded-md font-sans gap-10">
              <div className="flex items-center">
                <span className="text-sm text-white bg-[#473b33] rounded-l-[5px] flex items-center text-center px-3 h-8">
                  Show Data
                </span>
                <div className="relative cursor-pointer">
                  <select
                    className="appearance-none cursor-pointer h-8 pr-8 pl-5 rounded-r-[5px] bg-[#3d3d57] text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    value={entriesPerPageNewData}
                    onChange={(e) => {
                      setEntriesPerPageNewData(Number(e.target.value));
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/*--------- New Pagination Code End  ---------*/}
            {/*------- Table Data Start -------*/}
            <EmailSentTableReport
              ABPdata={emailSentData?.data}
              anualbsplanReportdata={emailSentData}
              setIsViewReportOpen={setIsViewReportOpen}
              setSelectedDocList={setSelectedDocList}
            />
            {/*-------- Table Data End --------*/}
          </div>
        </div>

        {/* View User Modal */}
        {isViewReportOpen && (
          <ViewDocumnetList
            setIsViewReportOpen={setIsViewReportOpen}
            selectedDocList={selectedDocList}
          />
        )}
      </div>
      {/* Pagination Controls with Number */}
      <Pagination
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default EmailSentReportData;
