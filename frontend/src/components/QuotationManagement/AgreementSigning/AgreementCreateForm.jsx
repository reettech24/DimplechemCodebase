import React, { useState } from "react";
import "./AgreementSignData.css";
import SignatureCanvas from "react-signature-canvas";

const AgreementCreateForm = ({
  setCreateAgreementPopup,
  handleAgreemnetSubmit,
  handleAgreementChange,
  formAgreementData,
  errorAgreement,
  isFormValid,
  activeButtonSignature,
  toggleSectionSignature,
  sigCanvas,
  clearSignature,
  saveSignature,
  isSignatureEmpty,
  handleImageChange
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <form
        className="bg-white w-full md:w-[600px] max-h-[calc(100vh-200px)] pt-0 pb-4 rounded-[6px] flex flex-col"
        onSubmit={handleAgreemnetSubmit}
      >
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Fill the Aggrement Details
        </h2>
        <div className="mt-5 md:mt-5 px-4 flex flex-col gap-2 overflow-y-auto max-h-[650px] scrollbar-hide">
          {errorAgreement && (
            <p className="text-red-500 text-center font-medium">{errorAgreement}</p>
          )}
          <h3 className="text-black text-center text-textdata whitespace-nowrap font-poopins font-semibold border-b w-fit px-3 inline-block">
            Client Details
          </h3>
          <div className="grid grid-row-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                 Client Name :
              </label>
              <input
                type="text"
                name="clientName"
                value={formAgreementData.clientName}
                onChange={handleAgreementChange}
                placeholder="Client Name"
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              />
            </div>
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                 Email :
              </label>
              <input
                type="email"
                name="email"
                value={formAgreementData.email}
                onChange={handleAgreementChange}
                placeholder="Email"
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              />
            </div>
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                 Conatct :
              </label>
              <input
                type="number"
                name="contact"
                value={formAgreementData.contact}
                onChange={handleAgreementChange}
                placeholder="Contact"
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              />
            </div>

            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                 Date :
              </label>
              <input
                type="date"
                name="companyDate"
                value={formAgreementData.companyDate}
                onChange={handleAgreementChange}
                min={new Date().toISOString().split("T")[0]}
                max={new Date().toISOString().split("T")[0]}
                placeholder="Company Fill Date"
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="font-poppins font-medium text-[16px] text-bgData">
               Address :
            </label>
            <textarea
              type="text"
              name="address"
              value={formAgreementData.address}
              onChange={handleAgreementChange}
              placeholder="Address"
              required
              className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
            />
          </div>

          <h3 className="mt-2 text-black text-center text-textdata whitespace-nowrap font-poopins font-semibold border-b w-fit px-3 inline-block">
            Payment Terms
          </h3>
          <div className="grid grid-row-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                Total Cost :
              </label>
              <input
                type="number"
                name="totalCost"
                value={formAgreementData.totalCost}
                onChange={handleAgreementChange}
                placeholder="cost"
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              />
            </div>
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                Payments Method :
              </label>
              <input
                type="text"
                name="paymentMethod"
                value={formAgreementData.paymentMethod}
                onChange={handleAgreementChange}
                placeholder=" Payment Methods"
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="font-poppins font-medium text-[16px] text-bgData">
               Milestone Payment Schedule :
            </label>
            <textarea
              type="text"
              name="milestoneSchedule"
              value={formAgreementData.milestoneSchedule}
              onChange={handleAgreementChange}
              placeholder="Milestone"
              required
              className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
            />
          </div>

          <div className="w-full">
            <label className="font-poppins font-medium text-[16px] text-bgData">
               Scope of Work :
            </label>
            <textarea
              type="text"
              name="scopeOfWork"
              value={formAgreementData.scopeOfWork}
              onChange={handleAgreementChange}
              placeholder="Scope of work"
              required
              className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
            />
          </div>

          <h3 className="mt-2 text-black text-center text-textdata whitespace-nowrap font-poopins font-semibold border-b w-fit px-3 inline-block">
            Responsibilities
          </h3>

          <div className="w-full">
            <label className="font-poppins font-medium text-[16px] text-bgData">
              Company Responsibilities :
            </label>
            <textarea
              type="text"
              name="developersResponsibilities"
              value={formAgreementData.developersResponsibilities}
              onChange={handleAgreementChange}
              placeholder="Fill Company Responsibilities:"
              required
              className="block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
            />
          </div>

          <div className="w-full">
            <label className="font-poppins font-medium text-[16px] text-bgData">
              Client's Responsibilities :
            </label>
            <textarea
              type="text"
              name="clientsResponsibilities"
              value={formAgreementData.clientsResponsibilities}
              onChange={handleAgreementChange}
              placeholder="Fill Client's Responsibilities:"
              required
              className="block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
            />
          </div>

          {/* Tab Data */}
          <div className="w-full flex items-center">
            <button
              className={`h-[40px] px-3 font-poppins font-semibold text-[15px] md:text-textdata whitespace-nowrap flex items-center justify-center relative ${
                activeButtonSignature === "signature"
                  ? "text-black"
                  : "text-[#667877]"
              }`}
              onClick={() => toggleSectionSignature("signature")}
            >
              Idice Signature
              {activeButtonSignature === "signature" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bgDataNew"></div>
              )}
            </button>

            <button
              className={`h-[40px] px-3 font-poppins font-semibold text-[15px] md:text-textdata whitespace-nowrap flex items-center justify-center relative ${
                activeButtonSignature === "photoSignature"
                  ? "text-black"
                  : "text-[#667877]"
              }`}
              onClick={() => toggleSectionSignature("photoSignature")}
            >
              Idice Photo Signature
              {activeButtonSignature === "photoSignature" && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bgDataNew"></div>
              )}
            </button>
          </div>

          {activeButtonSignature === "signature" && (
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                Upload Written Signature :
              </label>

              <div
                className="signature-container block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              >
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="white"
                  canvasProps={{
                    width: 540,
                    height: 150,
                    className: "signature-canvas",
                    style: {
                      borderRadius: "8px",
                      backgroundColor: "#fe6c00",
                    },
                  }}
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <div onClick={clearSignature} className="bg-gray-500 text-[15px] text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer">
                    Clear
                  </div>
                  <div
                    onClick={saveSignature}
                    disabled={isSignatureEmpty}
                    className={`${
                      isSignatureEmpty
                        ? "bg-gray-400 cursor-not-allowed" // Disabled state style
                        : "bg-green-700 hover:bg-green-600 cursor-pointer" // Enabled state style
                    } text-[15px] text-white px-3 py-1 rounded`}
                  >
                    Save Signature
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeButtonSignature === "photoSignature" && (
            <div className="w-full">
              <label className="font-poppins font-medium text-[16px] text-bgData">
                Upload Photo Signature :
              </label>
              <input
                type="file"
                name="idiceSignature"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400"
              />
            </div>
          )}

          <div className="flex items-end justify-end gap-2">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`${
                isFormValid()
                  ? "bg-bgDataNew text-white hover:bg-[#cb6f2ad9]"
                  : "bg-[#fc6b0045] text-white cursor-not-allowed"
              } px-3 py-2 rounded mt-2`}
            >
              Create Agreement
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setCreateAgreementPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgreementCreateForm;
