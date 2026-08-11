import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import { addLeadCommunication } from "../../../../redux/leadSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const EmpSARReport = ({
  setpoaReportOpen,
  selectedPOA,
  setViewCustomerModalOpen,
  setSelectedLead,
}) => {
  console.log("selectedPOA", selectedPOA);
  const dispatch = useDispatch();
  const [poaData, setPoaData] = useState([]);

  useEffect(() => {
    if (selectedPOA?.customer_id) {
      getPOAReport(selectedPOA.customer_id);
    }
  }, [selectedPOA]);

  const getPOAReport = async (customer_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/getPOAReportForSalesByCustId/${customer_id}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setPoaData(response.data.data);
      //console.log("POA Report data:", response.data);
    } catch (error) {
      console.error("Failed to load POA report", error);
    }
  };

  console.log("poaData", poaData);
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
    
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full lg:w-[1150px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Summery of Sales Activity Report 
        </h2>

        {/* Table */}
        <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-200px)]">
          <div className="py-3 px-3 w-[1130px] custom-scrollbar overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 text-left border-collapse">
              <thead className="bg-[#473b33] rounded-[8px]">
                <tr>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap border border-gray-300">
                    Id
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Employee Name
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Company Name
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300 text-red-500">
                    Date of Visit
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    No. of Visits
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Total Hrs Spend
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Approx Area SqM
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Approx Area Cub. Mtr
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Total Product Qty. in Kg
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Total Potential Amount
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Types of Documents Sent
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Last Visit Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {poaData && poaData.length > 0 ? (
                  poaData.map((item, index) => (
                    <tr key={item.id || index} className="text-center">
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.assignedPerson?.fullname || "-"}
                      </td>
                      <td
                        className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300 cursor-pointer"
                        onClick={() => {
                          setSelectedLead(item);
                          setViewCustomerModalOpen(true);
                        }}
                      >
                        {item.customer?.company_name || "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.assign_date
                          ? new Date(item.assign_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.communications?.[0]?.followup_summary
                          ? `${
                              (
                                item.communications[0].followup_summary.match(
                                  /^\d+\./gm
                                ) || []
                              ).length
                            }`
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.communications[0]?.total_hrs_spent ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.project_name ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.approx_area_cubm ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.total_material_qty ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.approx_business ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300 whitespace-pre-line">
                        {item.documents?.length > 0
                          ? item.documents.join("\n")
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                        {item.next_followup
                          ? new Date(item.next_followup).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="13"
                      className="border px-4 py-4 text-center text-gray-500"
                    >
                      No Sales Activity Report data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setpoaReportOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EmpSARReport;
