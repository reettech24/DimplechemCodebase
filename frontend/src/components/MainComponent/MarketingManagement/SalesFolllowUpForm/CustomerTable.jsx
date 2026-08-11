import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCustomers, removeCustomer } from "../../../../redux/customerSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CustomerTable = ({
  customers,
  selectedCustomer,
  setSelectedCustomer,
  userDeatail,
}) => {
  const navigate = useNavigate();
  //console.log("userDeatail", userDeatail);
  return (
    <>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 accent-orange-500"
                />
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Id
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Cust Id
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Company Name
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Email
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Phone Number
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((user, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-500"
                  />
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">{index + 1}</td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">{user.cust_id}</td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">
                  {user.company_name}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">{user.email_id}</td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap ">
                  {user.primary_contact}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap  space-x-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      navigate(`/sale-management/lead-management/${user?.id}`);
                    }}
                  >
                    View All Leads
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

export default CustomerTable;
