import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { iconsImgs } from "../../../utils/images";
import ContentTop from "../../ContentTop/ContentTop";
import BusinessAssociateListTableReport from "./BusinessAssociateListTableReport";
//import AdminViewAnnualReport  from "./AdminViewAnnualReport";
import Pagination from "./Pagination";

import {
  useGetBusinessAssociatesQuery,
  useAddBusinessAssociateMutation,
  useEditBusinessAssociateMutation,
  useDeleteBusinessAssociateMutation,
} from "../../../redux/services/businessAssociateService";

import axios from "axios";
import AddBusinessAssociateModal from "./AddBusinessAssociateModal";
import ViewBusinessAssociateModal from "./ViewBusinessAssociateModal";
import EditBusinessAssociateModal from "./EditBusinessAssociateModal";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const BusinessAssociateList = () => {
  const [selectedBusinessAssocitae, setSelectedBusinessAssocitae] = useState(
    {}
  );

  const [isViewReportOpen, setIsViewReportOpen] = useState(false);
  const [abpbyempid, setabpbyempid] = useState([]);
  const [abpproductbyid, setabpproductbyid] = useState([]);

  const [isAddBAModalOpen, setAddBAModalOpen] = useState(false);
  const [isViewBAModalOpen, setViewBAModalOpen] = useState(false);
  const [isEditBAModalOpen, setEditBAModalOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const abpPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  const { data, error, isLoading, refetch } = useGetBusinessAssociatesQuery({
    page: currentPage,
    limit: abpPerPage,
    search: searchTerm,
    entriesPerPageNewData,
  });

  const [addBusinessAssociate, { isSuccess, isError, error: baerror }] =
    useAddBusinessAssociateMutation();

  const [
    editBusinessAssociate,
    { isSuccess: editisSuccess, isError: isIsError, error: editBaerror },
  ] = useEditBusinessAssociateMutation();

  const [deleteBusinessAssociate] = useDeleteBusinessAssociateMutation();

  // useEffect(() => {
  //   refetch();
  // }, [entriesPerPageNewData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //add business associate
  const [formData, setFormData] = useState({
    associate_name: "",
    phone_no: "",
    email: "",
  });

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

    // Clear error when user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateInputs = () => {
    let errors = {};
    if (!formData.associate_name.trim())
      errors.associate_name = "*Associate name is required";
    if (!formData.phone_no.trim()) errors.phone_no = "*Phone no. is required";
    if (!formData.email.trim()) errors.email = "*Email is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAddBusinessAssociate = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await addBusinessAssociate(formData).unwrap();
        console.log("Response:", response);

        if (response?.success) {
          handleFlashMessage(response?.message, "success");

          await refetch(); // 👈 refetch the list

          setTimeout(() => {
            setAddBAModalOpen(false);
          }, 1000);

          setFormData({});
        }
      } catch (error) {
        console.error("Error adding Business Associate:", error);
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

  //end add business associate

  //edit business  associate
  const [editFormData, setEditFormData] = useState({
    associate_name: "",
    phone_no: "",
    email: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({});
  const [editFlashMessage, setEditFlashMessage] = useState("");
  const [editFlashMsgType, setEditFlashMsgType] = useState("");

  useEffect(() => {
    if (selectedBusinessAssocitae) {
      setEditFormData({
        associate_name: selectedBusinessAssocitae?.associate_name || "",
        phone_no: selectedBusinessAssocitae?.phone_no || "",
        email: selectedBusinessAssocitae?.email || "",
      });
    }
  }, [selectedBusinessAssocitae?.id]);

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
    if (!editFormData.associate_name.trim())
      errors.associate_name = "*Associate name is required";
    if (!editFormData.phone_no) errors.phone_no = "*Phone contact is required";
    if (!editFormData.email.trim()) errors.email = "*Email is required";

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (validateEditInputs()) {
      try {
        // Call mutation hook
        const response = await editBusinessAssociate({
          id: selectedBusinessAssocitae?.id,
          updatedData: editFormData,
        }).unwrap();

        console.log("Edit response:", response);

        if (response.success) {
          handleEditFlashMessage(response.message, "success");

          await refetch(); // if you're using useGetBusinessAssociatesQuery with refetch()

          setTimeout(() => {
            setEditBAModalOpen(false); // assuming modal state for edit is named like this
          }, 1000);
        } else {
          handleEditFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error editing associate:", error);
        handleEditFlashMessage(
          error?.data?.message || "An error occurred",
          "error"
        );
      }
    }
  };

  //end edit business associate

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
      await deleteBusinessAssociate(id).unwrap();
      handleDeleteFlashMessage(
        "Business Associate deleted successfully!",
        "success"
      );
      await refetch();
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete Business Associate",
        "error"
      );
    }
  };
  //end delete functionality

  //export BA data in excel file
  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(
        `${API_URL}/auth/exportBusinessAssociates`,
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
      link.setAttribute("download", "Business_AssociateList_Report.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };
  //end export BA data in excel file

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching associates.</p>;

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Business Associate Report
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
                onClick={() => setAddBAModalOpen(true)}
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Business Associate
              </button>
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
            <BusinessAssociateListTableReport
              BAdata={data?.data}
              setSelectedBusinessAssocitae={setSelectedBusinessAssocitae}
              setViewBAModalOpen={setViewBAModalOpen}
              setEditBAModalOpen={setEditBAModalOpen}
              handleDelete={handleDelete}
              deleteFlashMessage={deleteFlashMessage}
              deleteFlashMsgType={deleteFlashMsgType}
            />
            {/*-------- Table Data End --------*/}
          </div>
        </div>

        {/* Add Buisness Associate Modal */}
        {isAddBAModalOpen && (
          <AddBusinessAssociateModal
            setAddBAModalOpen={setAddBAModalOpen}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleChange={handleChange}
            handleSubmitAddBusinessAssociate={handleSubmitAddBusinessAssociate}
            flashMessage={flashMessage}
            flashMsgType={flashMsgType}
          />
        )}

        {/* View Buisness Associate Modal */}
        {isViewBAModalOpen && (
          <ViewBusinessAssociateModal
            setViewBAModalOpen={setViewBAModalOpen}
            selectedBusinessAssocitae={selectedBusinessAssocitae}
          />
        )}

        {/* Edit Buisness Associate Modal */}
        {isEditBAModalOpen && (
          <EditBusinessAssociateModal
            setEditBAModalOpen={setEditBAModalOpen}
            selectedBusinessAssocitae={selectedBusinessAssocitae}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            editFormErrors={editFormErrors}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
            editFlashMessage={editFlashMessage}
            editFlashMsgType={editFlashMsgType}
          />
        )}
      </div>
      {/* Pagination Controls with Number */}
      <Pagination
        currentPage={data?.currentPage}
        handlePageChange={handlePageChange}
        totalPages={data?.totalPages}
      />
    </div>
  );
};

export default BusinessAssociateList;
