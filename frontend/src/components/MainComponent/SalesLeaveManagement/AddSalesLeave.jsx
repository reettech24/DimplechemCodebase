import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const AddSalesLeave = ({
  setIsApplyLeaveOpen,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  flashMessage,
  setFlashMessage,
  flashMsgType,
  setFlashMsgType,
  handleChange,
  handleSubmitLeave,
  handleMultipleFileChange
}) => {
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Apply For Leave
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
            {/* From Date */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                From Date :
              </label>
              <input
                type="date"
                name="from_date"
                value={formData?.from_date}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] 
               focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
               min={new Date().toISOString().split("T")[0]}
              />
              {formErrors?.from_date && (
                <p className="text-red-500 text-sm">{formErrors?.from_date}</p>
              )}
            </div>

            {/* To Date */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                To Date :
              </label>
              <input
                type="date"
                name="to_date"
                value={formData?.to_date}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] 
               focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
               min={new Date().toISOString().split("T")[0]}
              />
              {formErrors?.to_date && (
                <p className="text-red-500 text-sm">{formErrors?.to_date}</p>
              )}
            </div>

            {/* Select Type */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Type :
              </label>
              <select
                name="leave_type"
                value={formData?.leave_type}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] 
               focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">-------- Select Type --------</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Others">Others</option>
              </select>
              {formErrors?.leave_type && (
                <p className="text-red-500 text-sm">{formErrors?.leave_type}</p>
              )}
            </div>

            {/* Leave Duration */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Leave Duration:
              </label>
              <div className="flex gap-2 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="leave_duration"
                    value="Full Day"
                    checked={formData?.leave_duration === "Full Day"}
                    onChange={handleChange}
                    className="accent-[#473b33] w-4 h-4"
                  />
                  Full Day
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="leave_duration"
                    value="Half Day"
                    checked={formData?.leave_duration === "Half Day"}
                    onChange={handleChange}
                    className="accent-[#473b33] w-4 h-4"
                  />
                  Half Day
                </label>
              </div>
              {formErrors?.leave_duration && (
                <p className="text-red-500 text-sm">
                  {formErrors?.leave_duration}
                </p>
              )}
            </div>

            {/* Reason for Leave */}
            <div className="col-span-2">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Reason for Leave:
              </label>
              <textarea
                placeholder="Reason for leave"
                name="reason"
                value={formData?.reason}
                onChange={handleChange}
                className="block w-full mb-2 h-[100px] rounded-[5px] border border-solid border-[#473b33] 
               focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
              {formErrors?.reason && (
                <p className="text-red-500 text-sm">{formErrors?.reason}</p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Upload Documents:
              </label>
              <input
                type="file"
                name="documents"
                multiple
                onChange={(e) => handleMultipleFileChange(e)}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[5px]"
              />
              {formErrors.documents && (
                <p className="text-red-500 text-sm">{formErrors.documents}</p>
              )}
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
            <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
            onClick={handleSubmitLeave}>
              Add Leave
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsApplyLeaveOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSalesLeave;
