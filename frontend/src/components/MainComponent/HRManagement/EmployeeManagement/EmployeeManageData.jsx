import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./EmployeeManageData.css";
import { iconsImgs } from "../../../../utils/images";
import EmployeeTable from "./EmployeeTable";
import Pagination from "./Pagination";
import AddEmployeeModal from "./AddEmployeeModal";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import {
  listUsers,
  addUser,
  removeUser,
  updateUser,
} from "../../../../redux/userSlice";
import { fetchCurrentUser } from "../../../../redux/authSlice";
import { useUserPermissionCheck } from "../../../hooks/useUserPermissionCheck";

import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const EmployeeManageData = () => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();
  const dispatch = useDispatch();
  const { users, totalPages, userLoading, userError } = useSelector(
    (state) => state.user
  );

  const { user: userDeatail } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  //console.log("users", users);

  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [isAddEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeePerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  // Fetch departments whenever searchTerm or currentPage changes
  useEffect(() => {
    dispatch(
      listUsers({
        page: currentPage,
        limit: employeePerPage,
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

  //Add employee functions
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    // User Table Fields
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    emergency_contact: "",
    date_of_birth: "",
    //gender: "",
    //profile_image: "",
    fullname: "",
    address: "",
    //status: "",
    aadhar_no: "",
    pan_no: "",
    //remarks: "",
    //digital_signature: "",

    // Employee Roles Table Fields
    role_id: "",

    // Job Details Table Fields
    //department_id: "",
    //job_title: "",
    employment_type: "",
    date_of_joining: "",
    //currently_working: "",
    //salary: "",
    work_location: "",
    reporting_manager_id: "",
    //offer_letter_date: "",
    //date_of_exit: "",

    // Bank Details Table Fields
    //bank_name: "",
    //account_number: "",
    //ifsc_code: "",
    //branch_name: "",
    //account_type: "",

    // Documents Table Fields
    documents: [],
  });

  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  // handle flash messages show

  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 3000);
  };

  const formatAadhaar = (value) => {
    const digits = value.replace(/\D/g, "").substring(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "aadhar_no") {
      newValue = formatAadhaar(value);
    }

    if (name === "pan_no") {
      newValue = value.toUpperCase();
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));

    // Clear error when user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profile_image: file, // Store the file object
        profile_image_preview: URL.createObjectURL(file), // For preview
      }));

      // Clear validation error for profile_image
      setFormErrors((prevErrors) => ({ ...prevErrors, profile_image: "" }));
    }
  };

  //multiple document upload
  const handleMultipleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    setFormData((prevState) => ({
      ...prevState,
      documents: files, // Store multiple selected files
    }));
  };

  //--------- Signature Data ----------//
  const sigauditCanvas = useRef(null);
  const [isSignatureauditEmpty, setIsSignatureauditEmpty] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Function to clear the signature
  const clearauditSignature = () => {
    sigauditCanvas.current.clear();
    setIsSignatureauditEmpty(true);
  };

  const saveauditSignature = () => {
    const originalCanvas = sigauditCanvas.current.getTrimmedCanvas();

    // Set the willReadFrequently attribute before any read operation
    const ctx = originalCanvas.getContext("2d");
    ctx.willReadFrequently = true; // Enable this flag to optimize read operations

    const resizeWidth = 300;
    const aspectRatio = originalCanvas.height / originalCanvas.width;
    const resizeHeight = resizeWidth * aspectRatio;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = resizeWidth;
    tempCanvas.height = resizeHeight;

    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(originalCanvas, 0, 0, resizeWidth, resizeHeight);

    const resizedDataUrl = tempCanvas.toDataURL("image/png");

    setFormData((prevData) => ({
      ...prevData,
      digital_signature: resizedDataUrl,
    }));

    alert("Saved Signature");
  };

  const validateInputs = () => {
    let errors = {};

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;

    //if (currentStep === 1) {
    // ✅ Required fields validation (only necessary fields)
    if (!formData.fullname.trim()) {
      errors.fullname = "*Full name is required";
    }
    if (!formData.username.trim()) {
      errors.username = "*Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "*Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      errors.username = "*Username cannot be more than 20 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "*Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "*Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "*Phone number is required";
    } else if (!/^\d{10,12}$/.test(formData.phone)) {
      errors.phone = "*Phone number must be between 10 to 12 digits";
    }
    // Password validation
    if (!formData.password.trim()) {
      errors.password = "*Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "*Password must be at least 6 characters";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        "*Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character";
    }

    // Confirm Password validation
    if (!formData.confirm_password.trim()) {
      errors.confirm_password = "*Confirm Password is required";
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "*Passwords do not match";
    }

    if (
      formData.aadhar_no.trim() &&
      !/^\d{12}$/.test(formData.aadhar_no.replace(/\s/g, ""))
    ) {
      errors.aadhar_no = "*Aadhaar number must be exactly 12 digits";
    }

    if (
      formData.pan_no.trim() &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_no.toUpperCase())
    ) {
      errors.pan_no = "*Invalid PAN number (Format: ABCDE1234F)";
    }
    // if (!formData.gender.trim()) {
    //   errors.gender = "*Gender is required";
    // }
    // if (!formData.status.trim()) {
    //   errors.status = "*Status is required";
    // }
    // if (!formData.role_id.trim()) {
    //   errors.role_id = "*Role is required";
    // }
    // if (!formData.profile_image) {
    //   errors.profile_image = "Profile picture is required.";
    // } else if (!formData.profile_image.type.startsWith("image/")) {
    //   errors.profile_image = "Only image files are allowed.";
    // }
    // if (!formData.pan_no.trim()) {
    //   errors.pan_no = "*Pan Card is required";
    // }
    // if (!formData.aadhar_no.trim()) {
    //   errors.aadhar_no = "*Aadhar Card is required";
    // }
    // if (!formData.date_of_birth.trim()) {
    //   errors.date_of_birth = "*DOB is required";
    // }
    if (!formData.address.trim()) {
      errors.address = "*Address is required";
    }
    //}
    //if (currentStep === 2) {
    // ✅ Required fields validation (only necessary fields)

    // if (!formData.department_id.trim()) {
    //   errors.department_id = "*Department is required";
    // }

    // if (!formData.job_title.trim()) {
    //   errors.job_title = "*Job title is required";
    // }
    if (!formData.employment_type.trim()) {
      errors.employment_type = "*Employment type is required";
    }
    if (!formData.date_of_joining.trim()) {
      errors.date_of_joining = "*Date of joining is required";
    }
    // if (!formData.salary.trim()) {
    //   errors.salary = "*Salary is required";
    // }
    if (!formData.work_location.trim()) {
      errors.work_location = "*Work location is required";
    }

    // if (!formData.offer_letter_date.trim()) {
    //   errors.offer_letter_date = "*offer letter is required";
    // }
    // if (!formData.date_of_exit.trim()) {
    //   errors.date_of_exit = "*Exit Date is required";
    // }
    if (!formData.reporting_manager_id) {
      errors.reporting_manager_id = "*Reporting Manager is required";
    }
    // if (!formData.remarks.trim()) {
    //   errors.remarks = "*Summary is required";
    // }
    //}
    // if (currentStep === 3) {
    // ✅ Required fields validation (only necessary fields)

    // if (!formData.bank_name.trim()) {
    //   errors.bank_name = "*Bank name is required";
    // }
    // if (!formData.account_number.trim()) {
    //   errors.account_number = "*Account number is required";
    // }
    // if (!formData.ifsc_code.trim()) {
    //   errors.ifsc_code = "*IFSC code is required";
    // }
    // if (!formData.account_type.trim()) {
    //   errors.account_type = "*Account type is required";
    // }
    // if (!formData.branch_name.trim()) {
    //   errors.branch_name = "*Branch Name is required";
    // }
    //}
    // ✅ Update state and return validation result
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateInputs(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    //console.log("this function is calling");
    e.preventDefault();
    if (validateInputs()) {
      try {
        //console.log("formData", formData);
        const response = await dispatch(addUser(formData)).unwrap();
        //console.log("response", response.success); // Debugging response

        if (response?.success == true) {
          handleFlashMessage(response?.message, "success");
          dispatch(
            listUsers({
              page: currentPage,
              limit: employeePerPage,
              search: searchTerm,
            })
          );

          setFormData({});

          setTimeout(() => {
            setAddEmployeeModalOpen(false);
          }, 1000);
        } else {
          handleFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }

        //setAddUserModalOpen(false);
      } catch (error) {
        console.log(error.errors[0]?.message);
        console.error("Error adding employee:", error);
        handleFlashMessage(
          error.errors[0]?.message || "An error occurred",
          "error"
        ); // Use error.message
      }
    }
  };
  //end employee functions

  //delete employee
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // Function to show delete-specific flash messages
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
      await dispatch(removeUser(id)).unwrap();
      handleDeleteFlashMessage("Employee deleted successfully!", "success");
      dispatch(
        listUsers({
          page: currentPage,
          limit: employeePerPage,
          search: searchTerm,
        })
      );
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete employee",
        "error"
      );
    }
  };

  //end delete employee

  const [currentUpdateStep, setCurrentUpdateStep] = useState(1);

  //update employee code
  const [updateFormData, setUpdateFormData] = useState({
    // User Table Fields
    //username: "",
    email: "",
    //password: "",
    //confirm_password: "",
    phone: "",
    emergency_contact: "",
    date_of_birth: "",
    //gender: "",
    //profile_image: "",
    fullname: "",
    address: "",
    //status: "",
    aadhar_no: "",
    pan_no: "",
    //remarks: "",
    //digital_signature: "",

    // Employee Roles Table Fields
    role_id: "",

    // Job Details Table Fields
    //department_id: "",
    //job_title: "",
    employment_type: "",
    date_of_joining: "",
    //currently_working: "",
    //salary: "",
    work_location: "",
    reporting_manager_id: "",
    //offer_letter_date: "",
    date_of_exit: "",

    // Bank Details Table Fields
    // bank_name: "",
    // account_number: "",
    // ifsc_code: "",
    // branch_name: "",
    // account_type: "",

    // Documents Table Fields
    documents: [],
  });

  const [updateFormErrors, setUpdateFormErrors] = useState({});
  const [updateFlashMessage, setUpdateFlashMessage] = useState("");
  const [updateFlashMsgType, setUpdateFlashMsgType] = useState("");

  useEffect(() => {
    if (selectedEmployee) {
      setUpdateFormData({
        //username: selectedEmployee.username || "",
        email: selectedEmployee.email || "",
        //password: "",
        //confirm_password: "",
        phone: selectedEmployee.phone || "",
        emergency_contact: selectedEmployee.emergency_contact || "",
        date_of_birth: selectedEmployee.date_of_birth
          ? selectedEmployee.date_of_birth.split("T")[0]
          : "",
        // gender: selectedEmployee.gender || "",
        // profile_image: selectedEmployee.profile_image || "",
        fullname: selectedEmployee.fullname || "",
        address: selectedEmployee.address || "",
        //status: selectedEmployee.status || "",
        aadhar_no: selectedEmployee.aadhar_no || "",
        pan_no: selectedEmployee.pan_no || "",
        //remarks: selectedEmployee.remarks || "",
        //digital_signature: selectedEmployee.digital_signature || "",
        role_id: selectedEmployee?.employeeRole?.role_id || "",
        //department_id: selectedEmployee?.jobDetail?.department_id || "",
        //job_title: selectedEmployee?.jobDetail?.job_title || "",
        employment_type: selectedEmployee?.jobDetail?.employment_type || "",
        date_of_joining: selectedEmployee?.jobDetail?.date_of_joining
          ? selectedEmployee?.jobDetail?.date_of_joining.split("T")[0]
          : "",
        // currently_working:
        //   selectedEmployee?.jobDetail?.currently_working || false,
        //salary: selectedEmployee?.jobDetail?.salary || "",
        work_location: selectedEmployee?.jobDetail?.work_location || "",
        reporting_manager_id:
          selectedEmployee?.jobDetail?.reporting_manager_id || "",
        // offer_letter_date: selectedEmployee?.jobDetail?.offer_letter_date
        //   ? selectedEmployee?.jobDetail?.offer_letter_date.split("T")[0]
        //   : "",
        date_of_exit: selectedEmployee?.jobDetail?.date_of_exit,
        //   ? selectedEmployee?.jobDetail?.date_of_exit.split("T")[0]
        //   : "",
        // bank_name: selectedEmployee?.bankDetail?.bank_name || "",
        // account_number: selectedEmployee?.bankDetail?.account_number || "",
        // ifsc_code: selectedEmployee?.bankDetail?.ifsc_code || "",
        // branch_name: selectedEmployee?.bankDetail?.branch_name || "",
        // account_type: selectedEmployee?.bankDetail?.account_type || "",
        documents: selectedEmployee?.documents || [],
      });
    }
  }, [selectedEmployee]);

  const handleUpdateFlashMessage = (message, type) => {
    setUpdateFlashMessage(message);
    setUpdateFlashMsgType(type);
    setTimeout(() => {
      setUpdateFlashMessage("");
      setUpdateFlashMsgType("");
    }, 1000);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "aadhar_no") {
      newValue = formatAadhaar(value);
    }

    if (name === "pan_no") {
      newValue = value.toUpperCase();
    }

    setUpdateFormData((prevData) => ({ ...prevData, [name]: newValue }));

    // Clear error when user types
    setUpdateFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleUpdateFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateFormData((prevData) => ({
        ...prevData,
        profile_image: file,
        profile_image_preview: URL.createObjectURL(file), // For preview
      }));

      // Clear validation error for profile_image
      setUpdateFormErrors((prevErrors) => ({
        ...prevErrors,
        profile_image: "",
      }));
    }
  };

  // Multiple document upload
  const handleUpdateMultipleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    setUpdateFormData((prevState) => ({
      ...prevState,
      documents: files, // Store multiple selected files
    }));
  };

  const validateUpdateInputs = () => {
    let errors = {};

    // ✅ Required fields validation
    if (!updateFormData.fullname.trim()) {
      errors.fullname = "*Full name is required";
    }
    // if (!updateFormData.username.trim()) {
    //   errors.username = "*Username is required";
    // } else if (updateFormData.username.length < 6) {
    //   errors.username = "*Username must be at least 6 characters";
    // }
    if (!updateFormData.email.trim()) {
      errors.email = "*Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateFormData.email)) {
      errors.email = "*Invalid email format";
    }
    if (!updateFormData.phone.trim()) {
      errors.phone = "*Phone number is required";
    } else if (!/^\d{10,12}$/.test(updateFormData.phone)) {
      errors.phone = "*Phone number must be between 10 to 12 digits";
    }
    // if (!updateFormData.gender.trim()) {
    //   errors.gender = "*Gender is required";
    // }
    // if (!updateFormData.status.trim()) {
    //   errors.status = "*Status is required";
    // }
    // if (!updateFormData.job_title.trim()) {
    //   errors.job_title = "*Job title is required";
    // }
     if (
      updateFormData.aadhar_no.trim() &&
      !/^\d{12}$/.test(updateFormData.aadhar_no.replace(/\s/g, ""))
    ) {
      errors.aadhar_no = "*Aadhaar number must be exactly 12 digits";
    }

    if (
      updateFormData.pan_no.trim() &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(updateFormData.pan_no.toUpperCase())
    ) {
      errors.pan_no = "*Invalid PAN number (Format: ABCDE1234F)";
    }
    if (!updateFormData.employment_type.trim()) {
      errors.employment_type = "*Employment type is required";
    }
    if (!updateFormData.date_of_joining.trim()) {
      errors.date_of_joining = "*Date of joining is required";
    }
    // if (!updateFormData.salary.trim()) {
    //   errors.salary = "*Salary is required";
    // }
    if (!updateFormData.work_location.trim()) {
      errors.work_location = "*Work location is required";
    }
    // if (!updateFormData.bank_name.trim()) {
    //   errors.bank_name = "*Bank name is required";
    // }
    // if (!updateFormData.account_number.trim()) {
    //   errors.account_number = "*Account number is required";
    // }
    // if (!updateFormData.ifsc_code.trim()) {
    //   errors.ifsc_code = "*IFSC code is required";
    // }
    // if (!updateFormData.account_type.trim()) {
    //   errors.account_type = "*Account type is required";
    // }
    // if (!updateFormData.pan_no.trim()) {
    //   errors.pan_no = "*Pan Card is required";
    // }
    // if (!updateFormData.aadhar_no.trim()) {
    //   errors.aadhar_no = "*Aadhar Card is required";
    // }
    // if (!updateFormData.date_of_birth.trim()) {
    //   errors.date_of_birth = "*DOB is required";
    // }
    if (!updateFormData.address.trim()) {
      errors.address = "*Address is required";
    }
    // if (!updateFormData.offer_letter_date.trim()) {
    //   errors.offer_letter_date = "*offer letter is required";
    // }
    // if (!updateFormData.date_of_exit.trim()) {
    //   errors.date_of_exit = "*Exit Date is required";
    // }
    if (!updateFormData.reporting_manager_id) {
      errors.reporting_manager_id = "*Reporting Manager is required";
    }
    // if (!updateFormData.remarks.trim()) {
    //   errors.remarks = "*Summary is required";
    // }
    // if (!updateFormData.branch_name.trim()) {
    //   errors.branch_name = "*Branch Name is required";
    // }

    // ✅ Update state and return validation result
    setUpdateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextUpdateStep = () => {
    setCurrentUpdateStep((prev) => prev + 1);
  };
  const prevUpdateStep = () => setCurrentUpdateStep((prev) => prev - 1);

  const handleUpdateSubmit = async (e) => {
    //console.log("Update function calling...");
    e.preventDefault();
    if (validateUpdateInputs()) {
      try {
        //console.log("updateFormData", updateFormData);
        const response = await dispatch(
          updateUser({ id: selectedEmployee.id, userData: updateFormData })
        ).unwrap();
        //console.log(response);

        if (response.success) {
          handleUpdateFlashMessage(response.message, "success");
          dispatch(
            listUsers({
              page: currentPage,
              limit: employeePerPage,
              search: searchTerm,
            })
          );
          setTimeout(() => {
            setEditUserModalOpen(false);
          }, 1000);
        } else {
          handleUpdateFlashMessage(
            response.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        handleUpdateFlashMessage(error.message || "An error occurred", "error");
      }
    }
  };

  //end update employee code

  //export employee data in excel file
  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(
        `${API_URL}/auth/export-employee-details`,
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
      link.setAttribute("download", "Employee_Report.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };
  //end export employee data in excel file

  //if (userLoading) return <p>Loading...</p>;
  //if (userError) return <p>{userError}</p>;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:justify-between">
        <div>
          <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
            Employee Management
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-[5px]">
          <div>
            <input
              type="search"
              className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 md:mt-0 flex items-start gap-5 md:gap-1">
            <div>
              {hasPermission(2, 1) && (
                <button
                  className="flex items-center text-white text-textdata whitespace-nowrap bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={() => setAddEmployeeModalOpen(true)}
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add Employee
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
                  onChange={(e) =>
                    setEntriesPerPageNewData(Number(e.target.value))
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
          <EmployeeTable
            Employees={users?.data}
            setEditUserModalOpen={setEditUserModalOpen}
            setViewModalOpen={setViewModalOpen}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            deleteFlashMessage={deleteFlashMessage} // ✅ Pass delete message
            deleteFlashMsgType={deleteFlashMsgType}
            handleDelete={handleDelete} // ✅ Pass delete type
          />
          {/*------- Table Data End -------*/}
        </div>

        {/* Add User Modal */}
        {isAddEmployeeModalOpen && (
          <AddEmployeeModal
            setAddEmployeeModalOpen={setAddEmployeeModalOpen}
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
            handleFileChange={handleFileChange}
            handleMultipleFileChange={handleMultipleFileChange}
            clearauditSignature={clearauditSignature}
            saveauditSignature={saveauditSignature}
            handleSubmit={handleSubmit}
            validateInputs={validateInputs}
            sigauditCanvas={sigauditCanvas}
            isSignatureauditEmpty={isSignatureauditEmpty}
            setIsSignatureauditEmpty={setIsSignatureauditEmpty}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {/* Edit User Modal */}
        {isEditUserModalOpen && (
          <EditUserModal
            setEditUserModalOpen={setEditUserModalOpen}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            updateFormData={updateFormData}
            setUpdateFormData={setUpdateFormData}
            updateFormErrors={updateFormErrors}
            setUpdateFormErrors={setUpdateFormErrors}
            updateFlashMessage={updateFlashMessage}
            setUpdateFlashMessage={setUpdateFlashMessage}
            updateFlashMsgType={updateFlashMsgType}
            setUpdateFlashMsgType={setUpdateFlashMsgType}
            handleUpdateChange={handleUpdateChange}
            handleUpdateFileChange={handleUpdateFileChange}
            handleUpdateMultipleFileChange={handleUpdateMultipleFileChange}
            validateUpdateInputs={validateUpdateInputs}
            handleUpdateSubmit={handleUpdateSubmit}
            handleUpdateFlashMessage={handleUpdateFlashMessage}
            nextUpdateStep={nextUpdateStep}
            prevUpdateStep={prevUpdateStep}
            currentUpdateStep={currentUpdateStep}
            userDeatail={userDeatail}
          />
        )}

        {/* View User Modal */}
        {isViewModalOpen && (
          <ViewUserModal
            setViewModalOpen={setViewModalOpen}
            selectedEmployee={selectedEmployee}
            setEditUserModalOpen={setEditUserModalOpen}
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

export default EmployeeManageData;
