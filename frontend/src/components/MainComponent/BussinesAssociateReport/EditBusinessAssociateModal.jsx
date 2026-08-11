import React, { useState, useEffect } from "react";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const EditBusinessAssociateModal = ({
  setEditBAModalOpen,
  selectedBusinessAssocitae,
  editFormData,
  setEditFormData,
  editFormErrors,
  handleEditChange,
  handleEditSubmit,
  editFlashMessage,
  editFlashMsgType,
}) => {
  //console.log("editFormData", editFormData);
  return (
    <>
      {/* Flash Messages */}

      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full w-full md:w-fit pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Update Buisness Associate
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {editFlashMessage && editFlashMsgType === "success" && (
              <SuccessMessage message={editFlashMessage} />
            )}
            {editFlashMessage && editFlashMsgType === "error" && (
              <ErrorMessage message={editFlashMessage} />
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
                  value={editFormData.associate_name}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.associate_name && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.associate_name}
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
                  min="0"
                  value={editFormData.phone_no}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.phone_no && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.phone_no}
                  </p>
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
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.email && (
                  <p className="text-red-500 text-sm">{editFormErrors.email}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 px-4">
            <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]" onClick={handleEditSubmit}>
              Update Buisness Associate
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setEditBAModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBusinessAssociateModal;
