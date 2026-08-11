import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import SuccessMessage from "../../AlertMessage/SuccessMessage";
// import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const ApprovedTableAdminLeave = ({}) => {
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
        Approved Leave
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
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-left">
              <td className="px-4 py-2 text-newtextdata">Raj Kothre</td>
              <td className="px-4 py-2 text-newtextdata">01/07/25</td>
              <td className="px-4 py-2 text-newtextdata">01/07/25</td>
              <td className="px-4 py-2 text-newtextdata">Casual Leave</td>
              <td className="px-4 py-2 text-newtextdata">Full Day</td>
              <td className="px-4 py-2 text-newtextdata max-w-[300px] whitespace-normal break-words">
                I would like to request one day of casual leave tomorrow as I
                have an important client meeting outside the city to finalize a
                sales deal. This meeting is crucial for closing the quarter’s
                target, and travel time will prevent me from attending office.
                Thank you for your understanding.
              </td>
              <td className="px-4 py-2 text-newtextdata whitespace-nowrap  space-x-2 text-center">
                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Approve
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApprovedTableAdminLeave;
