import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const AdminListTableReport = ({
  ABPdata,
  anualbsplanReportdata,
  setIsViewReportOpen,
  getAnnualBusinessPlanByEmpId,
}) => {
  //console.log("anualbsplanReportdata",anualbsplanReportdata);
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
        <h3 className="mt-0 mb-2 text-bgDataNew font-poppins border-[#473b33] border-2 w-[260px] font-medium text-[18px] text-bgData mb-3 text-center mx-auto">
          For the Year 2024 - 2025
        </h3>
        <table className="table-auto w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap ">
                Sr. No.
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap ">
                Employee Name
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap ">
                No. of Companies
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata">
                Product Sale / Work Execution / Expected Sales
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata">
                Total Material Qty. / Total Area (in Sqm)
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata">
                Approx Business Potential
              </th>
              {/* <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap ">
                Action
              </th> */}
            </tr>
          </thead>

          <tbody>
            {ABPdata?.map((user, index) => (
              <tr className="text-center" key={index}>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {index + 1}
                </td>
                <td
                  className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    setIsViewReportOpen(true);
                    getAnnualBusinessPlanByEmpId(user.emp_id);
                  }}
                >
                  {user?.employee_fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.unique_customers_count}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.category_names}+
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.total_area_mtr2}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.total_buisness_potential}
                </td>
                {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap  space-x-2 text-center">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td> */}
              </tr>
            ))}
            <tr className="text-center  rounded-[8px]">
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer font-bold text-bgDataNew">
                Total
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer font-bold text-bgDataNew">
                {anualbsplanReportdata?.grand_total_area_mtr2}
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer font-bold text-bgDataNew">
                {anualbsplanReportdata?.grand_total_buisness_potential}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminListTableReport;
