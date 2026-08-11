import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addRole, listRoles } from "../../../redux/authSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const AddRoleModal = ({
  setAddUserModalOpen,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  flashMessage,
  flashMsgType,
  handleFlashMessage,
  handleChange,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  // const [formData, setFormData] = useState({
  //   role_name: "",
  //   role_description: "",
  // });
  // const [formErrors, setFormErrors] = useState({});

  // const [flashMessage, setFlashMessage] = useState("");
  // const [flashMsgType, setFlashMsgType] = useState("");

  // // handle flash messages show
  // const handleFlashMessage = (errorMessage, msgType) => {
  //   console.log("this fun calling");
  //   setFlashMessage(errorMessage);
  //   setFlashMsgType(msgType);
  //   setTimeout(() => {
  //     setFlashMessage("");
  //     setFlashMsgType("");
  //   }, 3000); // Hide the message after 3 seconds
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));

  //   // Clear error when user types
  //   setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  // };

  // const validateInputs = () => {
  //   let errors = {};
  //   if (!formData.role_name.trim()) {
  //     errors.role_name = "*Role name is required";
  //   }
  //   if (!formData.role_description.trim()) {
  //     errors.role_description = "*Role description is required";
  //   }
  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validateInputs()) {
  //     try {
  //       const response = await dispatch(addRole(formData)).unwrap();
  //       console.log("response", response.success); // Debugging response

  //       if (response.success) {
  //         handleFlashMessage(response?.message, "success");
  //             dispatch(listRoles());
  //       } else {
  //         handleFlashMessage(response?.message || "Something went wrong", "error");
  //       }
  //       setTimeout(() => {
  //         setAddUserModalOpen(false);
  //       }, 3000);
  //       //setAddUserModalOpen(false);
  //     } catch (error) {
  //       console.error("Error adding role:", error);
  //       handleFlashMessage(error?.message || "An error occurred", "error"); // Use error.message
  //     }
  //   }
  // };

  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-textdata whitespace-nowrap font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New Role
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
            )}
          </div>
          <div className="mt-5 md:mt-9 px-4 flex flex-col gap-2">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Role Name:
              </label>
              <input
                type="text"
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                placeholder="HR, Manager, Employee, Marketing"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.role_name && (
                <p className="text-red-500 text-sm">{formErrors.role_name}</p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Role Description:
              </label>
              <textarea
                name="role_description"
                value={formData.role_description}
                onChange={handleChange}
                placeholder="Description"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.role_description && (
                <p className="text-red-500 text-sm">
                  {formErrors.role_description}
                </p>
              )}
            </div>

            <div className="flex items-end justify-end gap-2">
              <button
                onClick={handleSubmit}
                className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              >
                Add Role
              </button>
              <button
                className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                onClick={() => setAddUserModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRoleModal;
