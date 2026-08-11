import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const getAuthToken = () => localStorage.getItem("token");

const EditOutTour = ({
  setIsEditOutTourOpen,
  editFormData,
  setEditFormData,
  editFormErrors,
  setEditFormErrors,
  editFlashMessage,
  editFlashMsgType,
  handleEditFlashMessage,
  handleEditChange,
  handleEditDetailChange,
  handleEditExpenseChange,
  validateEditInputs,
  handleEditOutTourSubmit,
  allusers,
}) => {
  //console.log("costWorkingData", costWorkingData);

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px]  rounded-[6px]">
          <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit OutTour Expenses
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {editFlashMessage && editFlashMsgType === "success" && (
              <SuccessMessage message={editFlashMessage} />
            )}
            {editFlashMessage && editFlashMsgType === "error" && (
              <ErrorMessage message={editFlashMessage} />
            )}
          </div>
          {/* New Code */}
          {/* New Code */}
          <div className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* General Information */}
            <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
              DIMPLE CHEMICALS & SERVICES PVT LTD
              <br />
              <span className="text-gray-700 text-[18px]">
                OUT TOUR EXPENSES APPROVAL
              </span>
            </h3>

            <div className="border border-gray-400 mx-[2px]">
              <div className="w-100 flex items-start justify-between px-0">
                <div className="bg-[#e5e7eb38] rounded-[5px] w-[500px]">
                  <table className="w-full border border-gray-300 text-sm table-fixed">
                    <tbody>
                      {/* Employee Name Dropdown */}
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600 w-[40%]">
                          Name of Employee
                        </td>
                        <td className="py-2 text-right align-middle w-[5%]">
                          :
                        </td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24 w-[55%]">
                          <select
                            name="employee_id"
                            value={editFormData.employee_id}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                          >
                            <option value="">Select Employee</option>
                            {allusers?.data?.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.fullname}
                              </option>
                            ))}
                          </select>
                          {editFormErrors.employee_id && (
                            <p className="text-red-500 text-sm">
                              {editFormErrors.employee_id}
                            </p>
                          )}
                        </td>
                      </tr>

                      {/* Person Accompanied */}
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Person Accompanied
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          <input
                            type="text"
                            name="person_accompanied"
                            value={editFormData.person_accompanied}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter the person"
                          />
                        </td>
                      </tr>

                      {/* Place of Visit */}
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Place of Visit
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          <input
                            type="text"
                            name="place_of_visit"
                            value={editFormData.place_of_visit}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter the place"
                          />
                          {editFormErrors.place_of_visit && (
                            <p className="text-red-500 text-sm">
                              {editFormErrors.place_of_visit}
                            </p>
                          )}
                        </td>
                      </tr>

                      {/* Period of Visit */}
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Period of Visit (From/To)
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          <input
                            type="date"
                            name="period_of_visit_from_date"
                            value={editFormData.period_of_visit_from_date}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter period in days"
                            min={new Date().toISOString().split("T")[0]}
                          />
                          {editFormErrors.period_of_visit_from_date && (
                            <p className="text-red-500 text-sm">
                              {editFormErrors.period_of_visit_from_date}
                            </p>
                          )}
                          <input
                            type="date"
                            name="period_of_visit_to_date"
                            value={editFormData.period_of_visit_to_date}
                            onChange={handleEditChange}
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter period in days"
                            min={new Date().toISOString().split("T")[0]}
                          />
                          {editFormErrors.period_of_visit_to_date && (
                            <p className="text-red-500 text-sm">
                              {editFormErrors.period_of_visit_to_date}
                            </p>
                          )}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Period of Visit (in days)
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {editFormData.period_of_visit}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Materials Table */}
              <div className="overflow-x-auto custom-scrollbar mt-8">
                {/* New Code */}
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-400">
                    <tr className="bg-gray-300 text-center">
                      <td colSpan="9" className="py-2 relative">
                        <div className="mb-1 border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700">
                          Details of Visit
                        </div>
                        <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[15px] text-gray-600">
                          Expected Potential (In Rupees)
                        </div>
                        <div className="absolute right-4 top-4">
                          <button
                            type="button"
                            onClick={() =>
                              setEditFormData((prev) => ({
                                ...prev,
                                details: [
                                  ...prev.details,
                                  { date: "", place_of_visit: "", purpose: "" },
                                ],
                              }))
                            }
                            className="bg-bgDataNew text-white px-2 py-1 rounded hover:bg-orange-600"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      {[
                        "S.N.",
                        "Date",
                        "Place of Visit",
                        "Purpose of Visit",
                        "Action",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                            header === "S.N." ? "text-left" : "text-center"
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {editFormData.details.map((item, index) => (
                      <tr
                        key={index}
                        className="text-center hover:bg-gray-200 cursor-pointer"
                      >
                        <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                          {index + 1}
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleEditDetailChange(
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                          />
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                          <input
                            type="text"
                            value={item.place_of_visit}
                            onChange={(e) =>
                              handleEditDetailChange(
                                index,
                                "place_of_visit",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter the Place"
                          />
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                          <input
                            type="text"
                            value={item.purpose}
                            onChange={(e) =>
                              handleEditDetailChange(
                                index,
                                "purpose",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Enter the Purpose"
                          />
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedDetails =
                                editFormData.details.filter(
                                  (_, i) => i !== index
                                );
                              setEditFormData((prev) => ({
                                ...prev,
                                details: updatedDetails,
                              }));
                            }}
                            className="bg-bgDataNew text-white px-2 py-1 rounded hover:bg-orange-600"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="min-w-full border border-gray-300 mt-8">
                  <thead className="bg-gray-400">
                    <tr className="bg-gray-300 text-center">
                      <td colSpan="9" className="py-2 relative">
                        <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700">
                          Expenses Budget
                        </div>
                        <div className="absolute right-4 top-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditFormData((prev) => ({
                                ...prev,
                                expenses: [
                                  ...prev.expenses,
                                  { description: "", amount: "" },
                                ],
                              }))
                            }
                            className="bg-bgDataNew text-white px-2 py-1 rounded hover:bg-orange-600"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      {["S.N.", "Description", "Amount", "Action"].map(
                        (header, index) => (
                          <th
                            key={index}
                            className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                              header === "S.N." ? "text-left" : "text-center"
                            }`}
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {editFormData.expenses.map((item, index) => (
                      <tr
                        key={index}
                        className="text-center hover:bg-gray-200 cursor-pointer"
                      >
                        <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                          {index + 1}
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center w-[400px]">
                          <select
                            value={item.description}
                            onChange={(e) =>
                              handleEditExpenseChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-[7px] border border-gray-400 rounded"
                          >
                            <option value="">Select Expense Type</option>
                            <option>TRAVELING EXP.</option>
                            <option>LODGING & BOARDING</option>
                            <option>PRINTING & STATIONARY</option>
                            <option>FOOD EXPENSES</option>
                            <option>COMPANY CAR EXP.</option>
                            <option>PURCHASES</option>
                            <option>OTHER</option>
                          </select>
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center w-[500px]">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) =>
                              handleEditExpenseChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                             min="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="Enter amount"
                          />
                        </td>

                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedExpenses =
                                editFormData.expenses.filter(
                                  (_, i) => i !== index
                                );
                              setEditFormData((prev) => ({
                                ...prev,
                                expenses: updatedExpenses,
                              }));
                            }}
                            className="bg-bgDataNew text-white px-2 py-1 rounded hover:bg-orange-600"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                      <td
                        className="border font-semibold text-bgDataNew border-gray-300 px-4 py-2 text-textdata text-center w-[500px]"
                        colSpan="1"
                      >
                        Total
                      </td>
                      <td className="border font-semibold text-bgDataNew border-gray-300 px-4 py-2 text-textdata text-center w-[500px]">
                        {editFormData.expenses
                          .reduce(
                            (total, item) =>
                              total + (parseFloat(item.amount) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="w-100 flex items-start justify-between px-0">
                <div className="bg-[#e5e7eb38] rounded-[5px] w-100">
                  <table className="w-full border border-gray-300 text-sm table-fixed">
                    <tbody>
                      {/* Prepared By | Checked By | Approved By in a single row */}
                      <tr className="border-b border-gray-200">
                        {/* Prepared By */}
                        <td
                          className="py-2 px-4 text-left font-bold text-gray-600"
                          colSpan={2}
                        >
                          Prepared By
                          <div className="mt-1">
                            <textarea
                              name="prepared_by"
                              rows={6}
                              className="w-full px-2 py-1 border border-gray-400 rounded"
                              placeholder="Prepared By"
                              value={editFormData.prepared_by}
                              onChange={handleEditChange}
                            />
                            {editFormErrors.prepared_by && (
                              <p className="text-red-500 text-sm">
                                {editFormErrors.prepared_by}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Checked By */}
                        {/* <td
                        className="py-2 px-4 text-left font-bold text-gray-600"
                        colSpan={2}
                      >
                        Checked By
                        <div className="mt-1">
                          <textarea
                            name="checked_by"
                            rows={6}
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                            placeholder="Checked By"
                            value={editFormData.checked_by}
                            onChange={handleEditChange}
                          />
                          {editFormErrors.checked_by && (
                            <p className="text-red-500 text-sm">
                              {editFormErrors.checked_by}
                            </p>
                          )}
                        </div>
                      </td> */}

                        {/* Approved By */}
                        <td
                          className="py-2 px-4 text-left font-bold text-gray-600"
                          colSpan={2}
                        >
                          Approved By
                          <div className="mt-1">
                            <textarea
                              name="approved_by"
                              rows={6}
                              className="w-full px-2 py-1 border border-gray-400 rounded"
                              placeholder="Approved By"
                              value={editFormData.approved_by}
                              onChange={handleEditChange}
                            />
                            {editFormErrors.approved_by && (
                              <p className="text-red-500 text-sm">
                                {editFormErrors.approved_by}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
            </div>
          </div>

          {/* Submit and Close Buttons */}
          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              type="submit"
              className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
              onClick={handleEditOutTourSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsEditOutTourOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditOutTour;
