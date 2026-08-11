import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateRole, listRoles } from "../../../redux/authSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const EditUserModal = ({
  setEditroleModalOpen,
  selectedRole,
  setSelectedRole,
  updateFormData,
  setUpdateFormData,
  updateFormErrors,
  setUpdateFormErrors,
  updateFlashMessage,
  setUpdateFlashMessage,
  updateFlashMsgType,
  setUpdateFlashMsgType,
  handleUpdateChange,
  handleUpdateSubmit,
  validateUpdateInputs,
  handleUpdateFlashMessage,
}) => {
  const dispatch = useDispatch();

  // const [updateFormData, setupdateFormData] = useState({
  //   role_name: "",
  //   role_description: "",
  // });
  // const [updateFormErrors, setupdateFormErrors] = useState({});
  // const [flashMessage, setFlashMessage] = useState("");
  // const [flashMsgType, setFlashMsgType] = useState("");

  // useEffect(() => {
  //   if (selectedRole) {
  //     setupdateFormData({
  //       role_name: selectedRole.role_name || "",
  //       role_description: selectedRole.role_description || "",
  //     });
  //   }
  // }, [selectedRole]);

  // const handleFlashMessage = (message, type) => {
  //   setFlashMessage(message);
  //   setFlashMsgType(type);
  //   setTimeout(() => {
  //     setFlashMessage("");
  //     setFlashMsgType("");
  //   }, 3000);
  // };

  // const handleUpdateChange = (e) => {
  //   const { name, value } = e.target;
  //   setupdateFormData((prevData) => ({ ...prevData, [name]: value }));
  //   setupdateFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  // };

  // const validateInputs = () => {
  //   let errors = {};
  //   if (!updateFormData.role_name.trim()) {
  //     errors.role_name = "*Role name is required";
  //   }
  //   if (!updateFormData.role_description.trim()) {
  //     errors.role_description = "*Role description is required";
  //   }
  //   setupdateFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  // const handleUpdateSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validateInputs()) {
  //     try {
  //       const response = await dispatch(
  //         updateRole({ id: selectedRole.id, roleData: updateFormData })
  //       ).unwrap();

  //       if (response.success) {
  //         handleFlashMessage(response.message, "success");
  //         await dispatch(listRoles());
  //         setTimeout(() => {
  //           setEditroleModalOpen(false);
  //         }, 3000);
  //       } else {
  //         handleFlashMessage(response.message || "Something went wrong", "error");
  //       }
  //     } catch (error) {
  //       handleFlashMessage(error.message || "An error occurred", "error");
  //     }
  //   }
  // };
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-textdata whitespace-nowrap font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Role
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {updateFlashMessage && updateFlashMsgType === "success" && (
              <SuccessMessage message={updateFlashMessage} />
            )}
            {updateFlashMessage && updateFlashMsgType === "error" && (
              <ErrorMessage message={updateFlashMessage} />
            )}
          </div>
          <div className="mt-5 md:mt-5 px-4 flex flex-col gap-2">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Role :
              </label>
              <input
                type="text"
                name="role_name"
                value={updateFormData.role_name}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.role_name && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.role_name}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Role Description :
              </label>
              <textarea
                name="role_description"
                value={updateFormData.role_description}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.role_description && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.role_description}
                </p>
              )}
            </div>

            <div className="flex items-end justify-end gap-2">
              <button
                onClick={handleUpdateSubmit}
                className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              >
                Save Changes
              </button>
              <button
                className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                onClick={() => setEditroleModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;
