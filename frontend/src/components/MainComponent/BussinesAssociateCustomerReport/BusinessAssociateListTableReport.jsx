import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const BusinessAssociateListTableReport = ({
  BAdata,
  setSelectedBusinessAssocitae,
  setViewBAModalOpen,
}) => {
  console.log("BAdata",BAdata);
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
        <table className="table-auto w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-left">
              <th className="px-4 py-2  text-bgDataNew text-newtextdata whitespace-nowrap ">
                Code
              </th>
              <th className="px-4 py-2  text-bgDataNew text-newtextdata whitespace-nowrap ">
                Name
              </th>
              <th className="px-4 py-2  text-bgDataNew text-newtextdata ">
                Email
              </th>
              <th className="px-4 py-2  text-bgDataNew text-newtextdata whitespace-nowrap ">
                Contact
              </th>
              <th className="px-4 py-2  text-bgDataNew text-newtextdata">
                Company name
              </th>
               {/* 
              <th className="px-4 py-2  text-bgDataNew text-newtextdata">
                Location
              </th> */}
             
            </tr>
          </thead>

          <tbody>
            {BAdata?.map((user, index) => (
              <tr className="text-left" key={index}>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.code}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.associate_name}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.email}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.phone_no}
                </td>
                 <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer"  onClick={() => {
                      setViewBAModalOpen(true);
                      setSelectedBusinessAssocitae(user);
                    }}>
                 {user?.customers?.length > 0 ? (
  <>
    {user.customers[0].company_name}
    {user.customers.length > 1 && " +"}
  </>
) : (
  "-"
)}
                </td>
               
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BusinessAssociateListTableReport;
