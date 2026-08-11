import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DepartmentManageData.css";
import { iconsImgs } from "../../../utils/images";
import DepartmentTable from "./DepartmentTable";
import Pagination from "./Pagination";
import AddDepartmentModal from "./AddDepartmentModal";
import ViewDepartmentModal from "./ViewDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";
import { listDepartments,addDepartment,updateDepartment,removeDepartment} from "../../../redux/departmentSlice";

const DepartmentManageData = () => {
  const dispatch = useDispatch();
  const { departments, totalPages, departmentloading, departmenterror } = useSelector(
    (state) => state.department
  );

  const [selectedDepartment, setSelectedDepartment] = useState({});
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 10;

  // Fetch departments whenever searchTerm or currentPage changes
  useEffect(() => {
    dispatch(
      listDepartments({
        page: currentPage,
        limit: departmentsPerPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  //add department code =================================================================================
  const [formData, setFormData] = useState({
      department_name: "",
      status: "",
      department_description: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [flashMessage, setFlashMessage] = useState("");
    const [flashMsgType, setFlashMsgType] = useState("");
  
    // Handle Flash Messages
    const handleFlashMessage = (message, type) => {
      setFlashMessage(message);
      setFlashMsgType(type);
      setTimeout(() => {
        setFlashMessage("");
        setFlashMsgType("");
      }, 3000);
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
  
      // Clear error when user types
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };
  
    const validateInputs = () => {
      let errors = {};
      if (!formData.department_name.trim()) {
        errors.department_name = "*Department name is required";
      }
      if (!formData.status) {
        errors.status = "*Status is required";
      }
      if (!formData.department_description.trim()) {
        errors.department_description = "*Description is required";
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateInputs()) {
        try {
          const response = await dispatch(addDepartment(formData)).unwrap();
          if (response.success) {
            handleFlashMessage(response?.message, "success");
            dispatch(
              listDepartments({
                page: currentPage,
                limit: departmentsPerPage,
                search: searchTerm,
              })
            );
          } else {
            handleFlashMessage(response?.message || "Something went wrong", "error");
          }
          setTimeout(() => {
            setAddModalOpen(false);
          }, 1000);
        } catch (error) {
          console.error("Error adding department:", error);
          handleFlashMessage(error?.message || "An error occurred", "error");
        }
      }
    };
  //end add department code ================================================================================

  //edit department code ====================================================================================

  const [updateFormData, setUpdateFormData] = useState({
    department_name: "",
    status: "",
    department_description: "",
  });
  const [updateFormErrors, setUpdateFormErrors] = useState({});
  const [updateFlashMessage, setUpdateFlashMessage] = useState("");
  const [updateFlashMsgType, setUpdateFlashMsgType] = useState("");
  
  useEffect(() => {
    if (selectedDepartment) {
      setUpdateFormData({
        department_name: selectedDepartment.department_name || "",
        status: selectedDepartment.status || "Active",
        department_description: selectedDepartment.department_description || "",
      });
    }
  }, [selectedDepartment]);
  
  // ✅ Handle Flash Messages for Update
  const handleUpdateFlashMessage = (message, type) => {
    setUpdateFlashMessage(message);
    setUpdateFlashMsgType(type);
    setTimeout(() => {
      setUpdateFlashMessage("");
      setUpdateFlashMsgType("");
    }, 3000);
  };
  
  // ✅ Handle Input Changes for Update Form
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({ ...prevData, [name]: value }));
    setUpdateFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  
  // ✅ Validate Inputs for Update Form
  const validateUpdateInputs = () => {
    let errors = {};
    if (!updateFormData.department_name.trim()) {
      errors.department_name = "*Department name is required";
    }
    if (!updateFormData.status.trim()) {
      errors.status = "*Department status is required";
    }
    if (!updateFormData.department_description.trim()) {
      errors.department_description = "*Department description is required";
    }
    setUpdateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // ✅ Handle Submit for Update Form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (validateUpdateInputs()) {
      try {
        const response = await dispatch(
          updateDepartment({
            id: selectedDepartment.id,
            departmentData: updateFormData,
          })
        ).unwrap();
  
        if (response.success) {
          handleUpdateFlashMessage(response.message, "success");
          dispatch(
            listDepartments({
              page: currentPage,
              limit: departmentsPerPage,
              search: searchTerm,
            })
          );
          setTimeout(() => {
            setEditModalOpen(false);
          }, 1000);
        } else {
          handleUpdateFlashMessage(response.message || "Something went wrong", "error");
        }
      } catch (error) {
        handleUpdateFlashMessage(error.message || "An error occurred", "error");
      }
    }
  };
  

  //end edit department code ================================================================================

  //delete department code =================================================================
const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

// ✅ Function to show delete flash messages
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
    await dispatch(removeDepartment(id)).unwrap();
    handleDeleteFlashMessage("Department deleted successfully!", "success");
    dispatch(
      listDepartments({
        page: currentPage,
        limit: departmentsPerPage,
        search: searchTerm,
      })
    );
  } catch (error) {
    handleDeleteFlashMessage(
      error?.message || "Failed to delete department",
      "error"
    );
  }
};

  //end delete department code =============================================================

  //if (departmentloading) return <p>Loading...</p>;
  //if (departmenterror) return <p>{departmenterror}</p>;

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
            Department Management
          </h1>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <input
              type="search"
              className="border border-[#473b33] bg-transparent px-3 py-[0.15rem] text-white outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
              onClick={() => setAddModalOpen(true)}
            >
              <img
                src={iconsImgs.plus}
                alt="plus icon"
                className="w-[18px] mr-1"
              />{" "}
              Add Department
            </button>
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] text-white shadow-md px-4 py-6">
        <DepartmentTable
  Departments={departments?.data}
  setEditModalOpen={setEditModalOpen}
  setViewModalOpen={setViewModalOpen}
  selectedDepartment={selectedDepartment}
  setSelectedDepartment={setSelectedDepartment}
  deleteFlashMessage={deleteFlashMessage}
  deleteFlashMsgType={deleteFlashMsgType}
  handleDeleteFlashMessage={handleDeleteFlashMessage}
  handleDelete={handleDelete}
/>
        </div>
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>

      {/* Add Department Modal */}
      {isAddModalOpen && (
  <AddDepartmentModal
    setAddModalOpen={setAddModalOpen}
    formData={formData}
    setFormData={setFormData}
    formErrors={formErrors}
    setFormErrors={setFormErrors}
    flashMessage={flashMessage}
    setFlashMessage={setFlashMessage}
    flashMsgType={flashMsgType}
    setFlashMsgType={setFlashMsgType}
    handleChange={handleChange}
    validateInputs={validateInputs}
    handleSubmit={handleSubmit}
    handleFlashMessage={handleFlashMessage}
  />
)}
      {/* Edit Department Modal */}
      {isEditModalOpen && (
  <EditDepartmentModal
    setEditModalOpen={setEditModalOpen}
    selectedDepartment={selectedDepartment}
    setSelectedDepartment={setSelectedDepartment}
    
    // ✅ Pass Updated States
    updateFormData={updateFormData}
    setUpdateFormData={setUpdateFormData}
    updateFormErrors={updateFormErrors}
    setUpdateFormErrors={setUpdateFormErrors}
    updateFlashMessage={updateFlashMessage}
    updateFlashMsgType={updateFlashMsgType}

    // ✅ Pass Handlers
    handleUpdateChange={handleUpdateChange}
    validateUpdateInputs={validateUpdateInputs}
    handleUpdateSubmit={handleUpdateSubmit}
    handleUpdateFlashMessage={handleUpdateFlashMessage}
  />
)}

      {/* View Department Modal */}
      {isViewModalOpen && (
        <ViewDepartmentModal
          setViewModalOpen={setViewModalOpen}
          selectedDepartment={selectedDepartment}
        />
      )}
    </div>
  );
};

export default DepartmentManageData;
