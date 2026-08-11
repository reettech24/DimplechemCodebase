import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const LocalOutTourTable = ({
  setIslocalEditOutTourOpen,
  setIslocalViewOutTourOpen,
  localTourExpData,
  selectedExpense,
  setSelectedExpense,
  handleDelete,
  deleteFlashMessage,
  deleteFlashMsgType,
  empRole,
}) => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();
  //console.log("localTourExpData", localTourExpData);

   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

    const sortedlocalTour = useMemo(() => {
    if (!sortConfig.key) return localTourExpData;
    return [...localTourExpData].sort((a, b) => {
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
  }, [localTourExpData, sortConfig]);


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
              <th className="px-4 py-2 text-center text-bgDataNew text-textdata">
                Id
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap" onClick={() => handleSort("employee.fullname")}>
                Employee Name{renderSortIcon("employee.fullname")}
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-textdata whitespace-nowrap" onClick={() => handleSort("place_of_visit")}
          >
            Place of Visit {renderSortIcon("place_of_visit")}
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-textdata whitespace-nowrap"   onClick={() => handleSort("period_of_expenses")}
          >
            Period of Expenses {renderSortIcon("period_of_expenses")}
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-textdata whitespace-nowrap" onClick={() => handleSort("bank_account_no")}
          >
            Bank Account No. {renderSortIcon("bank_account_no")}
              </th>
               {empRole==1 && (
              <th className="px-4 py-2 text-center text-bgDataNew text-textdata whitespace-nowrap">
                Total
              </th>
               )}
              <th className="px-4 py-2 text-left text-bgDataNew text-textdata whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedlocalTour?.map((item, index) => {
              const totalSum = item.details.reduce((sum, detail) => {
                return sum + parseFloat(detail.total || 0);
              }, 0);

              return (
                <tr key={item.id} className="text-center">
                  <td className="px-4 py-2 text-newtextdata">{index + 1}</td>
                  <td className="px-4 py-2 text-newtextdata text-left">
                    {item?.employee?.fullname}
                  </td>
                  <td className="px-4 py-2 text-newtextdata">
                    {item.place_of_visit}
                  </td>
                  <td className="px-4 py-2 text-newtextdata">
                    {item.period_of_expenses}
                  </td>
                  <td className="px-4 py-2 text-newtextdata">
                    {item.bank_account_no}
                  </td>
                  {empRole==1 && (
                  <td className="px-4 py-2 text-newtextdata">{totalSum}</td>
                   )}

                  <td className="px-4 py-2 text-newtextdata whitespace-nowrap flex items-center space-x-2 text-center">
                    {hasPermission(14, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedExpense(item); // if you need to pass data
                        setIslocalViewOutTourOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    )}
                    {hasPermission(14, 2) && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setSelectedExpense(item);
                        setIslocalEditOutTourOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    )}
                    {hasPermission(14, 3) && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this Local OutTour Expensess?"
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
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LocalOutTourTable;
