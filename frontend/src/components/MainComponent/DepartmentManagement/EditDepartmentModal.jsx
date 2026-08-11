import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateDepartment,
  listDepartments,
} from "../../../redux/departmentSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const EditDepartmentModal = ({
  setEditModalOpen,
  selectedDepartment,
  setSelectedDepartment,
  updateFormData,
  setUpdateFormData,
  updateFormErrors,
  setUpdateFormErrors,
  updateFlashMessage,
  updateFlashMsgType,
  handleUpdateChange,
  validateUpdateInputs,
  handleUpdateSubmit,
  handleUpdateFlashMessage,
}) => {
  const dispatch = useDispatch();

  // const [updateFormData, setupdateFormData] = useState({
  //   department_name: "",
  //   status: "",
  //   department_description: "",
  // });
  // const [updateFormErrors, setupdateFormErrors] = useState({});
  // const [flashMessage, setFlashMessage] = useState("");
  // const [flashMsgType, setFlashMsgType] = useState("");

  // useEffect(() => {
  //   if (selectedDepartment) {
  //     setupdateFormData({
  //       department_name: selectedDepartment.department_name || "",
  //       status: selectedDepartment.status || "Active",
  //       department_description: selectedDepartment.department_description || "",
  //     });
  //   }
  // }, [selectedDepartment]);

  // const handleFlashMessage = (message, type) => {
  //   setFlashMessage(message);
  //   setFlashMsgType(type);
  //   setTimeout(() => {
  //     setFlashMessage("");
  //     setFlashMsgType("");
  //   }, 3000);
  // };

  // const handleUpdateChange= (e) => {
  //   const { name, value } = e.target;
  //   setupdateFormData((prevData) => ({ ...prevData, [name]: value }));
  //   setupdateFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  // };

  // const validateInputs = () => {
  //   let errors = {};
  //   if (!updateFormData.department_name.trim()) {
  //     errors.department_name = "*Department name is required";
  //   }
  //   if (!updateFormData.status.trim()) {
  //     errors.status = "*Department status is required";
  //   }
  //   if (!updateFormData.department_description.trim()) {
  //     errors.department_description = "*Department description is required";
  //   }
  //   setupdateFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  // const handleUpdateSubmit= async (e) => {
  //   e.preventDefault();
  //   if (validateInputs()) {
  //     try {
  //       const response = await dispatch(
  //         updateDepartment({ id: selectedDepartment.id, departmentData: updateFormData })
  //       ).unwrap();

  //       if (response.success) {
  //         handleFlashMessage(response.message, "success");
  //         await dispatch(listDepartments());
  //         setTimeout(() => {
  //           setEditModalOpen(false);
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
          <h2 className="text-white text-textdata whitespace-nowrap font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Department
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
                Department Name:
              </label>
              <input
                type="text"
                name="department_name"
                value={updateFormData.department_name}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.department_name && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.department_name}
                </p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Status:
              </label>
              <select
                name="status"
                value={updateFormData.status}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Department Description:
              </label>
              <textarea
                name="department_description"
                value={updateFormData.department_description}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.department_description && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.department_description}
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
                onClick={() => setEditModalOpen(false)}
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

export default EditDepartmentModal;
