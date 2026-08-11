import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const OutTourTable = ({
  setIsEditOutTourOpen,
  setIsViewOutTourOpen,
  outTourExpData,
  selectedOutTour,
  setSelectedOutTour,
  handleDelete,
  deleteFlashMessage,
  deleteFlashMsgType,
  empRole,
}) => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();
  //console.log("outTourExpData",outTourExpData);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOutTour = useMemo(() => {
    if (!sortConfig.key) return outTourExpData;
    return [...outTourExpData].sort((a, b) => {
      const aValue = sortConfig.key.includes(".")
        ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], a)
        : a[sortConfig.key];
      const bValue = sortConfig.key.includes(".")
        ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], b)
        : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [outTourExpData, sortConfig]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

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
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("employee.fullname")}
              >
                Employee Name{renderSortIcon("employee.fullname")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("person_accompanied")}
              >
                Person Accompanied {renderSortIcon("person_accompanied")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap " onClick={() => handleSort("place_of_visit")}
          >
            Place of Visit {renderSortIcon("place_of_visit")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "  onClick={() => handleSort("period_of_visit")}
          >
            Period of Visit {renderSortIcon("period_of_visit")}
              </th>
              {empRole == 1 && (
                <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                  Amount
                </th>
              )}

              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedOutTour?.map((item, index) => (
              <tr key={item.id} className="text-left">
                <td className="px-4 py-2 text-newtextdata">{index + 1}</td>
                <td className="px-4 py-2 text-newtextdata">
                  {item?.employee?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item?.person_accompanied}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item?.place_of_visit}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {item?.period_of_visit}
                </td>
                {empRole == 1 && (
                  <td className="px-4 py-2 text-newtextdata">
                    ₹ {item?.total_expenses?.toFixed(2)}
                  </td>
                )}

                <td className="px-4 py-2 text-newtextdata whitespace-nowrap flex items-center space-x-2 text-center">
                  {hasPermission(13, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedOutTour(item); // if you need to pass data
                        setIsViewOutTourOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}

                  {hasPermission(13, 2) && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setSelectedOutTour(item);
                        setIsEditOutTourOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}

                  {hasPermission(13, 3) && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure, you want to delete this OutTour Expensess?"
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

export default OutTourTable;
