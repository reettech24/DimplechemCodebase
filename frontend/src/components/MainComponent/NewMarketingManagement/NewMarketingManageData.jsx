import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./NewMarketingManageData.css";
import { iconsImgs } from "../../../utils/images";
import ContentTop from "../../ContentTop/ContentTop";
import Pagination from "./Pagination";
import axios from "axios";
import MarketingTable from "./MarketingTable";
import EditMarketing from "./EditMarketing";
import AddMarketing from "./AddMarketing";
import ViewMarketing from "./ViewMarketing";
import { fetchCurrentUser } from "../../../redux/authSlice";
import { fetchAllUsers } from "../../../redux/userSlice";

import {
  useGetMarketingQuery,
  useAddMarketingMutation,
  useEditMarketingMutation,
  useDeleteMarketingMutation,
  useGetMarketingByIdQuery,
  useLazyGetMarketingByIdQuery,
  useGetMyMarketingQuery,
} from "../../../redux/services/marketingApi";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const NewMarketingManageData = () => {
  const { hasPermission } = useUserPermissionCheck();

  const dispatch = useDispatch();
  const { allusers } = useSelector((state) => state.user);

  // Redux thunk dispatch for employee list

  const [selectedMarketing, setSelectedMarketing] = useState({});
  const [isAddMarketing, setIsAddMarketing] = useState(false);
  const [isViewMarketing, setIsViewMarketing] = useState(false);
  const [isEditMarketing, setIsEditMarketing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [isAddMarketing, isEditMarketing]);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const taskPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;
  // RTK Query
  const { data, error, isLoading, refetch } = useGetMarketingQuery({
    page: currentPage,
    limit: taskPerPage,
    search: searchTerm,
  });

  const [addMarketing, { isSuccess, isError, error: baerror }] =
    useAddMarketingMutation();

  const [
    editMarketing,
    { isSuccess: editisSuccess, isError: isIsError, error: editBaerror },
  ] = useEditMarketingMutation();

  const [
    getMarketingById,
    {
      data: marketingData,
      isSuccess: viewisSuccess,
      isError: viewIsError,
      error: viewerror,
    },
  ] = useLazyGetMarketingByIdQuery();

  const [deleteMarketing] = useDeleteMarketingMutation();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //add marketing functionality
  const [formData, setFormData] = useState({
    activity_planned: "",
    activity_date: "",
    complete_date: "",
    total_spent: "",
    lead_generated: "",
    assigned_to: "",
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

    // Clear error as user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Input validation
  const validateInputs = () => {
    let errors = {};

    if (!formData.activity_planned.trim())
      errors.activity_planned = "*Activity Planned is required";

    if (!formData.activity_date)
      errors.activity_date = "*Activity Date is required";

    if (!formData.complete_date)
      errors.complete_date = "*Complete Date is required";

    if (!formData.total_spent.trim())
      errors.total_spent = "*Total Spent is required";

    if (!formData.lead_generated.trim())
      errors.lead_generated = "*Lead Generated is required";

    if (!formData.assigned_to)
      errors.assigned_to = "*Please assign this activity";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submit handler
  const handleSubmitAddMarketing = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await addMarketing(formData).unwrap();

        if (response?.success) {
          handleFlashMessage(response?.message, "success");

          await refetch();

          setTimeout(() => {
            setIsAddMarketing(false);
          }, 1000);

          setFormData({
            activity_planned: "",
            activity_date: "",
            complete_date: "",
            total_spent: "",
            lead_generated: "",
            assigned_to: "",
          });
        }
      } catch (error) {
        console.error("Error adding marketing activity:", error);
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

  //edit marketing functionality
  const [editFormData, setEditFormData] = useState({
    activity_planned: "",
    activity_date: "",
    complete_date: "",
    total_spent: "",
    lead_generated: "",
    assigned_to: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({});
  const [editFlashMessage, setEditFlashMessage] = useState("");
  const [editFlashMsgType, setEditFlashMsgType] = useState("");

  // Prefill edit form when setSelectedMarketing changes
  useEffect(() => {
    if (selectedMarketing) {
      setEditFormData({
        activity_planned: selectedMarketing?.activity_planned || "",
        activity_date: selectedMarketing?.activity_date || "",
        complete_date: selectedMarketing?.complete_date || "",
        total_spent: selectedMarketing?.total_spent || "",
        lead_generated: selectedMarketing?.lead_generated || "",
        assigned_to: selectedMarketing?.assigned_to || "",
      });
    }
  }, [selectedMarketing?.id]);

  // Flash message handler
  const handleEditFlashMessage = (message, type) => {
    setEditFlashMessage(message);
    setEditFlashMsgType(type);
    setTimeout(() => {
      setEditFlashMessage("");
      setEditFlashMsgType("");
    }, 1000);
  };

  // OnChange handler
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    setEditFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Validation
  const validateEditInputs = () => {
    let errors = {};

    if (!editFormData.activity_planned.trim())
      errors.activity_planned = "*Activity planned is required";
    if (!editFormData.activity_date)
      errors.activity_date = "*Activity date is required";
    if (!editFormData.complete_date)
      errors.complete_date = "*Complete date is required";
    if (!editFormData.total_spent)
      errors.total_spent = "*Total spent is required";
    if (!editFormData.lead_generated.trim())
      errors.lead_generated = "*Lead generated is required";
    if (!editFormData.assigned_to)
      errors.assigned_to = "*Assigned to is required";

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (validateEditInputs()) {
      try {
        const response = await editMarketing({
          id: selectedMarketing?.id,
          updatedData: editFormData,
        }).unwrap();

        if (response.success) {
          handleEditFlashMessage(response.message, "success");
          await refetch();
          setTimeout(() => {
            setIsEditMarketing(false);
          }, 1000);
        } else {
          handleEditFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error editing marketing activity:", error);
        handleEditFlashMessage(
          error?.data?.message || "An error occurred",
          "error"
        );
      }
    }
  };

  //end

  //delete marketing
  // delete functionality
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // Flash message for delete actions
  const handleDeleteFlashMessage = (message, type) => {
    setDeleteFlashMessage(message);
    setDeleteFlashMsgType(type);
    setTimeout(() => {
      setDeleteFlashMessage("");
      setDeleteFlashMsgType("");
    }, 1000);
  };

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteMarketing(id).unwrap(); // <-- assuming you have this mutation from your marketingApi
      handleDeleteFlashMessage(
        "Marketing activity deleted successfully!",
        "success"
      );
      await refetch(); // if using useGetMarketingActivitiesQuery
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete marketing activity",
        "error"
      );
    }
  };

  //end

  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(
        `${API_URL}/auth/exportMarketingToExcel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
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
      link.setAttribute("download", "Marketing_Report.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Marketing Management
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
              {hasPermission(5, 1) && (
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={() => setIsAddMarketing(true)}
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add Data
                </button>
              )}
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
        <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
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
            <MarketingTable
              setIsEditMarketing={setIsEditMarketing}
              setIsViewMarketing={setIsViewMarketing}
              selectedMarketing
              mktData={data?.data}
              setSelectedMarketing={setSelectedMarketing}
              handleDelete={handleDelete}
              deleteFlashMessage={deleteFlashMessage}
              deleteFlashMsgType={deleteFlashMsgType}
              getMarketingById={getMarketingById}
            />
            {/*------- Table Data End -------*/}
          </div>
        </div>

        {/* Edit User Modal */}
        {isEditMarketing && (
          <EditMarketing
            setIsEditMarketing={setIsEditMarketing}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            editFormErrors={editFormErrors}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
            editFlashMessage={editFlashMessage}
            editFlashMsgType={editFlashMsgType}
            employeeList={allusers?.data}
            selectedMarketing={selectedMarketing}
          />
        )}

        {/* View User Modal */}
        {isViewMarketing && (
          <ViewMarketing
            setIsViewMarketing={setIsViewMarketing}
            marketingData={marketingData?.data}
          />
        )}

        {/* Assign Customer Modal */}
        {isAddMarketing && (
          <AddMarketing
            setIsAddMarketing={setIsAddMarketing}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleChange={handleChange}
            handleSubmitAddMarketing={handleSubmitAddMarketing}
            flashMessage={flashMessage}
            flashMsgType={flashMsgType}
            employeeList={allusers?.data}
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

export default NewMarketingManageData;
