import React, { useState, useEffect } from "react";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const AddBusinessAssociateModal = ({
  setAddBAModalOpen,
  formData,
  setFormData,
  formErrors,
  handleChange,
  handleSubmitAddBusinessAssociate,
  flashMessage,
  flashMsgType,
}) => {
  return (
    <>
      {/* Flash Messages */}

      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full w-full md:w-fit pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New Buisness Associate
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
            )}
          </div>

          <div className="mt-5 md:mt-5 px-2 md:px-4  overflow-y-auto h-fit">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Associate Name */}
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Associate Name :
                </label>
                <input
                  type="text"
                  name="associate_name"
                  placeholder="Associate Name"
                  value={formData.associate_name}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.associate_name && (
                  <p className="text-red-500 text-sm">
                    {formErrors.associate_name}
                  </p>
                )}
              </div>

              {/* Phone no. */}
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Phone no. :
                </label>
                <input
                  type="number"
                  name="phone_no"
                  placeholder="Phone no."
                  value={formData.phone_no}
                  onChange={handleChange}
                   min="0"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.phone_no && (
                  <p className="text-red-500 text-sm">{formErrors.phone_no}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Email ID :
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm">{formErrors.email}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 px-4">
            <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]" 
             onClick={handleSubmitAddBusinessAssociate}>
              Add Buisness Associate
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setAddBAModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBusinessAssociateModal;
