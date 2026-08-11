import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import SuccessMessage from "../../AlertMessage/SuccessMessage";
// import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const PendingTableSalesLeave = ({ leavedata, activeTabLeave,setSelectedLeave,
              setViewModalOpen }) => {
  return (
    <>
      {/* <div className="fixed top-5 right-5 z-50">
        {deleteFlashMessage && deleteFlashMsgType === "success" && ( 
          <SuccessMessage message={deleteFlashMessage} />
        )}
        {deleteFlashMessage && deleteFlashMsgType === "error" && (
          <ErrorMessage message={deleteFlashMessage} />
        )}
      </div> */}
      <h1 className="text-white text-textdata whitespace-nowrap font-semibold mb-5">
        {activeTabLeave === "pending"
          ? "Pending Leave"
          : activeTabLeave === "approved"
          ? "Approved Leave"
          : activeTabLeave === "rejected"
          ? "Rejected Leave"
          : ""}
      </h1>
      <div className="overflow-x-auto w-full custom-scrollbar">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-center">
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
                From Date
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                To Date
              </th>
               <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Duration
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Reason
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {leavedata?.map((leave, index) => (
              <tr key={leave.id || index} className="text-left">
                {/* From Date */}
                <td className="px-4 py-2 text-newtextdata">
                  {new Date(leave.from_date).toLocaleDateString("en-GB")}
                </td>

                {/* To Date */}
                <td className="px-4 py-2 text-newtextdata">
                  {new Date(leave.to_date).toLocaleDateString("en-GB")}
                </td>

                 <td className="px-4 py-2 text-newtextdata">
                  {leave.leave_duration}
                </td>

                {/* Reason */}
                <td className="px-4 py-2 text-newtextdata max-w-[300px] whitespace-normal break-words">
                  {leave.reason}
                </td>
                 <td className="px-4 py-2 text-newtextdata whitespace-nowrap space-x-2 text-left">
                   <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedLeave(leave);
                    setViewModalOpen(true);
                  }}>
                    View
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

export default PendingTableSalesLeave;
