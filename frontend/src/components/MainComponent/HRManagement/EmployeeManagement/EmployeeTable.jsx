import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUsers, removeUser } from "../../../../redux/userSlice";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { SidebarContext } from "../../../../context/sidebarContext";
import { useUserPermissionCheck } from "../../../hooks/useUserPermissionCheck";

const EmployeeTable = ({
  Employees,
  setEditUserModalOpen,
  setViewModalOpen,
  selectedEmployee,
  setSelectedEmployee,
  deleteFlashMessage, // ✅ Get delete message
  deleteFlashMsgType,
  handleDelete, // ✅ Get delete type
}) => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();
  const dispatch = useDispatch();
  const { isSidebarOpen } = useContext(SidebarContext);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = React.useMemo(() => {
    if (!sortConfig.key) return Employees;
    return [...Employees].sort((a, b) => {
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
  }, [Employees, sortConfig]);

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
      <div className={`overflow-x-auto custom-scrollbar max-h-[360px]`}>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] text-center sticky top-0 z-10">
              <th
                className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "
                onClick={() => handleSort("emp_id")}
              >
                Emp ID{renderSortIcon("emp_id")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "
                onClick={() => handleSort("fullname")}
              >
                Name{renderSortIcon("fullname")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "
                onClick={() => handleSort("email")}
              >
                Email{renderSortIcon("email")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "
                onClick={() =>
                  handleSort("jobDetail.reportingManager.fullname")
                }
              >
                Reporting Manager
                {renderSortIcon("jobDetail.reportingManager.fullname")}
              </th>

              <th
                className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "
                onClick={() => handleSort("phone")}
              >
                Phone Number{renderSortIcon("phone")}
              </th>
              <th
                className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "
                onClick={() => handleSort("status")}
              >
                Status{renderSortIcon("status")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Leaves
              </th>

              {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">Role</th> */}
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees?.map((user, index) => (
              <tr key={index} className="">
                {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">{index + 1}</td> */}
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">
                  {user?.emp_id}
                </td>
                <td
                  className="px-4 py-2 text-newtextdata whitespace-nowrap  cursor-pointer"
                  onClick={() => {
                    setSelectedEmployee(user);
                    setViewModalOpen(true);
                  }}
                >
                  {user?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">
                  {user?.email}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">
                  {user?.jobDetail?.reportingManager?.fullname}
                </td>

                <td className="px-4 py-2 text-newtextdata whitespace-nowrap text-center">
                  {user?.phone}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap text-center">
                  {user?.status}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap text-center">
                  5
                </td>

                {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">{user?.employeeRole?.role?.role_name}</td> */}

                <td className="px-4 py-2 text-newtextdata whitespace-nowrap  flex items-center space-x-2">
                  {hasPermission(2, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedEmployee(user);
                        setViewModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                  {hasPermission(2, 2) && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setSelectedEmployee(user);
                        setEditUserModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}
                  {hasPermission(2, 3) && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this employee?"
                          )
                        ) {
                          handleDelete(user?.id);
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

export default EmployeeTable;
