import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./EmpReportManageData.css";
import { useNavigate } from "react-router-dom";
import ContentTop from "../../ContentTop/ContentTop";
import {
  EmpCheckInCheckOutReportData,
  fetchAllUsers,
} from "../../../redux/userSlice";
import axios from "axios";
import { iconsImgs } from "../../../utils/images";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const EmpCheckInCheckoutReport = () => {
  const dispatch = useDispatch();

  const { empCinCotData, allusers } = useSelector((state) => state.user);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchEmp, setSearchEmp] = useState("");
  const [searchDay, setSearchDay] = useState("");
  const [workingTime, setWorkingTime] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const leadPerPage = 10;

  // Fetch departments whenever searchTerm or currentPage changes
  const fetchTotalWorkingHours = async ({ month, emp_id, day }) => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/calculate-workhours`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month, // Use function parameter directly
          emp_id, // Use function parameter directly
          day, // Use function parameter directly
        },
      });
      setWorkingTime(response?.data?.total_working_hours);
      //console.log("Working hours:", response.data.total_working_hours);
      return response.data; // Return data if needed
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(
      EmpCheckInCheckOutReportData({
        month: searchMonth,
        emp_id: searchEmp,
        day: searchDay,
      })
    );
    fetchTotalWorkingHours({
      month: searchMonth,
      emp_id: searchEmp,
      day: searchDay,
    });
  }, [dispatch, searchMonth, searchEmp, searchDay]);

  // Handle search input change
  //   const handleSearchChange = (e) => {
  //     setSearchTerm(e.target.value);
  //     //setCurrentPage(1); // Reset to first page when searching
  //   };

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
      const response = await axios.get(`${API_URL}/auth/export-employee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month: searchMonth,
          emp_id: searchEmp,
          day: searchDay,
        },
        responseType: "blob", // ✅ Important to keep it here
      });

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Employee_Working_Hours_Report.xlsx"); // File name
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
            <div>
              <h1
                className="text-white text-[14px] font-semibold flex items-center cursor-pointer"
                onClick={() => navigate(-1)}
              >
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
                <span className="border border-gray-300 px-3 rounded-[5px]">
                  Back
                </span>{" "}
                &nbsp;&nbsp;&nbsp;Employee Check:In/Out
              </h1>
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
              <div className="my-3 md:my-0">
                <span className="text-green-600 text-newtextdata whitespace-nowrap ">
                  Total Time: {workingTime}
                </span>
              </div>
              <div className="flex items-center flex-row gap-[8px] md:gap-[5px]">
                <div>
                  <select
                    value={searchMonth}
                    onChange={(e) => setSearchMonth(e.target.value)}
                    className="w-full rounded border text-newtextdata whitespace-nowrap border-[#473b33] bg-[#1e1e2d] px-3 py-1 text-white outline-none"
                  >
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {new Date(0, i).toLocaleString("en", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={searchDay}
                    onChange={(e) => setSearchDay(e.target.value)}
                    className="w-full rounded border text-newtextdata whitespace-nowrap border-[#473b33] bg-[#1e1e2d] px-3 py-1 text-white outline-none"
                  >
                    <option value="">Select Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center flex-row gap-[8px] md:gap-[5px]">
                <div>
                  <select
                    value={searchEmp}
                    onChange={(e) => setSearchEmp(e.target.value)}
                    className="w-full rounded border text-newtextdata whitespace-nowrap border-[#473b33] bg-[#1e1e2d] px-3 py-1 text-white outline-none"
                  >
                    <option value="">Select Employee</option>
                    {allusers?.data?.map((user, index) => (
                      <option key={index} value={user.id}>
                        {user.fullname}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    className="flex items-center text-newtextdata whitespace-nowrap whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.23rem]"
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
          </div>
          <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
            <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
              {/* {/------- Table Data Start -------/} */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Id
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Name
                      </th>

                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        CheckIn Time
                      </th>

                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Checkout Time
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        CheckIn Location
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Checkout Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {empCinCotData &&
                      empCinCotData?.records?.map((user, index) => (
                        <tr key={index + 1}>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {new Date(user?.data)?.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            <div className="text-newtextdata whitespace-normal break-words max-w-[120px]">
                              {user?.User?.fullname}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {new Date(user?.check_in_time)?.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {new Date(user?.check_out_time)?.toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            <div className="text-newtextdata whitespace-normal break-words max-w-[300px]">
                              {user?.checkin_location}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            <div className="text-newtextdata whitespace-normal break-words max-w-[300px]">
                              {user?.checkout_location}
                            </div>
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

export default EmpCheckInCheckoutReport;
