import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";


const ListTableReport = ({
  isViewAnnualReportOpen,
  setViewAnnualReportOpen,
  anualbsplan,
  selectedABP,
  setSelectedABP,
  monthWise,
  setMonthWise,
  userDeatail,
  setIsEditABPModalOpen,
  setAnuEmpId
}) => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();
   //console.log("selectedABP", selectedABP);

   //----------------- Sorting code pm ---------------------//
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

    const sortedAnnualBuisness = useMemo(() => {
    if (!sortConfig.key) return anualbsplan;
    return [...anualbsplan].sort((a, b) => {
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
  }, [anualbsplan, sortConfig]);


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
      <div className="overflow-x-auto custom-scrollbar">
        <table className="table-auto w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap " onClick={() => handleSort("employee.fullname")}
    >
      Employee Name {renderSortIcon("employee.fullname")}
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap "  onClick={() => handleSort("customer.cust_id")}
    >
      Customer Code {renderSortIcon("customer.cust_id")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "  onClick={() => handleSort("customer.company_name")}
    >
      Customer Name {renderSortIcon("customer.company_name")}
              </th>
              {userDeatail?.employeeRole?.role_id === 3 && (
                <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap ">
                  Month
                </th>
              )}
             
              <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAnnualBuisness?.map((user, index) => (
              <tr className="text-center" key={index}>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer" >
                  {user?.employee?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                  {user?.customer?.cust_id}
                </td>
                <td className="px-4 py-2 text-left text-newtextdata whitespace-normal cursor-pointer">
                  {user?.customer?.company_name}
                </td>
                {userDeatail?.employeeRole?.role_id === 3 && (
                  <td className="px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer">
                    {user?.for_month}
                  </td>
                )}
                
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap  space-x-2 text-center">
                  {userDeatail?.employeeRole?.role_id === 1 && (
                    <>
                      {[3, 6, 9, 12].map((month) =>
                        user?.for_months?.includes(month) ? (
                          <button
                            key={month}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                            onClick={() => {
                              //console.log("Clicked:", month); // verify month click
                              setMonthWise(month);
                              //setSelectedABP(user);
                              setAnuEmpId(user?.emp_id);
                              setViewAnnualReportOpen(true);
                            }}
                          >
                            {month} Months
                          </button>
                        ) : null
                      )}
                    </>
                  )}

                  {userDeatail?.employeeRole?.role_id === 3 && (
                    <>
                    {hasPermission(16, 4) && (
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => {
                          setSelectedABP(user);
                          setViewAnnualReportOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    )}
                    {hasPermission(16, 2) && (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                        onClick={() => {
                          setSelectedABP(user);
                          setIsEditABPModalOpen(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    )}
                    </>
                  )}
                  {/* 
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  <FontAwesomeIcon icon={faTrash} />
                </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListTableReport;
