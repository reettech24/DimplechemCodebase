import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDepartment, listDepartments } from "../../../redux/departmentSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const AddDepartmentModal = ({
  setAddModalOpen,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  flashMessage,
  setFlashMessage,
  flashMsgType,
  setFlashMsgType,
  handleChange,
  validateInputs,
  handleSubmit,
  handleFlashMessage,
}) => {
  const dispatch = useDispatch();
  // const [formData, setFormData] = useState({
  //   department_name: "",
  //   status: "",
  //   department_description: "",
  // });
  // const [formErrors, setFormErrors] = useState({});
  // const [flashMessage, setFlashMessage] = useState("");
  // const [flashMsgType, setFlashMsgType] = useState("");

  // // Handle Flash Messages
  // const handleFlashMessage = (message, type) => {
  //   setFlashMessage(message);
  //   setFlashMsgType(type);
  //   setTimeout(() => {
  //     setFlashMessage("");
  //     setFlashMsgType("");
  //   }, 3000);
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));

  //   // Clear error when user types
  //   setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  // };

  // const validateInputs = () => {
  //   let errors = {};
  //   if (!formData.department_name.trim()) {
  //     errors.department_name = "*Department name is required";
  //   }
  //   if (!formData.status) {
  //     errors.status = "*Status is required";
  //   }
  //   if (!formData.department_description.trim()) {
  //     errors.department_description = "*Description is required";
  //   }
  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validateInputs()) {
  //     try {
  //       const response = await dispatch(addDepartment(formData)).unwrap();
  //       if (response.success) {
  //         handleFlashMessage(response?.message, "success");
  //         dispatch(listDepartments());
  //       } else {
  //         handleFlashMessage(response?.message || "Something went wrong", "error");
  //       }
  //       setTimeout(() => {
  //         setAddModalOpen(false);
  //       }, 3000);
  //     } catch (error) {
  //       console.error("Error adding department:", error);
  //       handleFlashMessage(error?.message || "An error occurred", "error");
  //     }
  //   }
  // };

  return (
    <>
      {/* Flash Messages */}

      {/* Modal */}
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-textdata whitespace-nowrap font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New Department
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
            {/* Department Name */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Department Name:
              </label>
              <input
                type="text"
                name="department_name"
                value={formData.department_name}
                onChange={handleChange}
                placeholder="HR, IT, Finance, Sales"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {formErrors.department_name && (
                <p className="text-red-500 text-sm">
                  {formErrors.department_name}
                </p>
              )}
            </div>

            {/* Department Head */}
            {/* <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                 Department Head:
              </label>
              <select
                name="department_head"
                value={formData.department_head}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              >
                <option value="">Select the department head</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Customer Support">Customer Support</option>
              </select>
              {formErrors.department_head && (
                <p className="text-red-500 text-sm">{formErrors.department_head}</p>
              )}
            </div> */}

            {/* Status */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Status:
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {formErrors.status && (
                <p className="text-red-500 text-sm">{formErrors.status}</p>
              )}
            </div>

            {/* Department Description */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Description:
              </label>
              <textarea
                name="department_description"
                value={formData.department_description}
                onChange={handleChange}
                placeholder="Description"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {formErrors.department_description && (
                <p className="text-red-500 text-sm">
                  {formErrors.department_description}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-end justify-end gap-2">
              <button
                onClick={handleSubmit}
                className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              >
                Add Department
              </button>
              <button
                className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                onClick={() => setAddModalOpen(false)}
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

export default AddDepartmentModal;
