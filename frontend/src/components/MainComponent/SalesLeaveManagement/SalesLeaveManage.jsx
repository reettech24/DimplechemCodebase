import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SalesLeaveManage.css";
import { iconsImgs } from "../../../utils/images";
import ContentTop from "../../ContentTop/ContentTop";
import Pagination from "./Pagination";
import ViewUserModal from "./ViewUserModal";
import axios from "axios";
import PendingTableSalesLeave from "./PendingTableSalesLeave";
// import EditTaskShedule from "./EditTaskShedule";
import AddSalesLeave from "./AddSalesLeave";
import ApprovedTableSalesLeave from "./ApprovedTableSalesLeave";
import CancelledTableSalesLeave from "./CancelledTableSalesLeave";
import {
  useGetAllLeaveRequestsQuery,
  useApplyLeaveMutation,
  useUpdateMultipleLeavesMutation,
  useApproveRejectLeaveMutation,
  useGetMyLeavesQuery,
  useDeleteLeaveMutation,
} from "../../../redux/services/leaveService";

const API_URL = import.meta.env.VITE_API_URL;

const SalesLeaveManage = () => {
  const [selectedLeave, setSelectedLeave] = useState({});
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isViewtaskopen, setIsViewTaskOpen] = useState(false);
  const [isEdittaskopen, setIsEditTaskOpen] = useState(true);


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
  const [activeTabLeave, setActiveTabLeave] = useState("pending");

   const { data, error, isLoading, refetch } = useGetMyLeavesQuery({
      page: currentPage,
      limit: leavePerPage,
      search: searchTerm,
      status: activeTabLeave
    });

  const [applyLeave, { isSuccess, isError, error: baerror }] =
    useApplyLeaveMutation();

  //apply leave form
  // State for leave form
  const [formData, setFormData] = useState({
    leave_type: "",
    from_date: "",
    to_date: "",
    reason: "",
    leave_duration: "",
    documents: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  // Flash message handler
  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 1000);
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear error when user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };


  const handleMultipleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    setFormData((prevState) => ({
      ...prevState,
      documents: files, // Store multiple selected files
    }));
  };

  console.log("formData",formData);

  // Validation function
  const validateInputs = () => {
    let errors = {};

    if (!formData.leave_type) errors.leave_type = "*Leave type is required";
    if (!formData.from_date) errors.from_date = "*From date is required";
    if (!formData.to_date) errors.to_date = "*To date is required";
    if (!formData.reason.trim()) errors.reason = "*Reason is required";
    if (!formData.leave_duration)
      errors.leave_duration = "*Leave duration is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmitLeave = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await applyLeave(formData).unwrap(); // from your leaveApi

        //console.log("response",response);

        if (response?.success) {
          handleFlashMessage(response?.message, "success");

          await refetch(); // refresh data list

          setTimeout(() => {
            setIsApplyLeaveOpen(false); // close modal after 1 sec
          }, 1000);

          // Reset form
          setFormData({
            leave_type: "", 
            from_date: "",
            to_date: "",
            reason: "",
            leave_duration: "",
          });
        }
      } catch (error) {
        console.error("Error applying leave:", error);
        const errors = error?.data?.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          handleFlashMessage(errors.join("\n"), "error");
        } else {
          handleFlashMessage(
            error?.data?.message || "Something went wrong",
            "error"
          );
        }
      }
    }
  };

  //end apply leave form


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
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={() => setIsApplyLeaveOpen(true)}
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Apply Leave
              </button>
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
                  onClick={() => setActiveTabLeave(tab)}
                  className={`px-4 py-2 capitalize font-medium text-[13px] rounded-md transition-all duration-200 ${
                    activeTabLeave === tab
                      ? "border border-[#fe6c00] text-[#fe6c00] bg-[#1e1e1e]"
                      : "border border-white text-white hover:border-[#fe6c00] hover:text-[#fe6c00]"
                  }`}
                >
                  {tab}
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
                  <select className="appearance-none cursor-pointer h-8 pr-8 pl-5 rounded-r-[5px] bg-[#3d3d57] text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                   value={entriesPerPageNewData}
                    onChange={(e) => {
                      setEntriesPerPageNewData(Number(e.target.value));
                    }}>
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
            <PendingTableSalesLeave leavedata={data?.data} activeTabLeave={activeTabLeave}  setSelectedLeave={setSelectedLeave}
              setViewModalOpen={setViewModalOpen}/>

            {/* {activeTabLeave === "pending" && <PendingTableSalesLeave leavedata={data?.data} />}

            {activeTabLeave === "approved" && <ApprovedTableSalesLeave />}

            {activeTabLeave === "rejected" && <CancelledTableSalesLeave />} */}
            {/*------- Table Data End -------*/}
          </div>
        </div>

        {/* Edit User Modal */}
        {/* {isEdittaskopen && (
          <EditTaskShedule setIsEditTaskOpen={setIsEditTaskOpen} />
        )} */}

        {/* View User Modal */}
        {/* {isViewtaskopen && (
          <ViewTaskShedule setIsViewTaskOpen={setIsViewTaskOpen} />
        )} */}

        {/* Assign Customer Modal */}
        {isApplyLeaveOpen && (
          <AddSalesLeave
            setIsApplyLeaveOpen={setIsApplyLeaveOpen}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            flashMessage={flashMessage}
            setFlashMessage={setFlashMessage}
            flashMsgType={flashMsgType}
            setFlashMsgType={setFlashMsgType}
            handleChange={handleChange}
            handleSubmitLeave={handleSubmitLeave}
            handleMultipleFileChange={handleMultipleFileChange}
          />
        )}

         {isViewModalOpen && (
                      <ViewUserModal
                        setViewModalOpen={setViewModalOpen}
                        selectedLeave={selectedLeave}
                      />
                    )}
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

export default SalesLeaveManage;
