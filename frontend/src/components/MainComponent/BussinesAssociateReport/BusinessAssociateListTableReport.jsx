import React, { useEffect, useState } from "react";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const BusinessAssociateListTableReport = ({
  BAdata,
  setSelectedBusinessAssocitae,
  setViewBAModalOpen,
  setEditBAModalOpen,
  handleDelete,
  deleteFlashMessage,
  deleteFlashMsgType,
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
      <div className="fixed top-5 right-5 z-50">
        {deleteFlashMessage && deleteFlashMsgType === "success" && (
          <SuccessMessage message={deleteFlashMessage} />
        )}
        {deleteFlashMessage && deleteFlashMsgType === "error" && (
          <ErrorMessage message={deleteFlashMessage} />
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar max-h-[360px]">
        <table className="table-auto w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-left sticky top-0 z-10">
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
              {/* <th className="px-4 py-2  text-bgDataNew text-newtextdata">
                Company name
              </th>
              <th className="px-4 py-2  text-bgDataNew text-newtextdata">
                Location
              </th> */}
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap ">
                Action
              </th>
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
                {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.customers?.company_name}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user.customers?.addresses?.length > 0
                    ? user?.customers?.addresses?.map((address, index) => (
                        <span key={index}>
                          {address.location}, {address.city}
                          <br />
                        </span>
                      ))
                    : "-"}
                </td> */}
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap  space-x-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setViewBAModalOpen(true);
                      setSelectedBusinessAssocitae(user);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                    onClick={() => {
                      setSelectedBusinessAssocitae(user);
                      setEditBAModalOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this Business Associates?"
                        )
                      ) {
                        handleDelete(user.id);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
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
