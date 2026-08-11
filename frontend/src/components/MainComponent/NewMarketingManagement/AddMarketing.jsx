import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const AddMarketing = ({
  setIsAddMarketing,
  formData,
  setFormData,
  formErrors,
  handleChange,
  handleSubmitAddMarketing,
  flashMessage,
  flashMsgType,
  employeeList,
}) => {
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add Marketing
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
            )}
          </div>

          <div className="mt-4 md:mt-5 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Activity Planned */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Activity Planned :
              </label>
              <textarea
                name="activity_planned"
                placeholder="Enter Activity Planned"
                value={formData.activity_planned}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
              {formErrors.activity_planned && (
                <p className="text-red-500 text-sm">
                  {formErrors.activity_planned}
                </p>
              )}
            </div>

            {/* Activity Date */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Activity Date :
              </label>
              <input
                type="date"
                name="activity_date"
                value={formData.activity_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.activity_date && (
                <p className="text-red-500 text-sm">
                  {formErrors.activity_date}
                </p>
              )}
            </div>

            {/* Complete Date */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Complete Date :
              </label>
              <input
                type="date"
                name="complete_date"
                value={formData.complete_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.complete_date && (
                <p className="text-red-500 text-sm">
                  {formErrors.complete_date}
                </p>
              )}
            </div>

            {/* Total Spent */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Total Spent :
              </label>
              <input
                type="number"
                name="total_spent"
                placeholder="Enter Total Amount Spent"
                value={formData.total_spent}
                onChange={handleChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.total_spent && (
                <p className="text-red-500 text-sm">{formErrors.total_spent}</p>
              )}
            </div>

            {/* Lead Generated */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Lead Generated :
              </label>
              <input
                type="number"
                name="lead_generated"
                placeholder="Number of leads"
                value={formData.lead_generated}
                onChange={handleChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.lead_generated && (
                <p className="text-red-500 text-sm">
                  {formErrors.lead_generated}
                </p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Assigned To :
              </label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Employee</option>
                {employeeList?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullname}
                  </option>
                ))}
              </select>
              {formErrors.assigned_to && (
                <p className="text-red-500 text-sm">{formErrors.assigned_to}</p>
              )}
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
            <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
            onClick={handleSubmitAddMarketing}>
              Add Marketing
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsAddMarketing(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMarketing;
