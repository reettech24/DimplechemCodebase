import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../MarketingManageData.css";
import "../../../../layout/MainCssFile.css";
import { iconsImgs } from "../../../../utils/images";
import DepartmentTable from "./DepartmentTable";
import Pagination from "./Pagination";
import AddRoleModal from "./AddRoleModal";
import EmpSARReport from "./EmpSARReport";
// import ViewUserModal from "./ViewUserModal";
// import EditUserModal from "./EditUserModal";
import ContentTop from "../../../ContentTop/ContentTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import {
  finalizeDealsList,
} from "../../../../redux/leadSlice";

const SalePOForm = () => {
   const dispatch = useDispatch();
    const { finalizeDealsListData, totalPages, departmentloading, departmenterror } = useSelector(
      (state) => state.lead
    );
 
  console.log("finalizeDealsListData", finalizeDealsListData);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);

  const [showFinlizeDealProduct, setShowFinlizeDealProduct] = useState(false);
  const [selectedLead, setSelectedLead] = useState({});


   //-------- New Pagination Code Start --------//
    const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
    //-------- New Pagination Code End --------//

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const leadPerPage =  entriesPerPageNewData? entriesPerPageNewData : 20;

   useEffect(() => {
      dispatch(
        finalizeDealsList({
          page: currentPage,
          limit: leadPerPage,
          search: searchTerm,
        })
      );
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

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:justify-between">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Sales PO Form
            </h1>
          </div>
          <div className="flex items-center gap-[10px] md:gap-[5px]">
            <div>
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <button
                className="flex items-center text-[10px] md:text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.48rem] md:py-[0.28rem]"
                onClick={() => setAddUserModalOpen(true)}
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Add PO Form
              </button>
            </div>
          </div>
        </div>
        <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto mb-2">
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
            <DepartmentTable
              setEditUserModalOpen={setEditUserModalOpen}
              finalizeDealsListData={finalizeDealsListData?.data || []}
              setViewModalOpen={setViewModalOpen}
              setSelectedLead={setSelectedLead}
              setShowFinlizeDealProduct={setShowFinlizeDealProduct}
            />
            {/*------- Table Data End -------*/}
          </div>

          {/* Add User Modal */}
          {isAddUserModalOpen && (
            <AddRoleModal setAddUserModalOpen={setAddUserModalOpen} />
          )}

          {/* Edit User Modal */}
          {/* {isEditUserModalOpen && (
          <EditUserModal setEditUserModalOpen={setEditUserModalOpen} />
        )} */}

          {/* View User Modal */}
          {/* {isViewModalOpen && (
          <ViewUserModal setViewModalOpen={setViewModalOpen} />
        )} */}

          {showFinlizeDealProduct && (
            <EmpSARReport
            setShowFinlizeDealProduct={setShowFinlizeDealProduct}
            selectedLead ={selectedLead}
            setSelectedLead = {setSelectedLead}
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
      
    </div>
  );
};

export default SalePOForm;