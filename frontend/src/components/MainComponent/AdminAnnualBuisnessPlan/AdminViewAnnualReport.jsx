import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const AdminViewAnnualReport = ({
  setIsViewReportOpen,
  abpbyempid,
  getProductsByBusinessPlanId,
  abpproductbyid,
  getAnnualBusinessPlanByEmpId,
}) => {
  //console.log("abpbyempid", abpbyempid);
  const [selectedBusinessPlanId, setSelectedBusinessPlanId] = useState(null);
  const [IsAnnualProductPopup, setIsAnnualProductPopup] = useState(false);
  const [monthValue, setmonthValue] = useState(null);

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
                      <td className="py-2 text-left align-middle w-[5%]">:</td>
                      <td className="py-2 px-4 text-right text-gray-800 w-[40%]">
                        {abpbyempid?.employee_fullname}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Employee Code
                      </td>
                      <td className="py-2 text-left align-middle">:</td>
                      <td className="py-2 px-4 text-right text-gray-800">
                        {abpbyempid?.emp_code}
                      </td>
                    </tr>
                    {/* <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Business Associate code
                      </td>
                      <td className="py-2 text-left align-middle">:</td>
                      <td className="py-2 px-4 text-right text-gray-800">
                        addsafdf
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start">
                  <select
                    name="monthValeue"
                    value={monthValue}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setmonthValue(selectedValue); // update state
                      getAnnualBusinessPlanByEmpId(
                        abpbyempid?.emp_id,
                        selectedValue
                      ); // call API with new value
                    }}
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                  >
                    <option value="">Select Duration</option>
                    <option value={3}>3 month</option>
                    <option value={6}>6 month</option>
                    <option value={9}>9 month</option>
                    <option value={12}>12 month</option>
                  </select>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="text-white text-[12px] mb-[2px]"
                  />
                </div>
                {/* {abpFormErrors?.for_month && (
                  <p className="text-red-500">{abpFormErrors?.for_month}</p>
                )} */}
              </div>
            </div>

            <div className="mt-4 px-1 overflow-auto">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Customer Details
              </h3>
              <div class="px-[1px] custom-scrollbar overflow-x-auto">
                {/* First Table */}
                <table className="table-auto w-full text-center border-collapse border border-gray-400">
                  <tbody>
                    <tr className="">
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Country
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        State
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        City
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Custumer Name
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Location
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Month
                      </th>

                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Project Name/Application Area
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Contact Person
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Designation
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Phone Number
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        EmailID
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        BA Code
                      </th>

                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Approx Area in sqM
                      </th>
                      <th className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                        Buisness Potential
                      </th>
                    </tr>
                    {abpbyempid?.data?.map((user, index) => (
                      <tr className="" key={index}>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          India
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.areaDetails?.statename}
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.areaDetails?.district}
                        </td>

                        <td
                          className={`relative group cursor-pointer px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap cursor-pointer ${
                            selectedBusinessPlanId === user.id
                              ? "bg-yellow-300 text-black"
                              : ""
                          }`}
                          onClick={() => {
                            getProductsByBusinessPlanId(user.id);
                            setSelectedBusinessPlanId(user.id);
                            setIsAnnualProductPopup(true);
                          }}
                        >
                          {/* {user?.customer?.company_name} */}
                          {/* Show only first 2 words and ... only if more than 2 words */}
                          {(() => {
                            const words =
                              user?.customer?.company_name?.split(" ") || [];
                            return words.length > 2
                              ? `${words.slice(0, 2).join(" ")}...`
                              : user?.customer?.company_name;
                          })()}

                          {/* Tooltip on hover */}
                          <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-sm rounded-md px-3 py-1 -top-10 left-1/2 -translate-x-1/2 whitespace-normal max-w-xs shadow-lg text-center">
                            {user?.customer?.company_name}
                          </div>
                        </td>
                        <td class="relative group cursor-pointer px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {/* {user?.location} */}
                          {/* Show only first 2 words and ... only if more than 2 words */}
                          {(() => {
                            const words =
                              user?.location?.split(" ") || [];
                            return words.length > 2
                              ? `${words.slice(0, 2).join(" ")}...`
                              : user?.location;
                          })()}

                          {/* Tooltip on hover */}
                          <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-sm rounded-md px-3 py-1 -top-10 left-1/2 -translate-x-1/2 whitespace-normal max-w-xs shadow-lg text-center">
                            {user?.location}
                          </div>
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.for_month}
                        </td>
                        <td class="relative group cursor-pointer text-center px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {/* {user?.project_name} */}
                          {/* Show only first 2 words and ... only if more than 2 words */}
                          {(() => {
                            const words =
                              user?.project_name?.split(" ") || [];
                            return words.length > 2
                              ? `${words.slice(0, 2).join(" ")}...`
                              : user?.project_name;
                          })()}

                          {/* Tooltip on hover */}
                          <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-sm rounded-md px-3 py-1 -top-10 left-1/2 -translate-x-1/2 whitespace-normal max-w-xs shadow-lg text-center">
                            {user?.project_name}
                          </div>
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.contactPerson?.name}
                        </td>
                        <td class="relative group cursor-pointer px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {/* {user?.contactPerson?.designation} */}
                          {/* Show only first 2 words and ... only if more than 2 words */}
                          {(() => {
                            const words =
                              user?.contactPerson?.designation?.split(" ") || [];
                            return words.length > 2
                              ? `${words.slice(0, 2).join(" ")}...`
                              : user?.contactPerson?.designation;
                          })()}

                          {/* Tooltip on hover */}
                          <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-sm rounded-md px-3 py-1 -top-10 left-1/2 -translate-x-1/2 whitespace-normal max-w-xs shadow-lg text-center">
                            {user?.contactPerson?.designation}
                          </div>
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.contactPerson?.phone_no}
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.contactPerson?.email}
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.associate?.code}
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.area_mtr2}
                        </td>
                        <td class="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap">
                          {user?.buisness_potential}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {IsAnnualProductPopup && (
              <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white w-full md:w-[1350px] pt-0 pb-4 rounded-[6px] flex flex-col">
                  <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
                    Product Detail Data
                  </h2>
                  <div className="mt-5 md:mt-5 px-2 overflow-y-auto md:h-fit">
                    <div className="overflow-auto">
                      <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                        Product Details
                      </h3>
                      <div className="px-[1px] custom-scrollbar overflow-x-auto">
                        <table className="table-auto w-full text-center border-collapse border border-gray-400">
                          <tbody>
                            <tr className="text-center">
                              <td
                                colSpan="2"
                                className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                              >
                                Technology Used
                              </td>
                              <td
                                colSpan="2"
                                className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-400 font-medium whitespace-nowrap"
                              >
                                Product Name
                              </td>
                              <td className="px-4 py-2 border border-gray-400 font-medium">
                                Qty.
                              </td>
                              <td className="px-4 py-2 border border-gray-400 font-medium">
                                Rate
                              </td>
                              <td
                                colSpan="2"
                                className="px-4 py-2 border border-gray-400 font-medium"
                              >
                                Value Rs.
                              </td>
                              <td
                                colSpan="2"
                                className="px-4 py-2 border border-gray-400 font-medium"
                              >
                                GST Amt
                              </td>
                              <td
                                colSpan="2"
                                className="px-4 py-2 border border-gray-400 font-medium"
                              >
                                Gross Sale (GST)
                              </td>
                              <td
                                colSpan="2"
                                className="px-4 py-2 border border-gray-400 font-medium"
                              >
                                Commission
                              </td>
                              <td
                                colSpan="2"
                                className="px-4 py-2 border border-gray-400 font-medium"
                              >
                                Net Sale (GST)
                              </td>
                            </tr>

                            {abpproductbyid?.map((item, index) => (
                              <tr key={item.id} className="text-center">
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-[#72360a] border border-gray-400"
                                >
                                  {item?.technology_used}
                                </td>
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-[#72360a] border border-gray-400"
                                >
                                  {item.product?.product_name}
                                </td>
                                <td className="px-4 py-2 text-[#72360a] border border-gray-400">
                                  {item.qty}
                                </td>
                                <td className="px-4 py-2 text-[#72360a] border border-gray-400">
                                  {item.rate}
                                </td>
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-[#72360a] border border-gray-400"
                                >
                                  {item.value_in_rs}
                                </td>
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-[#72360a] border border-gray-400"
                                >
                                  {item.gst_amt}
                                </td>
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-[#72360a] border border-gray-400"
                                >
                                  {item.gross_sale_include_gst}
                                </td>
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-[#72360a] border border-gray-400"
                                >
                                  {item.commission}
                                </td>
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-[#72360a] border border-gray-400"
                                >
                                  {item.net_sale}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-end gap-2 px-4">
                    <button
                      className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                      onClick={() => setIsAnnualProductPopup(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => {
                setIsViewReportOpen(false);
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

export default AdminViewAnnualReport;
