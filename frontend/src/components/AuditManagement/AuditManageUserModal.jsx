import React from "react";
import SignatureCanvas from "react-signature-canvas";

const AuditManageUserModal = ({
  ncFormData,
  handleNcFormChange,
  handleDigitalSignatureChange,
  shareNCFormWithClient,
  setShowModal,
  sigauditCanvas,
  clearauditSignature,
  saveauditSignature,
  isSignatureauditEmpty,
  setIsSignatureauditEmpty
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[800px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Fill The NC Form
        </h2>

        <div className="mt-5 md:mt-7 px-4 flex flex-col gap-2">
          <div className="w-full flex items-center gap-4">
            <div className="w-full">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                NC Form Description :
              </label>
              <textarea
                name="description"
                value={ncFormData.description}
                onChange={handleNcFormChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                placeholder="Enter NC Form Description"
              />
            </div>

            <div className="w-full">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Action Plan :
              </label>
              <textarea
                name="actionPlan"
                value={ncFormData.actionPlan}
                onChange={handleNcFormChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                placeholder="Enter Action Plan"
              />
            </div>
          </div>
          <div className="w-full flex items-start gap-4">
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                Upload Written Signature :
              </label>

              <div className="signature-container block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400">
                <SignatureCanvas
                  ref={sigauditCanvas}
                  penColor="white"
                  canvasProps={{
                    width: 350,
                    height: 150,
                    className: "signature-canvas",
                    style: {
                      borderRadius: "8px",
                      backgroundColor: "#fe6c00",
                    },
                  }}
                  onEnd={() => setIsSignatureauditEmpty(false)}
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <div
                    onClick={clearauditSignature}
                    className="bg-gray-500 text-[15px] text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer"
                  >
                    Clear
                  </div>
                  <div
                    onClick={saveauditSignature}
                    disabled={isSignatureauditEmpty}
                    className={`${
                      isSignatureauditEmpty
                        ? "bg-gray-400 cursor-not-allowed" // Disabled state style
                        : "bg-green-700 hover:bg-green-600 cursor-pointer" // Enabled state style
                    } text-[15px] text-white px-3 py-1 rounded`}
                  >
                    Save Signature
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Due Date :
              </label>
              <input
                type="date"
                name="dueDate"
                value={ncFormData.dueDate}
                onChange={handleNcFormChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
            </div>
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              checked={ncFormData.digitalSignature}
              onChange={handleDigitalSignatureChange}
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Digital Signature (Client Approval) :
            </label>
          </div> */}
        </div>

        <div className="flex items-end justify-end gap-2 px-4">
          <button
            className="text-white px-3 py-2 rounded mt-2 bg-bgDataNew hover:bg-[#cb6f2ad9]"
            onClick={shareNCFormWithClient}
            // disabled={!selectedTemplate && !title}
          >
            Share with Client
          </button>
          <button
            className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditManageUserModal;
