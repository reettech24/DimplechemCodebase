import React from "react";
import Quotation_Module from "../../assets/Quotation_Module.pdf";
import Choksi_project_quotation from "../../assets/Choksi_project_quotation.pdf";
import QuotationAddForm from "./QuotationAddForm";
import dimple_chemical from "../../assets/dimple_chemical.pdf"

const QuotationShow = ({
  quotationAddPopup,
  setQuotationAddPopup,
  handleChange,
  handleQuotationSubmit,
  today,
  formQuotationData,
}) => {
  return (
    <>
      <div className="">
        <h3 className="text-md font-semibold text-white mb-2">
          Quotation Module
        </h3>
        <div className="border rounded overflow-hidden">
          <object
            data={Quotation_Module}
            type="application/pdf"
            width="100%"
            height="600px"
          ></object>
        </div>
        <div className="flex items-end justify-center gap-2">
          <button
            className="bg-gray-600 text-white px-3 py-2 rounded mt-2 hover:bg-gray-800"
            onClick={() => setQuotationAddPopup(true)}
          >
            Add Quotation Form
          </button>
          {/* <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
            Edit
          </button>
          <button className="bg-red-700 text-white px-3 py-2 rounded mt-2 hover:bg-red-900">
            Delete
          </button>
          <button className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
            Share
          </button>
          <button className="mt-4 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700">
            Download
          </button> */}
        </div>
      </div>
      <div className="">
        <h3 className="text-md font-semibold text-white mb-2">
          Dimple Chemical Project Quotation
        </h3>
        <div className="border rounded overflow-hidden">
          {/* <object
            data={Choksi_project_quotation}
            type="application/pdf"
            width="100%"
            height="600px"
          ></object> */}
            <object
            data={dimple_chemical}
            type="application/pdf"
            width="100%"
            height="600px"
          ></object>
        </div>
        <div className="flex items-end justify-center gap-2">
          <button
            className="bg-gray-600 text-white px-3 py-2 rounded mt-2 hover:bg-gray-800"
            onClick={() => setQuotationAddPopup(true)}
          >
            Add Quotation Form
          </button>
          {/* <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
            Edit
          </button>
          <button className="bg-red-700 text-white px-3 py-2 rounded mt-2 hover:bg-red-900">
            Delete
          </button>
          <button className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
            Share
          </button>
          <button className="mt-4 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700">
            Download
          </button> */}
        </div>
      </div>

      {quotationAddPopup && (
        <QuotationAddForm
          setQuotationAddPopup={setQuotationAddPopup}
          handleQuotationSubmit={handleQuotationSubmit}
          handleChange={handleChange}
          today={today}
          formQuotationData={formQuotationData}
        />
      )}
    </>
  );
};

export default QuotationShow;
