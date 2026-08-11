import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CustomerManageData.css";
import { iconsImgs } from "../../../utils/images";
import CustomerTable from "./CustomerTable";
import Pagination from "./Pagination";
import AddCustomerModal from "./AddCustomerModal";
import ViewCustomerModal from "./ViewCustomerModal";
import AssignLeadModal from "./AssignLeadModal";
import EditCustomerModal from "./EditCustomerModal";
import ContentTop from "../../ContentTop/ContentTop";
import { fetchUserWithRole } from "../../../redux/userSlice";
import {
  listCustomers,
  addCustomer,
  updateCustomer,
  removeCustomer,
  fetchAllBussinessAssociateList,
} from "../../../redux/customerSlice";
import { fetchCurrentUser } from "../../../redux/authSlice";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const CustomerManageData = () => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();

  const dispatch = useDispatch();
  const { customers, allBAdata, totalPages, customerLoading, customerError } =
    useSelector((state) => state.customer);

  const { userDataWithRole } = useSelector((state) => state.user);
  

  const { user: userDeatail } = useSelector((state) => state.auth);

  //console.log("allBAdata", allBAdata);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState({});
  //console.log("selectedCustomer",selectedCustomer);

  const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setEditCustomerModalOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  //console.log("customersPerPage",customersPerPage);

  // Fetch customers whenever searchTerm or currentPage changes
  //console.log("selectedCustomer",selectedCustomer?.id);
  useEffect(() => {
    //dispatch(fetchCurrentUser());
    // dispatch(fetchAllBussinessAssociateList({ cust_id: selectedCustomer?.id }));
    dispatch(fetchAllBussinessAssociateList());
     dispatch(
          fetchUserWithRole({
            roleId: 3,
          })
        );
    dispatch(
      listCustomers({
        page: currentPage,
        limit: customersPerPage,
        search: searchTerm,
      })
    );
    // }, [dispatch, currentPage, searchTerm, selectedCustomer?.id,entriesPerPageNewData]);
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

  //add customer functinality===============================================================
  const [formData, setFormData] = useState({
    company_name: "",
    client_name: "",
    designation: "",
    primary_contact: "",
    secondary_contact: "",
    email_id: "",
    address: "",
    location: "",
    pincode: "",
    pan_no: "",
    address_2: "",
    address_3: "",
    address_4: "",
    business_associate: "",
    associate_name: [],
    gst_number: "",
    contact_persons: [],
    company_address: [],
    sales_person_id:""
  });

  useEffect(() => {
    const fetchCityFromAPI = async () => {
      if (formData.pincode.length === 6) {
        try {
          // Fetch from India Post API
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${formData.pincode}`
          );
          const data = await res.json();

          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice?.[0];
            if (postOffice) {
              setFormData((prev) => ({
                ...prev,
                location: postOffice.District,
              }));
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching city:", error);
          setFormData((prev) => ({ ...prev, location: "" }));
        }
      } else {
        setFormData((prev) => ({ ...prev, location: "" }));
      }
    };

    fetchCityFromAPI();
  }, [formData.pincode]);

  // When pincode changes, fetch location

  const [formErrors, setFormErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 1000);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // setLastUpdatedField(name);

    // Clear error when user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateInputs = () => {
    let errors = {};
    if (!formData.company_name.trim())
      errors.company_name = "*Company name is required";
    if (
      formData.gst_number &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        formData.gst_number.toUpperCase()
      )
    ) {
      errors.gst_number = "*Invalid GST number (e.g., 27ABCDE1234F1Z5)";
    }
    // if (!formData.client_name.trim())
    //   errors.client_name = "*Client name is required";
    // if (!formData.designation.trim())
    //   errors.designation = "*Designation is required";
    if (!formData?.primary_contact?.trim()) {
      errors.primary_contact = "*Primary contact is required";
    } else if (!/^\d{10,12}$/.test(formData.primary_contact)) {
      errors.primary_contact = "*Phone number must be between 10 to 12 digits";
    }

    if (!formData?.email_id?.trim()) {
      errors.email_id = "*Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email_id.trim())
    ) {
      errors.email_id = "*Invalid email format";
    }

    if (
      formData.pan_no.trim() &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_no.toUpperCase())
    ) {
      errors.pan_no = "*Invalid PAN number (Format: ABCDE1234F)";
    }

    //if (!formData.address.trim()) errors.address = "*Address is required";
    //if (!formData.location.trim()) errors.location = "*Location is required";
    //if (!formData.pincode.trim()) errors.pincode = "*Pincode is required";
    //if (!formData.pan_no.trim()) errors.pan_no = "*PAN No is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAddCustomer = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      try {
        //check empty row for contact person and address
        const cleanedAddresses = (formData.company_address || []).filter(
          (addr) =>
            String(addr.pincode || "").trim() ||
            String(addr.location || "").trim() ||
            String(addr.city || "").trim() ||
            String(addr.address_type || "").trim() ||
            String(addr.full_address || "").trim()
        );
        const cleanedData = {
          ...formData,
          company_address: cleanedAddresses,

          // (also clean contact_persons if needed)
          contact_persons: (formData?.contact_persons).filter(
            (person) =>
              person?.name.trim() ||
              person?.email.trim() ||
              person?.phone_no.trim() ||
              person?.designation.trim()
          ),
        };
        //end==========================================

        const response = await dispatch(addCustomer(cleanedData)).unwrap();
        //console.log(response);
        if (response?.success) {
          handleFlashMessage(response?.message, "success");
          //dispatch(listCustomers());
          dispatch(
            listCustomers({
              page: currentPage,
              limit: customersPerPage,
              search: searchTerm,
            })
          );
          setTimeout(() => {
            setAddCustomerModalOpen(false);
          }, 1000);
          setFormData({});
        }
      } catch (error) {
        console.error("Error adding customer:", error);
        const errors = error?.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          handleFlashMessage(errors.join("\n"), "error");
        } else {
          handleFlashMessage(error?.message || "Something went wrong", "error");
        }
        //handleFlashMessage(error?.message || "An error occurred", "error");
      }
    }
  };

  //end add customer functinality==========================================================================

  //edit customer function=================================================================================

  const [editFormData, setEditFormData] = useState({
    company_name: "",
    client_name: "",
    designation: "",
    primary_contact: "",
    secondary_contact: "",
    email_id: "",
    address: "",
    location: "",
    pincode: "",
    pan_no: "",
    address_2: "",
    address_3: "",
    address_4: "",
    business_associate: "",
    associate_name: [],
    gst_number: "",
    //contact_persons: [],
    contact_persons: [
      { name: "", email: "", phone_no: "", designation: "" }, // 👈 initialize like this
    ],
    company_address: [],
    sales_person_id:""
  });

  useEffect(() => {
    const fetchCityFromAPI = async () => {
      if (editFormData?.pincode?.length === 6) {
        try {
          // Fetch from India Post API
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${editFormData?.pincode}`
          );
          const data = await res.json();

          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice?.[0];
            if (postOffice) {
              setEditFormData((prev) => ({
                ...prev,
                location: postOffice.District,
              }));
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching city:", error);
          setEditFormData((prev) => ({ ...prev, location: "" }));
        }
      } else {
        setEditFormData((prev) => ({ ...prev, location: "" }));
      }
    };

    fetchCityFromAPI();
  }, [editFormData.pincode]);

  const [editFormErrors, setEditFormErrors] = useState({});
  const [editFlashMessage, setEditFlashMessage] = useState("");
  const [editFlashMsgType, setEditFlashMsgType] = useState("");

  // Update form data when a customer is selected for editing
  useEffect(() => {
    //console.log("selectedCustomer",selectedCustomer);
    if (selectedCustomer) {
      setEditFormData({
        company_name: selectedCustomer.company_name || "",
        //client_name: selectedCustomer.client_name || "",
        //designation: selectedCustomer.designation || "",
        primary_contact: selectedCustomer.primary_contact || "",
        secondary_contact: selectedCustomer.secondary_contact || "",
        email_id: selectedCustomer.email_id || "",
        //address: selectedCustomer.address || "",
        //location: selectedCustomer.location || "",
        // pincode: selectedCustomer.pincode || "",
        pan_no: selectedCustomer.pan_no || "",
        //address_2: selectedCustomer.address_2 || "",
        //address_3: selectedCustomer.address_3 || "",
        //address_4: selectedCustomer.address_4 || "",
        gst_number: selectedCustomer.gst_number || "",
        business_associate: selectedCustomer?.businessAssociates?.id || "",
        contact_persons: selectedCustomer?.contactPersons || [],
        company_address: selectedCustomer?.addresses || [],
        sales_person_id:selectedCustomer?.sales_person_id || "",
        //contact_persons: selectedCustomer?.
      });
    }
  }, [selectedCustomer]);

  const handleEditFlashMessage = (message, type) => {
    setEditFlashMessage(message);
    setEditFlashMsgType(type);
    setTimeout(() => {
      setEditFlashMessage("");
      setEditFlashMsgType("");
    }, 3000);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    setEditFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateEditInputs = () => {
    let errors = {};
    if (!editFormData.company_name.trim())
      errors.company_name = "*Company name is required";
    if (
      editFormData.gst_number &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        editFormData.gst_number.toUpperCase()
      )
    ) {
      errors.gst_number = "*Invalid GST number (e.g., 27ABCDE1234F1Z5)";
    }
    // if (!editFormData.client_name.trim())
    //   errors.client_name = "*Client name is required";
    // if (!editFormData.designation.trim())
    //   errors.designation = "*Designation is required";
    if (!editFormData.primary_contact.trim()) {
      errors.primary_contact = "*Primary contact is required";
    } else if (!/^\d{10,12}$/.test(editFormData.primary_contact)) {
      errors.primary_contact = "*Phone number must be between 10 to 12 digits";
    }
    if (!editFormData.email_id.trim()) {
      errors.email_id = "*Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(editFormData.email_id.trim())
    ) {
      errors.email_id = "*Invalid email format";
    }

    if (
      editFormData.pan_no.trim() &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(editFormData.pan_no.toUpperCase())
    ) {
      errors.pan_no = "*Invalid PAN number (Format: ABCDE1234F)";
    }

    // if (!editFormData.address.trim()) errors.address = "*Address is required";
    //if (!editFormData.location.trim())
    //errors.location = "*Location is required";
    //if (!editFormData.pincode.trim()) errors.pincode = "*Pincode is required";
    //if (!editFormData.pan_no.trim()) errors.pan_no = "*PAN No is required";

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (validateEditInputs()) {
      try {
         //check empty row for contact person and address
        const cleanedAddresses = (editFormData.company_address || []).filter(
          (addr) =>
            String(addr.pincode || "").trim() ||
            String(addr.location || "").trim() ||
            String(addr.city || "").trim() ||
            String(addr.address_type || "").trim() ||
            String(addr.full_address || "").trim()
        );
        const cleanedData = {
          ...editFormData,
          company_address: cleanedAddresses,

          // (also clean contact_persons if needed)
          contact_persons: (editFormData?.contact_persons).filter(
            (person) =>
              person?.name.trim() ||
              person?.email.trim() ||
              person?.phone_no.trim() ||
              person?.designation.trim()
          ),
        };
        //end==========================================
        const response = await dispatch(
          updateCustomer({
            id: selectedCustomer?.id,
            customerData: cleanedData,
          })
        ).unwrap();

        //console.log("response", response);
        if (response.success) {
          handleEditFlashMessage(response.message, "success");
          dispatch(
            listCustomers({
              page: currentPage,
              limit: customersPerPage,
              search: searchTerm,
            })
          );
          setTimeout(() => {
            setEditCustomerModalOpen(false);
          }, 1000);
        } else {
          handleEditFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        handleEditFlashMessage(error.message || "An error occurred", "error");
      }
    }
  };

  //end edit customer function==============================================================================

  // delete customer =======================================================================================
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // Function to show flash messages for delete actions
  const handleDeleteFlashMessage = (message, type) => {
    setDeleteFlashMessage(message);
    setDeleteFlashMsgType(type);
    setTimeout(() => {
      setDeleteFlashMessage("");
      setDeleteFlashMsgType("");
    }, 3000); // Hide the message after 3 seconds
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(removeCustomer(id)).unwrap();
      handleDeleteFlashMessage("Customer deleted successfully!", "success");
      dispatch(
        listCustomers({
          page: currentPage,
          limit: customersPerPage,
          search: searchTerm,
        })
      );
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete customer",
        "error"
      );
    }
  };

  //end delete customer ========================================================================

  //export customer data in excel file
  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/export-customers`, {
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
      link.setAttribute("download", "Customer_Report.xlsx"); // File name
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

  //if (customerLoading) return <p>Loading...</p>;
  //if (customerError) return <p>{customerError}</p>;
  // console.log("editFormData?.associate_name",editFormData?.associate_name);
  const [associatePopup, setAssociatePopup] = useState(false);

  const handleAssociatePopup = () => {
    setAssociatePopup(true);
  };

  const [newAssociateName, setNewAssociateName] = useState("");
  const [newAssociatePhone, setNewAssociatePhone] = useState("");
  const [newAssociateEmail, setNewAssociateEmail] = useState("");

  const [BAformErrors, setBAFormErrors] = useState({});
  console.log("BAformErrors", BAformErrors);

  const bavalidateInputs = () => {
    let errors = {};

    if (!newAssociateName.trim())
      errors.associate_name = "*Associate name is required";
    if (!newAssociatePhone.trim()) errors.phone_no = "*Phone no. is required";
    if (!newAssociateEmail.trim()) errors.email = "*Email is required";

    // Optional: Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newAssociateEmail && !emailRegex.test(newAssociateEmail))
      errors.email = "*Please enter a valid email address";

    // Optional: Phone length check
    if (newAssociatePhone && newAssociatePhone.length < 10)
      errors.phone_no = "*Phone no. must be at least 10 digits";

    setBAFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleUpdateAssociate = async () => {
    if (!bavalidateInputs()) return;
    try {
      // ✅ Get token
      const token = getAuthToken();

      const updatedAssociateObj = {
        associate_name: newAssociateName,
        phone_no: newAssociatePhone,
        email: newAssociateEmail,
      };

      const response = await axios.post(
        //`${API_URL}/auth/update-asssociates/${selectedCustomer?.id}`, // Use PUT or PATCH for updates
        `${API_URL}/auth/add-business-associate`,
        updatedAssociateObj, // Send data in the request body

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log("response", response);

      if (response?.data?.success) {
        setAssociatePopup(false);
        // Ensure you're checking response.data for success
        handleEditFlashMessage(response?.data?.message, "success");
        dispatch(
          // fetchAllBussinessAssociateList({ cust_id: selectedCustomer?.id })
          fetchAllBussinessAssociateList()
        );
        // ✅ Clear input fields after successful add
        setNewAssociateName("");
        setNewAssociatePhone("");
        setNewAssociateEmail("");
      } else {
        handleEditFlashMessage(
          response.data.message || "Something went wrong",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating associate:", error);
      handleEditFlashMessage(
        "An error occurred while updating the associate.",
        "error"
      );
    }
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:justify-between">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Customer Management
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-[5px]">
            <div>
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="mt-4 md:mt-0 flex items-start gap-5 md:gap-1">
              <div>
                {hasPermission(3, 1) && (
                  <button
                    className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                    onClick={() => setAddCustomerModalOpen(true)}
                  >
                    <img
                      src={iconsImgs.plus}
                      alt="plus icon"
                      className="w-[18px] mr-1"
                    />{" "}
                    Add Customer
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
            <CustomerTable
              customers={customers?.data}
              setEditCustomerModalOpen={setEditCustomerModalOpen}
              setViewModalOpen={setViewModalOpen}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              setIsAssignModalOpen={setIsAssignModalOpen}
              deleteFlashMessage={deleteFlashMessage}
              deleteFlashMsgType={deleteFlashMsgType}
              handleDeleteFlashMessage={handleDeleteFlashMessage}
              handleDelete={handleDelete}
              userDeatail={userDeatail}
            />

            {/*------- Table Data End -------*/}
          </div>

          {/* Add User Modal */}
          {isAddCustomerModalOpen && (
            <AddCustomerModal
              setAddCustomerModalOpen={setAddCustomerModalOpen}
              handleSubmitAddCustomer={handleSubmitAddCustomer}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              setFormErrors={setFormErrors}
              formErrors={formErrors}
              flashMessage={flashMessage}
              setFlashMessage={setFlashMessage}
              setFlashMsgType={setFlashMsgType}
              flashMsgType={flashMsgType}
              handleFlashMessage={handleFlashMessage}
              bussinesasociatedata={allBAdata?.data}
              handleUpdateAssociate={handleUpdateAssociate}
              associatePopup={associatePopup}
              setAssociatePopup={setAssociatePopup}
              handleAssociatePopup={handleAssociatePopup}
              newAssociateName={newAssociateName}
              setNewAssociateName={setNewAssociateName}
              newAssociatePhone={newAssociatePhone}
              setNewAssociatePhone={setNewAssociatePhone}
              newAssociateEmail={newAssociateEmail}
              setNewAssociateEmail={setNewAssociateEmail}
              BAformErrors={BAformErrors}
              setBAFormErrors={setBAFormErrors}
              bavalidateInputs={bavalidateInputs}
              editFlashMessage={editFlashMessage}
              setEditFlashMessage={setEditFlashMessage}
              editFlashMsgType={editFlashMsgType}
              setEditFlashMsgType={setEditFlashMsgType}
               userDataWithRole={userDataWithRole}
            />
          )}

          {/* Edit User Modal */}
          {isEditCustomerModalOpen && (
            <EditCustomerModal
              setEditCustomerModalOpen={setEditCustomerModalOpen}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              editFormData={editFormData}
              setEditFormData={setEditFormData}
              editFormErrors={editFormErrors}
              setEditFormErrors={setEditFormErrors}
              editFlashMessage={editFlashMessage}
              setEditFlashMessage={setEditFlashMessage}
              editFlashMsgType={editFlashMsgType}
              setEditFlashMsgType={setEditFlashMsgType}
              handleEditChange={handleEditChange}
              handleEditSubmit={handleEditSubmit}
              bussinesasociatedata={allBAdata?.data}
              handleUpdateAssociate={handleUpdateAssociate}
              associatePopup={associatePopup}
              setAssociatePopup={setAssociatePopup}
              handleAssociatePopup={handleAssociatePopup}
              newAssociateName={newAssociateName}
              setNewAssociateName={setNewAssociateName}
              newAssociatePhone={newAssociatePhone}
              setNewAssociatePhone={setNewAssociatePhone}
              newAssociateEmail={newAssociateEmail}
              setNewAssociateEmail={setNewAssociateEmail}
              BAformErrors={BAformErrors}
              setBAFormErrors={setBAFormErrors}
              bavalidateInputs={bavalidateInputs}
               userDataWithRole={userDataWithRole}
            />
          )}
          {/* View User Modal */}
          {isViewModalOpen && (
            <ViewCustomerModal
              setViewModalOpen={setViewModalOpen}
              selectedCustomer={selectedCustomer}
            />
          )}

          {/* Assign Customer Modal */}
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

export default CustomerManageData;
