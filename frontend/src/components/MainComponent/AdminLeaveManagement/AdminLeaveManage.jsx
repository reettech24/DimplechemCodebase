import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AdminLeaveManage.css";
import { iconsImgs } from "../../../utils/images";
import ContentTop from "../../ContentTop/ContentTop";
import Pagination from "./Pagination";
import ViewUserModal from "./ViewUserModal";
import axios from "axios";
import PendingTableAdminLeave from "./PendingTableAdminLeave";
import ApprovedTableAdminLeave from "./ApprovedTableAdminLeave";
import CancelledTableAdminLeave from "./CancelledTableAdminLeave";
import {
  useGetAllLeaveRequestsQuery,
  useApplyLeaveMutation,
  useUpdateMultipleLeavesMutation,
  useApproveRejectLeaveMutation,
  useGetMyLeavesQuery,
  useDeleteLeaveMutation,
} from "../../../redux/services/leaveService";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLeaveManage = () => {
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState({});

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const leavePerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  {
    /*--------- Tab Code Start  ---------*/
  }
  const [activeTabLeaveAdmin, setActiveTabLeaveAdmin] = useState("pending");

  const { data, error, isLoading, refetch } = useGetAllLeaveRequestsQuery({
    page: currentPage,
    limit: leavePerPage,
    search: searchTerm,
    status: activeTabLeaveAdmin,
  });

  const [
    approveRejectLeave,
    { isSuccess: editisSuccess, isError: isIsError, error: editBaerror },
  ] = useApproveRejectLeaveMutation();

  // State for leave flash messages
  const [leaveFlashMessage, setLeaveFlashMessage] = useState("");
  const [leaveFlashMsgType, setLeaveFlashMsgType] = useState("");

  // Flash message handler
  const handleLeaveFlashMessage = (message, type) => {
    setLeaveFlashMessage(message);
    setLeaveFlashMsgType(type);

    setTimeout(() => {
      setLeaveFlashMessage("");
      setLeaveFlashMsgType("");
    }, 1000);
  };

  const updateLeaveStatus = async (leaveId, status) => {
    try {
      const response = await approveRejectLeave({
        id: leaveId,
        status,
      }).unwrap();

      if (response.success) {
        handleLeaveFlashMessage(
          response.message || `Leave ${status} successfully`,
          "success"
        );

        await refetch(); // Refresh the leave list

        // Optionally close modal or do something else
        setTimeout(() => {
          setIsLeaveModalOpen(false);
        }, 1000);
      } else {
        handleLeaveFlashMessage(
          response?.message || "Something went wrong",
          "error"
        );
      }
    } catch (error) {
      console.error(`Error updating leave status to ${status}:`, error);
      handleLeaveFlashMessage(
        error?.data?.message || "An error occurred",
        "error"
      );
    }
  };

  const tabLabels = {
    pending: "Request", // display label for "pending"
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Leave Management
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div className="md:mb-0 mb-2">
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              {/* <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={() => setIsApplyLeaveOpen(true)}
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Apply Leave
              </button> */}
            </div>
          </div>
        </div>
        <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*--------- Tab Code Start  ---------*/}
            <div className="flex gap-2 mb-4">
              {["pending", "approved", "rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabLeaveAdmin(tab)}
                  className={`px-4 py-2 capitalize font-medium text-[13px] rounded-md transition-all duration-200 ${
                    activeTabLeaveAdmin === tab
                      ? "border border-[#fe6c00] text-[#fe6c00] bg-[#1e1e1e]"
                      : "border border-white text-white hover:border-[#fe6c00] hover:text-[#fe6c00]"
                  }`}
                >
                  {/* {tab} */}
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
            {/*--------- Tab Code End  ---------*/}

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
            <PendingTableAdminLeave
              leaveData={data?.data}
              activeTabLeaveAdmin={activeTabLeaveAdmin}
              leaveFlashMessage={leaveFlashMessage}
              leaveFlashMsgType={leaveFlashMsgType}
              handleLeaveFlashMessage={handleLeaveFlashMessage}
              updateLeaveStatus={updateLeaveStatus}
              setSelectedLeave={setSelectedLeave}
              setViewModalOpen={setViewModalOpen}
            />

            {isViewModalOpen && (
              <ViewUserModal
                setViewModalOpen={setViewModalOpen}
                selectedLeave={selectedLeave}
              />
            )}
            {/* {activeTabLeaveAdmin === "request" && (
              <PendingTableAdminLeave leaveData={data?.data} activeTabLeaveAdmin={activeTabLeaveAdmin} />
            )}

            {activeTabLeaveAdmin === "approved" && (
              <ApprovedTableAdminLeave  />
            )}

            {activeTabLeaveAdmin === "cancelled" && (
              <CancelledTableAdminLeave />
            )} */}
            {/*------- Table Data End -------*/}
          </div>
        </div>

        {/* Pagination Controls with Number */}
        <Pagination
          currentPage={data?.currentPage}
          handlePageChange={handlePageChange}
          totalPages={data?.totalPages}
        />
      </div>
    </div>
  );
};

export default AdminLeaveManage;
