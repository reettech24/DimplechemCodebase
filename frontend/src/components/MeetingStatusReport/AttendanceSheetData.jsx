import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AttendanceSheetData.css";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import ContentTop from "../ContentTop/ContentTop";
import {
  MeetingCheckInCheckOutReportData,
  fetchAllUsers,
} from "../../redux/userSlice";
import axios from "axios";
import { iconsImgs } from "../../utils/images";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const AttendanceSheetData = () => {
  const dispatch = useDispatch();

  const { meetingCinCotData, allusers, totalPages } = useSelector(
    (state) => state.user
  );

  //console.log("meetingCinCotData",meetingCinCotData, "totalPages", meetingCinCotData?.totalPages, "currentPage", meetingCinCotData?.currentPage);
  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(5);
  //-------- New Pagination Code End --------//
  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchEmp, setSearchEmp] = useState("");
  const [searchDay, setSearchDay] = useState("");
  const [workingTime, setWorkingTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = entriesPerPageNewData ? entriesPerPageNewData :5;

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
      MeetingCheckInCheckOutReportData({
        page: currentPage,
        limit: customersPerPage,
        search: searchTerm,
        // month: searchMonth,
        // emp_id: searchEmp,
        // day: searchDay,
      })
    );
    // fetchTotalWorkingHours({
    //   month: searchMonth,
    //   emp_id: searchEmp,
    //   day: searchDay,
    // });
  }, [dispatch, currentPage, searchTerm, entriesPerPageNewData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(
        `${API_URL}/auth/export-Meeting-Status-Report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            limit: customersPerPage,
            search: searchTerm,
          },
          responseType: "blob", // ✅ Important to keep it here
        }
      );

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Meeting_Report.xlsx"); // File name
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
    
     
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between newdatafewitem">
          <div className="newdatafewitem1">
            <h1 className="text-white text-[14px] font-semibold flex items-center">
              Meeting Status Report
            </h1>
          </div>

          <div className="flex flex-col items-start md:flex-row md:items-center gap-[10px] md:gap-[5px]">
            <div>
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {/* <div className="my-3 md:my-0">
              <span className="text-green-600 text-newtextdata whitespace-nowrap ">
                Total Time: {workingTime}
              </span>
            </div> */}
            <div className="flex flex-col items-start md:flex-row md:items-center gap-[10px] md:gap-[5px]">
              {/* <div className="flex items-center gap-[20px] md:gap-[5px]">
                <div>
                  <select
                    value={searchMonth}
                    onChange={(e) => setSearchMonth(e.target.value)}
                    className="w-full text-[16px] rounded border border-[#473b33] bg-[#1e1e2d] px-3 py-[0.15rem] text-white outline-none text-textdata"
                  >
                    <option className="text-newtextdata whitespace-nowrap" value="">
                      Select Month
                    </option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option
                        className="text-[16px]"
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
                    className="w-full text-[16px] rounded border border-[#473b33] bg-[#1e1e2d] px-3 py-[0.15rem] text-white outline-none text-textdata"
                  >
                    <option value="">Select Day</option>
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = (i + 1).toString().padStart(2, "0"); // Ensures "01" to "09"
                      return (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div> */}
              <div className="flex items-center gap-[20px] md:gap-[5px]">
                {/* <div>
                  <select
                    value={searchEmp}
                    onChange={(e) => setSearchEmp(e.target.value)}
                    className="w-full text-[16px] rounded border border-[#473b33] bg-[#1e1e2d] px-3 py-[0.15rem] text-white outline-none text-textdata"
                  >
                    <option value="">Select Employee</option>
                    {allusers?.data?.map((user, index) => (
                      <option key={index} value={user.id}>
                        {user.fullname}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div>
                  <button
                    className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.15rem]"
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
        </div>
        <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto mb-3">
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
            {/* {/------- Table Data Start -------/} */}
            <div className="overflow-x-auto custom-scrollbar max-h-[500px]"> 
              <table className="table-auto w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#473b33] rounded-[8px]">
                    <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap">
                      Id
                    </th>
                    <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap">
                      Customer
                    </th>
                    <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap">
                      Meeting Status
                    </th>
                    

                    {/* <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap">
                      CheckIn Time
                    </th>

                    <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap">
                      Checkout Time
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                      CheckIn Location
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                      Checkout Location
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {meetingCinCotData &&
                    meetingCinCotData?.data?.map((user, index) => (
                      <tr key={index + 1} className="">
                        <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {index +
                           1}
                        </td>
                        <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {/* {user?.fullname} */}
                          {user?.salesPerson?.fullname}
                        </td>
                        <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {/* {user?.fullname} */}
                          {user?.Customer?.company_name}
                        </td>
                        <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {new Date(user?.lead_date)?.toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {/* {user?.fullname} */}
                          {user?.lead_status?.split("->").pop()?.trim() || "-"}
                        </td>
                       
                        {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {user?.start_meeting_time}
                        </td>
                        <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {user?.end_meeting_time}
                        </td>
                        <td className="px-4 py-2 text-newtextdata text-left">
                          <div className="text-newtextdata whitespace-normal break-words max-w-[5Lead Analysis Graph00px]">
                            {user?.start_location}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-newtextdata text-left">
                          <div className="text-newtextdata whitespace-normal break-words max-w-[500px]">
                            {user?.end_location}
                          </div>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Scrollable Body */}
            {/* <div className="overflow-y-auto max-h-[420px]">
              <table className="table-auto w-full text-center border-collapse">
              
              </table>
            </div> */}
            {/* {/------- Table Data End -------/} */}
          </div>
        </div>
        <Pagination
          currentPage={meetingCinCotData?.currentPage}
          handlePageChange={handlePageChange}
          totalPages={meetingCinCotData?.totalPages}
        />
      </div>
    
  );
};

export default AttendanceSheetData;
