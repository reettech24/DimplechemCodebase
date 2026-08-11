import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ViewAnnualReport = ({
  setViewAnnualReportOpen,
  selectedABP,
  setSelectedABP,
  setMonthWise,
  setAnuEmpId
}) => {
  //console.log("selectedABP", selectedABP);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
    <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 10px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #fe6c00c4 !important; 
            border-radius: 8px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            cursor: pointer;
          }

          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #68574c transparent;
            cursor: pointer;
          }
       `}
      </style>
      {/* Modal Container */}
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px]  rounded-[6px]">
          <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            View Report
          </h2>

          <div className="p-4 mt-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            <h3 className="mt-2 mb-2 text-bgDataNew font-poppins border border-gray-300 w-[300px] font-medium text-[20px] mb-0 text-center mx-auto">
              Annual Business Plan
            </h3>
            <h3 className="mt-2 mb-8 text-bgDataNew font-poppins border border-gray-300 w-[540px] font-medium text-[17px] mb-0 text-center mx-auto">
              Business Plan for the year {new Date().getFullYear()}-{new Date().getFullYear() + 1} for Work Execution
            </h3>

            <div className="px-2 mt-10 w-100 flex items-start justify-between px-0">
              <div className="bg-[#e5e7eb38] rounded-[5px] w-[560px]">
                <table className="w-full border border-gray-300 text-sm table-fixed">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600 w-[40%]">
                        Name of Employee
                      </td>
                      <td className="py-2 text-center align-middle w-[5%]">
                        :
                      </td>
                      <td className="py-2 px-4 text-right text-gray-800 w-[40%]">
                        {selectedABP?.employee?.fullname}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Employee code
                      </td>
                      <td className="py-2 text-center align-middle">:</td>
                      <td className="py-2 px-4 text-right text-gray-800">
                        {selectedABP?.employee?.emp_id}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Business Associate code
                      </td>
                      <td className="py-2 text-center align-middle">:</td>
                      <td className="py-2 px-4 text-right text-gray-800">
                        {selectedABP?.associate?.code}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className=" relative inline-block" ref={profileRef}>
                <button
                  className="notification-btn content-top-btns bg-gray-600 p-1 px-3 rounded-[5px] flex items-center gap-2 w-fit"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-start">
                      <h2 className="font-bai text-[12px] text-white datashowname">
                        <span className="full-name whitespace-nowrap">
                          {selectedABP?.for_month} month
                        </span>
                      </h2>
                    </div>
                  </div>

                  {/* <span className="notification-btn-dot"></span> */}
                </button>
              </div>
            </div>

            <div className="mt-4 px-1 overflow-auto">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Customer Details
              </h3>
              <div class="px-[1px] custom-scrollbar overflow-x-auto">
                {/* First Table */}
                <table className="table-fixed w-full text-left border-collapse border border-gray-400">
                  {/* 8 columns, each 12.5% */}
                  <colgroup>
                    <col span="6" style={{ width: "12.5%" }} />
                  </colgroup>
                  <tbody>
                    <tr className="text-center">
                      {/* colspan values sum to 8 */}
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Customer Name
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                        State
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                        City
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Location
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Country
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Contact Person
                      </td>
                      {/* <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Conatct no.
                      </td> */}
                    </tr>
                    <tr className="text-center">
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        {selectedABP?.customer?.company_name}
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                        {selectedABP?.areaDetails?.statename}
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                         {selectedABP?.areaDetails?.district}
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        {selectedABP?.location}
                      </td>
                       <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        India
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        {selectedABP?.contactPerson?.name}
                      </td>
                      {/* <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        +91 {selectedABP?.contactPerson?.phone_no}
                      </td> */}
                    </tr>
                  </tbody>
                </table>

                {/* Second Table */}
                <table className="table-fixed w-full text-left border-collapse border border-gray-400 mt-2">
                  {/* Same colgroup: 8 columns of 12.5% each */}
                  <colgroup>
                    <col span="6" style={{ width: "12.5%" }} />
                  </colgroup>
                  <tbody>
                    <tr className="text-center">
                     
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Email Id
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                        Buisness Potential
                      </td>
                       <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                        Designation
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Project Name
                      </td>
                      
                      
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        App Area(sq mtr)
                      </td>
                       <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        Contact No.
                      </td>
                    </tr>
                    <tr className="text-center">
                     
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        {selectedABP?.contactPerson?.email}
                      </td>
                       <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                        {selectedABP?.buisness_potential}
                      </td>
                       <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={1}
                      >
                        {selectedABP?.contactPerson?.designation}
                      </td>
                      
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        {selectedABP?.project_name}
                      </td>
                     
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        {selectedABP?.area_mtr2}
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                        colSpan={2}
                      >
                        +91 {selectedABP?.contactPerson?.phone_no}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 px-1 overflow-auto">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Product Details
              </h3>
              <div class="px-[1px] custom-scrollbar overflow-x-auto">
                <table class="table-auto w-full text-left border-collapse border border-gray-400">
                  <tbody>
                    <tr class="text-center">
                      <td
                        class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                        colspan="2"
                      >
                        Technology Used
                      </td>
                      <td
                        class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                        colspan="2"
                      >
                        Product Name
                      </td>
                      <td class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Qty.
                      </td>
                      <td class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Rate
                      </td>
                      <td
                        class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                        colspan="2"
                      >
                        Value Rs.
                      </td>
                      <td
                        class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                        colspan="2"
                      >
                        GST Amt
                      </td>
                      <td
                        class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                        colspan="2"
                      >
                        Gross Sale (GST)
                      </td>
                      <td
                        class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                        colspan="2"
                      >
                        Commission
                      </td>
                      <td
                        class="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                        colspan="2"
                      >
                        Net Sale (GST)
                      </td>
                    </tr>

                    {selectedABP?.products?.map((product, index) => (
                      <tr class="text-center" key={index}>
                        <td
                          class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                          colspan="2"
                        >
                          {/* {product?.category?.category_name} */}
                          {product?.technology_used}
                        </td>
                        <td
                          class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                          colspan="2"
                        >
                          {product?.product?.product_name}
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {product?.qty}
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {product?.rate}
                        </td>
                        <td
                          class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                          colspan="2"
                        >
                          {product?.value_in_rs}
                        </td>
                        <td
                          class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                          colspan="2"
                        >
                          ₹{product?.gst_amt}
                        </td>
                        <td
                          class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                          colspan="2"
                        >
                          ₹{product?.gross_sale_include_gst}
                        </td>
                        <td
                          class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                          colspan="2"
                        >
                          ₹{product?.commission}
                        </td>
                        <td
                          class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                          colspan="2"
                        >
                          ₹{product?.net_sale}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => {setViewAnnualReportOpen(false);
                 setMonthWise(null);
                 setAnuEmpId(null);
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

export default ViewAnnualReport;
