import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import SuccessMessage from "../../AlertMessage/SuccessMessage";
// import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const ApprovedTableSalesLeave = ({}) => {
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
                Reason
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-left">
              <td className="px-4 py-2 text-newtextdata">01/07/25</td>
              <td className="px-4 py-2 text-newtextdata">01/07/25</td>
              <td className="px-4 py-2 text-newtextdata max-w-[300px] whitespace-normal break-words">
                I am applying for one day of leave to attend an industry
                networking event. This event will provide valuable leads and
                partnership opportunities that can benefit our sales pipeline.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApprovedTableSalesLeave;
