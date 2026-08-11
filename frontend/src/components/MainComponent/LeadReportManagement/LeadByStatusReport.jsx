import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ReportManageData.css";
import { useNavigate } from "react-router-dom";
import ContentTop from "../../ContentTop/ContentTop";
import { AllLeadsData } from "../../../redux/leadSlice";
import axios from "axios";
import { iconsImgs } from "../../../utils/images";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const LeadByStatusReport = () => {
  const dispatch = useDispatch();

  const { allfilterleads } = useSelector((state) => state.lead);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setsearchStatus] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const leadPerPage = 10;

  // Fetch departments whenever searchTerm or currentPage changes
  useEffect(() => {
    dispatch(
      AllLeadsData({
        search: searchTerm,
        lead_status: searchStatus,
      })
    );
  }, [dispatch, searchTerm, searchStatus]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    //setCurrentPage(1); // Reset to first page when searching
  };

  const handleLeadStatusChange = (e) => {
    setsearchStatus(e.target.value);
    //setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getAuthToken = () => localStorage.getItem("token");

  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/export-leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: searchTerm,
          lead_status: searchStatus,
        },
        responseType: "blob", // ✅ Important to keep it here
      });

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Leads_status_Report.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="main-content">
      <ContentTop />
      <div className="main-content-holder max-h-[600px] heightfixalldevice overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
            <div className="mb-5 md:mb-0">
              <h1 className="text-white text-[14px] font-semibold flex items-center cursor-pointer" onClick={() => navigate(-1)}>
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
                <span className="border border-gray-300 px-3 rounded-[5px]">Back</span> &nbsp;&nbsp;&nbsp;Leads by Status
              </h1>
              {/* <input
              type="search"
              className="border border-[#473b33] bg-transparent px-3 py-[0.15rem] text-white outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            /> */}
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
              <div>
                <select
                  name="lead_status"
                  value={searchStatus}
                  onChange={handleLeadStatusChange}
                  className="relative m-0 block w-full min-w-0 flex-auto rounded text-textdata border border-solid border-[#473b33] bg-[#1e1e2d] bg-clip-padding px-3 py-[0.30rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:bg-[#1e1e2d] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                >
                  <option value="" className="text-white">
                    Select the Lead Status
                  </option>
                  <option value="Hot" className="text-white">
                    Hot
                  </option>
                  <option value="Warm" className="text-white">
                    Warm
                  </option>
                  <option value="Cold" className="text-white">
                    Cold
                  </option>
                  <option value="In Discussion" className="text-white">
                    In Discussion
                  </option>
                  <option value="On Hold" className="text-white">
                    On Hold
                  </option>
                  <option value="Lost" className="text-white">
                    Lost
                  </option>
                </select>
              </div>
              <div className="flex items-center gap-[20px] md:gap-[5px] mt-3 md:mt-0">
                <div>
                  <input
                    type="search"
                    className="relative m-0 block text-textdata whitespace-nowrap w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <div>
                  <button
                    className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.18rem]"
                    onClick={handleExportData}
                  >
                    <img
                      src={iconsImgs.plus}
                      alt="plus icon"
                      className="w-[18px] mr-1"
                    />{" "}
                    Export Data
                  </button>
                </div>
              </div>
            </div>

            {/* <button
                className="bg-bgData text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={handleExportData}
              >
               Export Data
              </button> */}
          </div>
          <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
            <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 mb-4 overflow-auto mb-3">
              {/* {/------- Table Data Start -------/} */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Id
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Lead Status
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Lead Source
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Company
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Lead Owner
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allfilterleads &&
                      allfilterleads?.data?.map((lead, index) => (
                        <tr key={index + 1}>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.lead_status}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.lead_source}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.customer?.company_name}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.leadOwner?.fullname}
                          </td>
                          <td className="px-4 py-2 text-newtextdata w-[400px]">
                            {lead?.lead_address}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* {/------- Table Data End -------/} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadByStatusReport;
