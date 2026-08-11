import React from "react";

const RejectQuotation = ({
  setRejectQuotationPopup,
  setRejectionReason,
  handleSubmitRejection,
  rejectionReason,
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Upload Document with Template
        </h2>

        <div className="mt-5 md:mt-7 px-4 flex flex-col gap-2">
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Reason :
            </label>
            <textarea
              className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              rows="4"
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <div className="flex items-end justify-end gap-2">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleSubmitRejection}
            >
              Submit
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setRejectQuotationPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectQuotation;
