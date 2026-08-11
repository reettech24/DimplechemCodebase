import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts, removeProduct } from "../../../redux/productSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const ProductTable = ({
  Products,
  setEditProductModalOpen,
  setViewModalOpen,
  selectedProduct,
  setSelectedProduct,
  setIsAssignModalOpen,
  deleteFlashMessage,
  deleteFlashMsgType,
  handleDeleteFlashMessage,
  handleDeactive,
}) => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();

  const dispatch = useDispatch();

  //----------------- Sorting code pm ---------------------//
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    if (!sortConfig.key) return Products;
    return [...Products].sort((a, b) => {
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
  }, [Products, sortConfig]);

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
      <div className="overflow-x-auto custom-scrollbar max-h-[360px]">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
              {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap"></th> */}
              {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                Id
              </th> */}
              <th
                className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap"
                onClick={() => handleSort("product_name")}
              >
                Product{renderSortIcon("product_name")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("category.category_name")}
      >
        Category {renderSortIcon("category.category_name")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("HSN_code")}
      >
        HSN Code {renderSortIcon("HSN_code")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap"  onClick={() => handleSort("stock")}
      >
        Stock {renderSortIcon("stock")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("unit")}
      >
        Unit {renderSortIcon("unit")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("rate")}
      >
        Rate {renderSortIcon("rate")}
              </th>
              <th className="px-4 py-2 text-center text-bgDataNew text-textdata whitespace-nowrap" onClick={() => handleSort("area_mtr2")}
      >
        Consumption/Sq. Mtr. {renderSortIcon("area_mtr2")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("status")}
      >
        Status {renderSortIcon("status")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts?.map((product, index) => (
              <tr key={index}>
                {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-500"
                  />
                </td> */}
                {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap">{index + 1}</td> */}
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                  {product.product_name}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                  {product?.category?.category_name || "-"}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                  {product.HSN_code}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                  {product.stock}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                  {product.unit}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                  {product.rate}
                </td>
                <td className="px-4 py-2 text-center text-newtextdata whitespace-nowrap">
                  {product.area_mtr2}
                </td>
                <td className="text-center">
                  {hasPermission(11, 3) && (
                    <button
                      className={`${
                        product.status === 1 ? "bg-green-500" : "bg-red-500"
                      } text-white px-3 text-center py-1 rounded hover:bg-red-600 text-[12px]`}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to deactive this Product?"
                          )
                        ) {
                          handleDeactive(product.id);
                        }
                      }}
                    >
                      {product.status == 1 ? "Active" : "Inactive"}
                    </button>
                  )}
                </td>
                <td className="flex items-center gap-2 px-4 py-2 text-newtextdata whitespace-nowrap">
                  {" "}
                  {hasPermission(11, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedProduct(product);
                        setViewModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                  {hasPermission(11, 2) && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditProductModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}
                  {/* <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this Product?"
                        )
                      ) {
                        handleDelete(product.id);
                      }
                    }}
                  >
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

export default ProductTable;
