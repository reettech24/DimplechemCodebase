import React, { useEffect, useState, useContext } from "react";
import { SidebarContext } from "../../../context/sidebarContext";
import { useDispatch, useSelector } from "react-redux";

const DepartmentTable = ({
  setEditUserModalOpen,
  finalizeDealsData,
  setViewModalOpen,
  setSelectedSAR,
  setsarReportOpen,
}) => {
  //console.log("finalizeDealsData",finalizeDealsData);
  const dispatch = useDispatch();
  const { isSidebarOpen } = useContext(SidebarContext);

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
    
    <div className="overflow-x-auto custom-scrollbar max-h-[360px]">
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
              Id
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap whitespace-nowrap ">
              Employee Name
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap whitespace-nowrap ">
              Company Name
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap whitespace-nowrap ">
              Date of Visits
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap whitespace-nowrap ">
              No. of Visits
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap whitespace-nowrap ">
              CheckIn location
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
              CheckOut Location
            </th>
            {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
              Last Visit Remark
            </th> */}
          </tr>
        </thead>
        <tbody>
          {finalizeDealsData.map((deal, index) => (
            <tr key={deal.id || index}>
              <td className="px-4 py-2 text-newtextdata">{index + 1}</td>
              <td
                className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer"
                onClick={() => {
                  setSelectedSAR(deal);
                  setsarReportOpen(true);
                }}
              >
                {deal.assignedPerson?.fullname || "-"}
              </td>
              <td className="px-4 py-2 text-newtextdata">
                {deal.customer?.company_name || "-"}
              </td>
              <td className="px-4 py-2 text-newtextdata text-center">
                {deal.assign_date
                  ? new Date(deal.assign_date).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-2 text-newtextdata text-center">
                {deal.communications?.[0]?.followup_summary
                  ? `${
                      (
                        deal.communications[0].followup_summary.match(
                          /^\d+\./gm
                        ) || []
                      ).length
                    }`
                  : "-"}
              </td>
            
              <td className="px-4 py-2 text-newtextdata text-center">
                {deal.communications[0]?.start_location ?? "-"}
              </td>
               <td className="px-4 py-2 text-newtextdata text-center">
                {deal.communications[0]?.end_location ?? "-"}
              </td>
              {/* <td className="px-4 py-2 text-newtextdata text-center"> 
                {deal.communications?.[0]?.followup_summary ?? "-"}</td>{" "} */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default DepartmentTable;
