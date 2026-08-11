import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./RoleManageData.css";
import { iconsImgs } from "../../../utils/images";
import RoleTable from "./RoleTable";
import Pagination from "./Pagination";
import AddRoleModal from "./AddRoleModal";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import { listRoles,addRole,updateRole,removeRole} from "../../../redux/authSlice";

const RoleManageData = () => {
  const dispatch = useDispatch();
  const { roles, totalPages, loading, error } = useSelector(
    (state) => state.auth
  );

  const [selectedRole, setSelectedRole] = useState({});
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditroleModalOpen, setEditroleModalOpen] = useState(false);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch roles whenever searchTerm or currentPage changes
  useEffect(() => {
    dispatch(
      listRoles({ page: currentPage, limit: usersPerPage, search: searchTerm })
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


  //add role code ============================================================
   const [formData, setFormData] = useState({
      role_name: "",
      role_description: "",
    });
    const [formErrors, setFormErrors] = useState({});
  
    const [flashMessage, setFlashMessage] = useState("");
    const [flashMsgType, setFlashMsgType] = useState("");
  
    // handle flash messages show
    const handleFlashMessage = (errorMessage, msgType) => {
      console.log("this fun calling");
      setFlashMessage(errorMessage);
      setFlashMsgType(msgType);
      setTimeout(() => {
        setFlashMessage("");
        setFlashMsgType("");
      }, 3000); // Hide the message after 3 seconds
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
  
      // Clear error when user types
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };
  
    const validateInputs = () => {
      let errors = {};
      if (!formData.role_name.trim()) {
        errors.role_name = "*Role name is required";
      }
      if (!formData.role_description.trim()) {
        errors.role_description = "*Role description is required";
      }
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateInputs()) {
        try {
          const response = await dispatch(addRole(formData)).unwrap();
          console.log("response", response.success); // Debugging response
  
          if (response.success) {
            handleFlashMessage(response?.message, "success");
            dispatch(
              listRoles({ page: currentPage, limit: usersPerPage, search: searchTerm })
            );
          } else {
            handleFlashMessage(response?.message || "Something went wrong", "error");
          }
          setTimeout(() => {
            setAddUserModalOpen(false);
          }, 3000);
          //setAddUserModalOpen(false);
        } catch (error) {
          console.error("Error adding role:", error);
          handleFlashMessage(error?.message || "An error occurred", "error"); // Use error.message
        }
      }
    };
  //end add role code ========================================================

  //update role code ====================================================
  const [updateFormData, setUpdateFormData] = useState({
    role_name: "",
    role_description: "",
  });
  const [updateFormErrors, setUpdateFormErrors] = useState({});
  const [updateFlashMessage, setUpdateFlashMessage] = useState("");
  const [updateFlashMsgType, setUpdateFlashMsgType] = useState("");
  
  useEffect(() => {
    if (selectedRole) {
      setUpdateFormData({
        role_name: selectedRole.role_name || "",
        role_description: selectedRole.role_description || "",
      });
    }
  }, [selectedRole]);
  
  const handleUpdateFlashMessage = (message, type) => {
    setUpdateFlashMessage(message);
    setUpdateFlashMsgType(type);
    setTimeout(() => {
      setUpdateFlashMessage("");
      setUpdateFlashMsgType("");
    }, 3000);
  };
  
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({ ...prevData, [name]: value }));
    setUpdateFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  
  const validateUpdateInputs = () => {
    let errors = {};
    if (!updateFormData.role_name.trim()) {
      errors.role_name = "*Role name is required";
    }
    if (!updateFormData.role_description.trim()) {
      errors.role_description = "*Role description is required";
    }
    setUpdateFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (validateUpdateInputs()) {
      try {
        const response = await dispatch(
          updateRole({ id: selectedRole.id, roleData: updateFormData })
        ).unwrap();
  
        if (response.success) {
          handleUpdateFlashMessage(response.message, "success");
          dispatch(
            listRoles({ page: currentPage, limit: usersPerPage, search: searchTerm })
          );
          setTimeout(() => {
            setEditroleModalOpen(false);
          }, 1000);
        } else {
          handleUpdateFlashMessage(response.message || "Something went wrong", "error");
        }
      } catch (error) {
        handleUpdateFlashMessage(error.message || "An error occurred", "error");
      }
    }
  };
  
  //end update role code =================================================

  //delete role data =================================================
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

// Function to show flash messages
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
    await dispatch(removeRole(id)).unwrap();
    handleDeleteFlashMessage("Role deleted successfully!", "success");
    dispatch(
      listRoles({ page: currentPage, limit: usersPerPage, search: searchTerm })
    );
  } catch (error) {
    handleDeleteFlashMessage(error?.message || "Failed to delete role", "error");
  }
};

  //end delete role data =================================================

  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>{error}</p>;

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
            Role Management
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
              onClick={() => setAddUserModalOpen(true)}
            >
              <img
                src={iconsImgs.plus}
                alt="plus icon"
                className="w-[18px] mr-1"
              />{" "}
              Add Role
            </button>
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] text-white shadow-md px-4 py-6">
        <RoleTable
  Roles={roles?.data}
  setEditroleModalOpen={setEditroleModalOpen}
  setViewModalOpen={setViewModalOpen}
  selectedRole={selectedRole}
  setSelectedRole={setSelectedRole}
  deleteFlashMessage={deleteFlashMessage}
  setDeleteFlashMessage={setDeleteFlashMessage}
  deleteFlashMsgType={deleteFlashMsgType}
  setDeleteFlashMsgType={setDeleteFlashMsgType}
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
      {/* {isAddUserModalOpen && <AddRoleModal setAddUserModalOpen={setAddUserModalOpen} />}
      {isEditUserModalOpen && <EditUserModal setEditUserModalOpen={setEditUserModalOpen} />}
      {isViewModalOpen && <ViewUserModal setViewModalOpen={setViewModalOpen} />} */}
      {/* Add User Modal */}
      {isAddUserModalOpen && (
  <AddRoleModal
    setAddUserModalOpen={setAddUserModalOpen}
    formData={formData}
    setFormData={setFormData}
    formErrors={formErrors}
    setFormErrors={setFormErrors}
    flashMessage={flashMessage}
    flashMsgType={flashMsgType}
    handleFlashMessage={handleFlashMessage}
    handleChange={handleChange}
    handleSubmit={handleSubmit}
  />
)}


      {/* Edit User Modal */}
      {isEditroleModalOpen && (
  <EditUserModal
    setEditroleModalOpen={setEditroleModalOpen}
    selectedRole={selectedRole}
    setSelectedRole={setSelectedRole}
    updateFormData={updateFormData}
    setUpdateFormData={setUpdateFormData}
    updateFormErrors={updateFormErrors}
    setUpdateFormErrors={setUpdateFormErrors}
    updateFlashMessage={updateFlashMessage}
    setUpdateFlashMessage={setUpdateFlashMessage}
    updateFlashMsgType={updateFlashMsgType}
    setUpdateFlashMsgType={setUpdateFlashMsgType}
    handleUpdateChange={handleUpdateChange}
    handleUpdateSubmit={handleUpdateSubmit}
    validateUpdateInputs={validateUpdateInputs}
    handleUpdateFlashMessage={handleUpdateFlashMessage}
  />
)}

      {/* View User Modal */}
      {isViewModalOpen && (
        <ViewUserModal
          setViewModalOpen={setViewModalOpen}
          selectedRole={selectedRole}
        />
      )}
    </div>
  );
};

export default RoleManageData;
