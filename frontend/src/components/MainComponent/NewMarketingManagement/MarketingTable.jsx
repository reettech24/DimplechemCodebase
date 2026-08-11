import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const MarketingTable = ({
  setIsEditMarketing,
  setIsViewMarketing,
  mktData,
  setSelectedMarketing,
  handleDelete,
  deleteFlashMessage,
  deleteFlashMsgType,
  getMarketingById,
}) => {
  const { hasPermission } = useUserPermissionCheck();

  //----------------- Sorting code pm ---------------------//
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

    const sortedmarketing = useMemo(() => {
    if (!sortConfig.key) return mktData;
    return [...mktData].sort((a, b) => {
      const aValue =
        sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], a)
          : a[sortConfig.key];
      const bValue =
        sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], b)
          : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [mktData, sortConfig]);


   const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

   //----------------- Sorting code pm ---------------------//


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
      <div className="overflow-x-auto custom-scrollbar max-max-h-[360px] w-full">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-center sticky top-0 z-10">
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata" onClick={() => handleSort("id")}
    >
      Id {renderSortIcon("id")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap " onClick={() => handleSort("activity_planned")}
    >
      Activity Planned {renderSortIcon("activity_planned")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap " onClick={() => handleSort("activity_date")}
    >
      Activity Date {renderSortIcon("activity_date")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "  onClick={() => handleSort("complete_date")}
    >
      Completion Date {renderSortIcon("complete_date")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap " onClick={() => handleSort("total_spent")}
    >
      Total Spent {renderSortIcon("total_spent")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap " onClick={() => handleSort("lead_generated")}
    >
      Lead Generated {renderSortIcon("lead_generated")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap " onClick={() => handleSort("assignedUser.fullname")}
    >
      Assigned To {renderSortIcon("assignedUser.fullname")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedmarketing?.map((item) => (
              <tr key={item.id} className="text-left">
                <td className="px-4 py-2 text-newtextdata">
                  {"MKT00" + item.id}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item.activity_planned}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item.activity_date}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item.complete_date}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item.total_spent}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item.lead_generated}
                </td>

                <td className="px-4 py-2 text-newtextdata">
                  {item.assignedUser?.fullname}
                </td>

                <td className="px-4 py-2 text-newtextdata whitespace-nowrap flex items-center space-x-2 text-center">
                  {hasPermission(5, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setIsViewMarketing(item);
                        getMarketingById(item.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                  {hasPermission(5, 2) && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setIsEditMarketing(true);
                        setSelectedMarketing(item);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}
                  {hasPermission(5, 3) && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this Marketing?"
                          )
                        ) {
                          handleDelete(item.id);
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

export default MarketingTable;
