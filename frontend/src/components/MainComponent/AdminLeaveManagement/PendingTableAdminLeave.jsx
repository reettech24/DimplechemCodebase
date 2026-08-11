import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const PendingTableAdminLeave = ({  leaveData,
  activeTabLeaveAdmin,
  leaveFlashMessage,
  leaveFlashMsgType,
  handleLeaveFlashMessage,
  setSelectedLeave,
  updateLeaveStatus,
setViewModalOpen}) => {
  return (
    <>
      <div className="fixed top-5 right-5 z-50">
        {leaveFlashMessage && (
    leaveFlashMsgType === "success" ? (
      <SuccessMessage message={leaveFlashMessage} />
    ) : (
      <ErrorMessage message={leaveFlashMessage} />
    )
  )}
      </div>
      <h1 className="text-white text-textdata whitespace-nowrap font-semibold mb-5">
          {activeTabLeaveAdmin === "pending"
          ? "Request"
          : activeTabLeaveAdmin === "approved"
          ? "Approved"
          : activeTabLeaveAdmin === "rejected"
          ? "Rejected"
          : ""}
      </h1>
      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-center">
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
                Employee Name
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                From Date
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                To Date
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Type
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Duration
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Reason
              </th>
               {/* {activeTabLeaveAdmin=="pending" && ( */}
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Action
              </th>
              {/* )} */}
            </tr>
          </thead>
          <tbody>
            {leaveData?.map((leave) => (
              <tr key={leave.id} className="text-left">
                <td className="px-4 py-2 text-newtextdata">
                  {leave.employee?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {new Date(leave.from_date).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {new Date(leave.to_date).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {leave.leave_type}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {leave.leave_duration}
                </td>
                <td className="px-4 py-2 text-newtextdata max-w-[300px] whitespace-normal break-words">
                  {leave.reason}
                </td>
                
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap space-x-2 text-center">
                   <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedLeave(leave);
                    setViewModalOpen(true);
                  }}>
                    View
                  </button>
                  {activeTabLeaveAdmin=="pending" && (
                    <>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => updateLeaveStatus(leave.id, "approved")}>
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                   onClick={() => updateLeaveStatus(leave.id, "rejected")}>
                    Cancel
                  </button>
                  </>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PendingTableAdminLeave;
