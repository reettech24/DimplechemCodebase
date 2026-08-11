import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const CustomerTable = ({
  customers,
  setEditCustomerModalOpen,
  setViewModalOpen,
  setSelectedCustomer,
  deleteFlashMessage,
  deleteFlashMsgType,
  handleDelete,
  userDeatail,
}) => {
  const navigate = useNavigate();
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  console.log("new final customers", customers);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = useMemo(() => {
    if (!sortConfig.key) return customers;
    return [...customers].sort((a, b) => {
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
  }, [customers, sortConfig]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  if (isLoading) return <div>Loading permissions...</div>;
  if (isError) return <div>Error loading permissions</div>;

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

      <div className="overflow-x-auto custom-scrollbar max-h-[360px]">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 accent-orange-500"
                />
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Id
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={() => handleSort("cust_id")}>
                Cust Id{renderSortIcon("cust_id")}
              </th>
              <th
                className="px-4 py-2 text-bgDataNew text-newtextdata cursor-pointer"
                onClick={() => handleSort("company_name")}
              >
                Company Name{renderSortIcon("company_name")}
              </th>
              <th
                className="px-4 py-2 text-bgDataNew text-newtextdata cursor-pointer"
                onClick={() => handleSort("email_id")}
              >
                Email{renderSortIcon("email_id")}
              </th>
              <th
                className="px-4 py-2 text-bgDataNew text-newtextdata cursor-pointer"
                onClick={() => handleSort("primary_contact")}
              >
                Phone Number{renderSortIcon("primary_contact")}
              </th>
              <th
                className="px-4 py-2 text-bgDataNew text-newtextdata cursor-pointer"
                onClick={() => handleSort("secondary_contact")}
              >
                Secondary Number{renderSortIcon("secondary_contact")}
              </th>
              <th className="px-4 py-2 text-bgDataNew text-newtextdata">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers?.map((user, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-newtextdata">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-500"
                  />
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">{index + 1}</td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">
                  {user.cust_id}
                </td>
                <td
                  className="relative group px-4 py-2 text-newtextdata cursor-pointer"
                  onClick={() => {
                    setSelectedCustomer(user);
                    setViewModalOpen(true);
                  }}
                >
                  {(() => {
                    const companyName = user.company_name || "";
                    const words = companyName.split(" ");
                    return words.length > 2
                      ? `${words.slice(0, 2).join(" ")}...`
                      : companyName;
                  })()}

                  {/* Tooltip */}
                  {(() => {
                    const companyName = user.company_name || "";
                    const words = companyName.split(" ");
                    const tooltipWidth =
                      words.length === 6 ? "w-[300px]" : "w-auto";
                    return (
                      <div
                        className={`absolute z-10 hidden group-hover:block bg-white text-gray-800 text-sm text-center rounded-md px-3 py-1 top-10 left-[75%] -translate-x-1/2 whitespace-normal ${tooltipWidth} shadow-lg`}
                      >
                        {companyName}
                      </div>
                    );
                  })()}
                </td>
                <td className="px-4 py-2 text-newtextdata">{user.email_id}</td>
                <td className="px-4 py-2 text-newtextdata text-center">
                  {user.primary_contact}
                </td>
                <td className="px-4 py-2 text-newtextdata text-center">
                  {user.secondary_contact}
                </td>
                <td className="px-4 py-2 text-newtextdata space-x-2 text-center">
                  {hasPermission(3, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedCustomer(user);
                        setViewModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                  {hasPermission(3, 2) && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setSelectedCustomer(user);
                        setEditCustomerModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}
                  {hasPermission(3, 3) && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this customer?"
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

export default CustomerTable;
