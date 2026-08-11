import React from "react";
import SignatureCanvas from "react-signature-canvas";

const ClientSignPopupData = ({
  sigClientCanvas,
  clearClientSignature,
  saveClientSignature,
  isSignatureClientEmpty,
  setClientSign,
  handlePopupClientSignature
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Add Your Signature
        </h2>
        <div className="mt-5 md:mt-9 px-4 flex flex-col gap-2">
          <div className="w-full">
            <label className="font-poppins font-medium text-[16px] text-bgData">
              Upload Written Signature : 
            </label>

            <div className="signature-container block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400">
              <SignatureCanvas
                ref={sigClientCanvas}
                penColor="white"
                canvasProps={{
                  width: 390,
                  height: 200,
                  className: "signature-canvas",
                  style: {
                    borderRadius: "8px",
                    backgroundColor: "#fe6c00",
                  },
                }}
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <div
                  onClick={clearClientSignature}
                  className="bg-gray-500 text-[15px] text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer"
                >
                  Clear
                </div>
                <div
                  onClick={saveClientSignature}
                  disabled={isSignatureClientEmpty}
                  className={`${
                    isSignatureClientEmpty
                      ? "bg-gray-400 cursor-not-allowed" // Disabled state style
                      : "bg-green-700 hover:bg-green-600 cursor-pointer" // Enabled state style
                  } text-[15px] text-white px-3 py-1 rounded`}
                >
                  Save Signature
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-end gap-2 px-4">
          <button
            type="submit"
            // disabled={!setClientSign()}
            onClick={handlePopupClientSignature}
            className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
          >
            Add Client Signature
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setClientSign(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientSignPopupData;
