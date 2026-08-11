import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const EmailSentTableReport = ({
  ABPdata,
  setIsViewReportOpen,
  getAnnualBusinessPlanByEmpId,
  setSelectedDocList
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
        {/* <h3 className="mt-0 mb-2 text-bgDataNew font-poppins border-[#473b33] border-2 w-[260px] font-medium text-[18px] text-bgData mb-3 text-center mx-auto">
          For the Year 2024 - 2025
        </h3> */}
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
                Customer Name
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata">
                Customer Email
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata">
                Sent Email
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata">
                Sent Documnet 
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
                  // onClick={() => {
                  //   setIsViewReportOpen(true);
                  //   getAnnualBusinessPlanByEmpId(user.emp_id);
                  // }}
                >
                  {user?.employee?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.customer?.company_name}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                 {user?.customer?.email_id}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.email_count}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer"  
                onClick={() => {
                    setIsViewReportOpen(true);
                    setSelectedDocList(user);
                  }}>
                  {user?.document_count}
                </td>
                {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap  space-x-2 text-center">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td> */}
              </tr>
            ))}
            {/* <tr className="text-center bg-[#473b33] rounded-[8px]">
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer font-bold text-bgDataNew">
                Total
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer font-bold ">
                {anualbsplanReportdata?.grand_total_area_mtr2}
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer font-bold ">
                {anualbsplanReportdata?.grand_total_buisness_potential}
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmailSentTableReport;
