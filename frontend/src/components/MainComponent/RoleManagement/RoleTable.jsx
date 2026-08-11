import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listRoles, removeRole } from "../../../redux/authSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const RoleTable = ({
  Roles,
  setEditroleModalOpen,
  setViewModalOpen,
  selectedRole,
  setSelectedRole,
  deleteFlashMessage,
  setDeleteFlashMessage,
  deleteFlashMsgType,
  setDeleteFlashMsgType,
  handleDeleteFlashMessage,
  handleDelete,
}) => {
  const dispatch = useDispatch();

  // const [flashMessage, setFlashMessage] = useState("");
  // const [flashMsgType, setFlashMsgType] = useState("");


  // // Function to show flash messages
  // const handleFlashMessage = (message, type) => {
  //   setFlashMessage(message);
  //   setFlashMsgType(type);
  //   setTimeout(() => {
  //     setFlashMessage("");
  //     setFlashMsgType("");
  //   }, 3000); // Hide the message after 3 seconds
  // };

  // const handleDelete = async (id) => {
    
  //     try {
  //       await dispatch(removeRole(id)).unwrap();
  //       handleFlashMessage("Role deleted successfully!", "success");
  //       dispatch(listRoles()); // Refresh role list
  //     } catch (error) {
  //       handleFlashMessage(error?.message || "Failed to delete role", "error");
  //     }
    
  // };

  return (
    <>
    <div className="fixed top-5 right-5 z-50">
    {deleteFlashMessage && deleteFlashMsgType  === "success" && <SuccessMessage message={deleteFlashMessage} />}
    {deleteFlashMessage && deleteFlashMsgType  === "error" && <ErrorMessage message={deleteFlashMessage} />}
  </div>
    <div className="overflow-x-auto custom-scrollbar">
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
            <th className="px-4 py-2 text-left text-bgDataNew text-textdata">Id</th>
            <th className="px-4 py-2 text-left text-bgDataNew text-textdata">Role</th>
            <th className="px-4 py-2 text-left text-bgDataNew text-textdata">Role Description</th>
            <th className="px-4 py-2 text-left text-bgDataNew text-textdata">Action</th>
          </tr>
        </thead>
        <tbody>
          {Roles?.map((role, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-textdata">{index+1}</td>
              <td className="px-4 py-2 text-textdata">{role.role_name}</td>
              <td className="px-4 py-2 text-textdata">{role.role_description}</td>
              <td className="px-4 py-2 text-textdata whitespace-nowrap space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedRole(role); 
                    setViewModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => {
                    setSelectedRole(role); // Set the selected role
                    setEditroleModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this role?")) {
                      handleDelete(role.id);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default RoleTable;
