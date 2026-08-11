import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";

const ParticularLeadAssign = ({
  setIsLeadAssignPopup,
  setSelectedPOAId,
  selectedPOA,
  userDataWithRole,
  handleAssignSalesPerson,
  poaUpdateData,
  setPoaUpdateData,
  handlePoaUpdateChange,
  validatePoaUpdateForm,
  poaFlashMessage,
  poaFlashMsgType,
  poaFormErrors,
}) => {
  const dispatch = useDispatch();

  return (
    <>
      {/* Flash Messages */}
      <div className="fixed top-5 right-5 z-10">
        {poaFlashMessage && poaFlashMsgType === "success" && (
          <SuccessMessage message={poaFlashMessage} />
        )}
        {poaFlashMessage && poaFlashMsgType === "error" && (
          <ErrorMessage message={poaFlashMessage} />
        )}
      </div>

      <div className="fixed inset-0 p-2 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white w-full w-full md:w-[400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[18px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Assign Sales Person
          </h2>
          <div className="mt-5 md:mt-5 px-4 flex flex-col gap-2 overflow-y-auto md:h-fit">

          {/* Sales Person */}
          <div>
            <label>Select Sales Person</label>
            <select
              name="sales_persion_id"
              value={poaUpdateData?.sales_persion_id}
              onChange={handlePoaUpdateChange}
              className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
            >
              <option value="">Select the Person</option>
              {userDataWithRole?.data?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullname}
                </option>
              ))}
            </select>
            {poaFormErrors?.sales_persion_id && (
              <p className="text-red-500">{poaFormErrors?.sales_persion_id}</p>
            )}
          </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
          <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleAssignSalesPerson}
            >
              Assign
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => {
                setIsLeadAssignPopup(false);
                setSelectedPOAId(null);
              }}
            >
              Close
            </button>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticularLeadAssign;
