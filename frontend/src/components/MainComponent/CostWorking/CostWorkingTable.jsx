import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const CostWorkingTable = ({
  setEditCostWorkingModalOpen,
  CostWorkings,
  setViewCostWorkingModalOpen,
  setSelectedCostWorking,
  selectedCostWorking,
  deleteFlashMessage,
  deleteFlashMsgType,
  handleDeleteFlashMessage,
  handleDelete,
}) => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();

  //console.log("CostWorkings", CostWorkings);

  //----------------- Sorting code pm ---------------------//
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedcostworking = useMemo(() => {
    if (!sortConfig.key) return CostWorkings;
    return [...CostWorkings].sort((a, b) => {
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
  }, [CostWorkings, sortConfig]);

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
      <div className="overflow-x-auto custom-scrollbar w-full max-h-[360px]">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-left sticky top-0 z-10">
              {/* <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
                Id
              </th> */}
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("company.company_name")}
              >
                Company Name{renderSortIcon("company.company_name")}
              </th>
              {/* <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">Location</th> */}
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("nature_of_work")}
              >
                Nature of Work {renderSortIcon("nature_of_work")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("technology_used")}
              >
                Technology used {renderSortIcon("technology_used")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("estimate_no")}
              >
                Estimate no {renderSortIcon("estimate_no")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("estimate_date")}
              >
                Estimate date {renderSortIcon("estimate_date")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("revision_no")}
              >
                Revision no {renderSortIcon("revision_no")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap "
                onClick={() => handleSort("revision_date")}
              >
                Revision date {renderSortIcon("revision_date")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedcostworking?.map((user, index) => (
              <tr key={index} className="text-center">
                {/* <td className="px-4 py-2 text-newtextdata">{index + 1}</td> */}
                <td className="relative text-left group px-4 py-2 text-newtextdata">
                  {/* {user?.company?.company_name} */}
                  {(() => {
                    const companyName = user?.company?.company_name || "";
                    const words = companyName.split(" ");
                    return words.length > 2
                      ? `${words.slice(0, 2).join(" ")}...`
                      : companyName;
                  })()}

                  {/* Tooltip on hover */}
                  {(() => {
                    const companyName = user?.company?.company_name || "";
                    const words = companyName.split(" ");
                    const tooltipWidth =
                      words.length === 6 ? "w-[300px]" : "w-auto";

                    return (
                      <div
                        className={`absolute z-10 hidden group-hover:block bg-white text-gray-800 text-sm text-justify rounded-md px-3 py-1 top-10 left-[75%] -translate-x-1/2 whitespace-normal ${tooltipWidth} shadow-lg text-center`}
                      >
                        {companyName}
                      </div>
                    );
                  })()}
                </td>
                {/* <td className="px-4 py-2 text-newtextdata">{user?.location}</td> */}
                <td className="px-4 py-2 text-newtextdata">
                  {/* {user?.nature_of_work} */}
                  {(() => {
                    const natureWork = user?.nature_of_work || "";
                    const words = natureWork.split(" ");
                    return words.length > 2
                      ? `${words.slice(0, 2).join(" ")}...`
                      : natureWork;
                  })()}

                  {/* Tooltip on hover */}
                  {(() => {
                    const natureWork = user?.nature_of_work || "";
                    const words = natureWork.split(" ");
                    const tooltipWidth =
                      words.length === 3 ? "w-[300px]" : "w-auto";

                    return (
                      <div
                        className={`absolute z-10 hidden group-hover:block bg-white text-gray-800 text-sm text-justify rounded-md px-3 py-1 top-10 left-[75%] -translate-x-1/2 whitespace-normal ${tooltipWidth} shadow-lg text-center`}
                      >
                        {natureWork}
                      </div>
                    );
                  })()}
                </td>
                <td className="px-4 py-2 text-newtextdata text-left">
                  {user?.technology_used}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.estimate_no}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.estimate_date.split("T")[0]}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.revision_no}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.revision_date ? user.revision_date.split("T")[0] : ""}
                </td>

                <td className="px-4 py-2 text-newtextdata whitespace-nowrap flex items-center space-x-2 text-center">
                  {hasPermission(15, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedCostWorking(user);
                        setViewCostWorkingModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}

                  {/* {user?.edit === true && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setSelectedCostWorking(user);
                        setEditCostWorkingModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )} */}

                  {hasPermission(15, 2) && (
                    <button
                      className={`px-3 py-1 rounded ${
                        user?.edit
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (user?.edit) {
                          setSelectedCostWorking(user);
                          setEditCostWorkingModalOpen(true);
                        }
                      }}
                      disabled={!user?.edit}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}

                  {hasPermission(15, 3) && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      // onClick={() => {
                      //   if (
                      //     window.confirm(
                      //       "Are you sure you want to delete this CostWorking?"
                      //     )
                      //   ) {
                      //     handleDelete(user.id);
                      //   }
                      // }}
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

export default CostWorkingTable;
