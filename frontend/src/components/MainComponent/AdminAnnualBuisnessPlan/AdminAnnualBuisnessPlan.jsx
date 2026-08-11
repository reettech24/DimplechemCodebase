import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentTop from "../../ContentTop/ContentTop";
import AdminListTableReport from "./AdminListTableReport";
import AdminViewAnnualReport  from "./AdminViewAnnualReport";
import Pagination from "./Pagination";
import {
  getAnnualBusinessPlan
} from "../../../redux/userSlice";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");


const AdminAnnualBuisnessPlan = () => {

  const dispatch = useDispatch();
  const { anualbsplanReportdata, totalPages, userLoading, userError } = useSelector((state) => state.user);
  
  const [isViewReportOpen, setIsViewReportOpen] = useState(false);
  const [abpbyempid, setabpbyempid] = useState([]);
  const [abpproductbyid , setabpproductbyid] = useState([]);

  //-------- New Pagination Code Start --------//
    const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
    //-------- New Pagination Code End --------//
  
    // Pagination & Search States
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const abpPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

     useEffect(() => {
        dispatch(
          getAnnualBusinessPlan({
            page: currentPage,
            limit: abpPerPage,
            search: searchTerm
          })
        );
        
      }, [
        dispatch,
        currentPage,
        searchTerm,
        abpPerPage,
        entriesPerPageNewData
      ]);

   // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

 const getAnnualBusinessPlanByEmpId = async (empId = "", monthValue = "") => {
  //console.log("function calling",empId)
 
  try {
    setabpbyempid([]);
    setabpproductbyid([]);
    const token = getAuthToken();

    // Build query params if monthValue exists
    const queryParams = monthValue ? `?monthValue=${monthValue}` : "";

    const response = await axios.get(
      `${API_URL}/auth/getAnnualBusinessPlanById/${empId}${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("getAnnualBusinessPlanByEmpId", response.data);
    setabpbyempid(response?.data);
    return response.data.data; // assuming your API responds with { data: [...] }
  } catch (error) {
    console.error("Failed to fetch ABP for emp:", error);
    return [];
  }
};


  
  const getProductsByBusinessPlanId = async(Id)=>{
       try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/auth/getProductsByBusinessPlanId/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log("RESULT12",  response.data);
      setabpproductbyid(response?.data?.data);
      return response.data.data; // assuming your API responds with { data: [...] }
    } catch (error) {
      console.error("Failed to fetch poafor emp:", error);
      return [];
    }
  }

   //export customer data in excel file
    const handleExportData = async () => {
      try {
        // ✅ Get token
        const token = getAuthToken();
  
        // ✅ Correct API call with query parameters
        const response = await axios.get(`${API_URL}/auth/export-buisness-plan-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchTerm,
          },
          responseType: "blob", // ✅ Important to keep it here
        });
  
        // ✅ Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // ✅ Create a temporary <a> tag to download the file
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Annual_Businessplan_Report.xlsx"); // File name
        document.body.appendChild(link);
        link.click();
  
        // ✅ Cleanup after download
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error exporting data:", error);
      }
    };
    //end export customer data in excel file

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Consolidated Business Plan of Organisation Format
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
            {/* <div className="md:mb-0 mb-2">
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
              />
            </div>
              <div>
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add New Report
                </button>
              </div> */}
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
                  onChange={(e) =>{
                    setEntriesPerPageNewData(Number(e.target.value));
                  }
                  }
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
            <AdminListTableReport 
             ABPdata = {anualbsplanReportdata?.data}
             anualbsplanReportdata={anualbsplanReportdata}
             setIsViewReportOpen={setIsViewReportOpen}
             getAnnualBusinessPlanByEmpId={getAnnualBusinessPlanByEmpId}/>
            {/*-------- Table Data End --------*/}
          </div>
        </div>

        {/* View User Modal */}
        {isViewReportOpen && (
          <AdminViewAnnualReport
            setIsViewReportOpen={setIsViewReportOpen}
            abpbyempid={abpbyempid}
            getProductsByBusinessPlanId={getProductsByBusinessPlanId}
            abpproductbyid={abpproductbyid}
            getAnnualBusinessPlanByEmpId={getAnnualBusinessPlanByEmpId}
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

export default AdminAnnualBuisnessPlan;
