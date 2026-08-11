import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./OutTourExpenses.css";
import { iconsImgs } from "../../../utils/images";
import ContentTop from "../../ContentTop/ContentTop";
import Pagination from "./Pagination";
import axios from "axios";
import OutTourTable from "./OutTourTable";
import EditOutTour from "./EditOutTour";
import AddOutTour from "./AddOutTour";
import ViewOutTour from "./ViewOutTour";
import { fetchAllUsers } from "../../../redux/userSlice";
import { fetchCurrentUser } from "../../../redux/authSlice";
import {
  useAddOutTourMutation,
  useGetOutToursQuery,
  useGetOutTourByIdQuery,
  useDeleteOutTourMutation,
  useUpdateOutTourMutation,
} from "../../../redux/services/outTourApiService";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const OutTourExpenses = () => {
  const { hasPermission } = useUserPermissionCheck();
  const dispatch = useDispatch();

  const { user: userDetail } = useSelector((state) => state.auth);
  //console.log("userDetail",userDetail?.employeeRole?.role_id);

  const { allusers } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const [selectedOutTour, setSelectedOutTour] = useState({});
  const [isAddOutTouropen, setIsAddOutTourOpen] = useState(false);
  const [isViewOutTouropen, setIsViewOutTourOpen] = useState(false);
  const [isEditOutTouropen, setIsEditOutTourOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const outTourPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  const { data, error, isLoading, refetch } = useGetOutToursQuery({
    page: currentPage,
    limit: outTourPerPage,
    search: searchTerm,
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [addOutTour, { isSuccess, isError, error: baerror }] =
    useAddOutTourMutation();

  const [
    updateOutTour,
    { isSuccess: editisSuccess, isError: isIsError, error: editBaerror },
  ] = useUpdateOutTourMutation();

  const {
    data: outTourDataById,
    isLoading: getisLoading,
    isError: getisError,
    error: geterror,
  } = useGetOutTourByIdQuery(selectedOutTour?.id);

  const [deleteOutTour] = useDeleteOutTourMutation();

  const [formData, setFormData] = useState({
    employee_id: "",
    person_accompanied: "",
    place_of_visit: "",
    period_of_visit_from_date: "",
    period_of_visit_to_date: "",
    period_of_visit: "",
    prepared_by: "",
    approved_by: "",
    details: [{ date: "", place_of_visit: "", purpose: "" }],
    expenses: [{ description: "", amount: "" }],
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
    }, 1500);
  };

  // Calculate period_of_visit when dates change
  useEffect(() => {
    const { period_of_visit_from_date, period_of_visit_to_date } = formData;
    if (period_of_visit_from_date && period_of_visit_to_date) {
      const fromDate = new Date(period_of_visit_from_date);
      const toDate = new Date(period_of_visit_to_date);
      const diffInDays =
        Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      if (!isNaN(diffInDays) && diffInDays > 0) {
        setFormData((prev) => ({
          ...prev,
          period_of_visit: diffInDays,
        }));
      } else {
        // if invalid or fromDate > toDate, clear it
        setFormData((prev) => ({
          ...prev,
          period_of_visit: "",
        }));
      }
    } else {
      // if either date is empty, clear it
      setFormData((prev) => ({
        ...prev,
        period_of_visit: "",
      }));
    }
  }, [formData.period_of_visit_from_date, formData.period_of_visit_to_date]);

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Detail Row Change
  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;
    setFormData((prev) => ({ ...prev, details: newDetails }));
  };

  // Expense Row Change
  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...formData.expenses];
    newExpenses[index][field] = value;
    setFormData((prev) => ({ ...prev, expenses: newExpenses }));
  };

  // Validation
  const validateInputs = () => {
    let errors = {};

    if (!formData.employee_id) errors.employee_id = "*Employee is required";
    if (!formData.place_of_visit.trim())
      errors.place_of_visit = "*Place of Visit is required";
    if (!formData.period_of_visit_from_date)
      errors.period_of_visit_from_date =
        "*Period of Visit From Date is required";
    if (!formData.period_of_visit_to_date)
      errors.period_of_visit_to_date = "*Period of Visit To Date is required";
    if (!formData.person_accompanied)
      errors.person_accompanied = "*Person Accompanied is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmitAddOutTour = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await addOutTour(formData).unwrap();

        if (response?.success) {
          handleFlashMessage(response.message, "success");
          await refetch();
          setTimeout(() => {
            setIsAddOutTourOpen(false);
          }, 1000);

          // Reset form
          setFormData({
            employee_id: "",
            person_accompanied: "",
            place_of_visit: "",
            period_of_visit: "",
            details: [{ date: "", place_of_visit: "", purpose: "" }],
            expenses: [{ description: "", amount: "" }],
          });
        }
      } catch (error) {
        console.error("Error adding Out Tour:", error);
        handleFlashMessage(
          error?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };
  //end add form

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    employee_id: "",
    person_accompanied: "",
    place_of_visit: "",
    period_of_visit_from_date: "",
    period_of_visit_to_date: "",
    period_of_visit: "",
    prepared_by: "",
    approved_by: "",
    details: [{ date: "", place_of_visit: "", purpose: "" }],
    expenses: [{ description: "", amount: "" }],
  });

  const [editFormErrors, setEditFormErrors] = useState({});
  const [editFlashMessage, setEditFlashMessage] = useState("");
  const [editFlashMsgType, setEditFlashMsgType] = useState("");

  useEffect(() => {
    const { period_of_visit_from_date, period_of_visit_to_date } = editFormData;
    if (period_of_visit_from_date && period_of_visit_to_date) {
      const fromDate = new Date(period_of_visit_from_date);
      const toDate = new Date(period_of_visit_to_date);
      const diffInDays =
        Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      if (!isNaN(diffInDays) && diffInDays > 0) {
        setEditFormData((prev) => ({
          ...prev,
          period_of_visit: diffInDays,
        }));
      } else {
        // if invalid or fromDate > toDate, clear it
        setEditFormData((prev) => ({
          ...prev,
          period_of_visit: "",
        }));
      }
    } else {
      // if either date is empty, clear it
      setEditFormData((prev) => ({
        ...prev,
        period_of_visit: "",
      }));
    }
  }, [
    editFormData.period_of_visit_from_date,
    editFormData.period_of_visit_to_date,
  ]);

  // Prefill form when selectedOutTour changes
  useEffect(() => {
    if (selectedOutTour) {
      setEditFormData({
        employee_id: selectedOutTour?.employee_id || "",
        person_accompanied: selectedOutTour?.person_accompanied || "",
        place_of_visit: selectedOutTour?.place_of_visit || "",
        period_of_visit_from_date:
          selectedOutTour?.period_of_visit_from_date || "",
        period_of_visit_to_date: selectedOutTour?.period_of_visit_to_date || "",
        period_of_visit: selectedOutTour?.period_of_visit || "",
        prepared_by: selectedOutTour?.prepared_by || "",
        approved_by: selectedOutTour?.approved_by || "",
        details: selectedOutTour?.details || [
          { date: "", place_of_visit: "", purpose: "" },
        ],
        expenses: selectedOutTour?.expenses || [
          { description: "", amount: "" },
        ],
      });
    }
  }, [selectedOutTour?.id]);

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
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    setEditFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Detail row change handler
  const handleEditDetailChange = (index, field, value) => {
    const updatedDetails = [...editFormData.details];
    updatedDetails[index][field] = value;
    setEditFormData((prev) => ({ ...prev, details: updatedDetails }));
  };

  // Expense row change handler
  const handleEditExpenseChange = (index, field, value) => {
    const updatedExpenses = [...editFormData.expenses];
    updatedExpenses[index][field] = value;
    setEditFormData((prev) => ({ ...prev, expenses: updatedExpenses }));
  };

  // Validation
  const validateEditInputs = () => {
    let errors = {};
    if (!editFormData.employee_id) errors.employee_id = "*Employee is required";
    if (!editFormData.place_of_visit.trim())
      errors.place_of_visit = "*Place of Visit is required";
    if (!editFormData.period_of_visit_from_date)
      errors.period_of_visit_from_date =
        "*Period of Visit From Date is required";
    if (!editFormData.period_of_visit_to_date)
      errors.period_of_visit_to_date = "*Period of Visit To Date  is required";
    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleEditOutTourSubmit = async (e) => {
    e.preventDefault();

    if (validateEditInputs()) {
      try {
        const response = await updateOutTour({
          id: selectedOutTour?.id,
          updatedData: editFormData,
        }).unwrap();

        if (response.success) {
          handleEditFlashMessage(response.message, "success");
          await refetch();
          setTimeout(() => {
            setIsEditOutTourOpen(false);
          }, 1000);
        } else {
          handleEditFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error editing Out Tour:", error);
        handleEditFlashMessage(
          error?.data?.message || "An error occurred",
          "error"
        );
      }
    }
  };

  //delete functinality
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // Function to show flash messages for delete actions
  const handleDeleteFlashMessage = (message, type) => {
    setDeleteFlashMessage(message);
    setDeleteFlashMsgType(type);
    setTimeout(() => {
      setDeleteFlashMessage("");
      setDeleteFlashMsgType("");
    }, 1000); // Hide the message after 3 seconds
  };

  const handleDelete = async (id) => {
    try {
      await deleteOutTour(id).unwrap();
      handleDeleteFlashMessage("OutTour deleted successfully!", "success");
      await refetch();
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete task",
        "error"
      );
    }
  };
  //end delete functionality

  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/out-tours-export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: outTourPerPage,
          search: searchTerm,
        },
        responseType: "blob", // ✅ Important to keep it here
      });

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "out_tour_expensess_Report.xlsx"); // File name
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
              OutTour Management Expenses
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
              {hasPermission(13, 1) && (
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={() => setIsAddOutTourOpen(true)}
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add OutTour Expenses
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
            <OutTourTable
              setIsEditOutTourOpen={setIsEditOutTourOpen}
              setIsViewOutTourOpen={setIsViewOutTourOpen}
              outTourExpData={data?.data}
              selectedOutTour={selectedOutTour}
              setSelectedOutTour={setSelectedOutTour}
              handleDelete={handleDelete}
              deleteFlashMessage={deleteFlashMessage}
              deleteFlashMsgType={deleteFlashMsgType}
              empRole={userDetail?.employeeRole?.role_id}
            />
            {/*------- Table Data End -------*/}
          </div>
        </div>

        {/* Edit User Modal */}
        {isEditOutTouropen && (
          <EditOutTour
            setIsEditOutTourOpen={setIsEditOutTourOpen}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            editFormErrors={editFormErrors}
            setEditFormErrors={setEditFormErrors}
            editFlashMessage={editFlashMessage}
            editFlashMsgType={editFlashMsgType}
            handleEditFlashMessage={handleEditFlashMessage}
            handleEditChange={handleEditChange}
            handleEditDetailChange={handleEditDetailChange}
            handleEditExpenseChange={handleEditExpenseChange}
            validateEditInputs={validateEditInputs}
            handleEditOutTourSubmit={handleEditOutTourSubmit}
            allusers={allusers}
          />
        )}

        {/* View User Modal */}
        {isViewOutTouropen && (
          <ViewOutTour
            setIsViewOutTourOpen={setIsViewOutTourOpen}
            outTourDataById={outTourDataById?.data}
          />
        )}

        {/* Assign Customer Modal */}
        {isAddOutTouropen && (
          <AddOutTour
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            flashMessage={flashMessage}
            setFlashMessage={setFlashMessage}
            flashMsgType={flashMsgType}
            setFlashMsgType={setFlashMsgType}
            handleFlashMessage={handleFlashMessage}
            handleChange={handleChange}
            handleDetailChange={handleDetailChange}
            handleExpenseChange={handleExpenseChange}
            validateInputs={validateInputs}
            setIsAddOutTourOpen={setIsAddOutTourOpen}
            refetch={refetch}
            allusers={allusers}
            handleSubmitAddOutTour={handleSubmitAddOutTour}
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

export default OutTourExpenses;
