import React, { useEffect, useState, useContext, useMemo } from "react";
import { SidebarContext } from "../../../../context/sidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const DepartmentTable = ({
  setEditUserModalOpen,
  finalizeDealsListData,
  setViewModalOpen,
  setSelectedLead,
  setShowFinlizeDealProduct,
}) => {
  //console.log("setSelectedLead", setSelectedLead);
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

    const sortedPOForm = useMemo(() => {
    if (!sortConfig.key) return finalizeDealsListData;
    return [...finalizeDealsListData].sort((a, b) => {
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
  }, [finalizeDealsListData, sortConfig]);


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
    
    <div className={`overflow-x-auto custom-scrollbar max-h-[360px]`}>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
            {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  whitespace-nowrap ">
              Id
            </th> */}
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  whitespace-nowrap" onClick={()=> handleSort("company_name")}>
                Company Name{renderSortIcon("company_name")}
            </th>
            <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap  whitespace-nowrap" onClick={()=> handleSort("total_deal_amount")}>
              Deal Amount{renderSortIcon("total_deal_amount")}
            </th>
            <th className="px-4 py-2 text-center text-bgDataNew text-newtextdata whitespace-nowrap  whitespace-nowrap" onClick={()=> handleSort("total_advance_amount")}>
              Advance Amount{renderSortIcon("total_advance_amount")}
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  whitespace-nowrap">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPOForm?.map((user, index) => (
            <tr key={index} className="text-left">
              {/* <td className="px-4 py-2 text-newtextdata">{index + 1}</td> */}
              <td className="px-4 py-2 text-newtextdata">
                {user?.company_name}
              </td>
              <td className="px-4 py-2 text-newtextdata text-center">
                ₹{user?.total_deal_amount}
              </td>
              <td className="px-4 py-2 text-newtextdata text-center">
                ₹{user?.total_advance_amount}
              </td>
              <td className="px-4 py-2 text-newtextdata">
                {" "}
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedLead(user);
                    setShowFinlizeDealProduct(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default DepartmentTable;
