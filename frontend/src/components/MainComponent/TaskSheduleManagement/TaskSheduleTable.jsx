import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";


const TaskSheduleTable = ({
  setIsEditTaskOpen,
  setIsViewTaskOpen,
  taskData,
  setSelectedTask,
  handleDelete,
  deleteFlashMessage,
  deleteFlashMsgType,
  getTaskById,
  empRole
}) => {
      const { hasPermission } = useUserPermissionCheck();
  
  //console.log("taskData", taskData);
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
      <div className="overflow-x-auto custom-scrollbar w-full max-h-[360px]">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-center sticky top-0 z-10">
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
                Id
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Title
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Assigned To{" "}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Due Date
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-textdata whitespace-nowrap ">
                Status
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {taskData?.map((user, index) => (
              <tr className="text-left" key={index}>
                <td className="px-4 py-2 text-newtextdata">{index + 1}</td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.task_title}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.assignedUser?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.due_date
                    ? new Date(user.due_date).toLocaleDateString("en-GB")
                    : "-"}
                </td>
                <td className="px-4 py-2 text-newtextdata text-center">
                  <span class="px-2 inline-flex text-xs  leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    {user?.status}
                  </span>
                </td>

                <td className="px-4 py-2 text-newtextdata whitespace-nowrap flex items-center space-x-2 text-center">
                  {hasPermission(12, 4) && (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setIsViewTaskOpen(true);
                      //setSelectedTask(user);
                      getTaskById(user.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  )}
                  {hasPermission(12, 2) && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => {
                      setIsEditTaskOpen(true);
                      setSelectedTask(user);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  )}

                   {/* {empRole == 1 && ( */}
                  {hasPermission(12, 3) && (
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" 
                   onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this Task?"
                        )
                      ) {
                        handleDelete(user.id);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
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

export default TaskSheduleTable;
