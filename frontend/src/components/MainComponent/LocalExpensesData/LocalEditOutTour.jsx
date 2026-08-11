import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const LocalEditOutTour = ({
  setIslocalEditOutTourOpen,
  editFormData,
  setEditFormData,
  editFormErrors,
  editFlashMessage,
  editFlashMsgType,
  handleEditChange,
  handleEditDetailChange,
  handleEditLocalExpenseSubmit,
  allusers,
}) => {
  const addRow = () => {
    setEditFormData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        {
          date: "",
          particulars: "",
          travelling_exp: 0.0,
          loading_boarding: 0.0,
          printing_stationery: 0.0,
          food_expenses: 0.0,
          company_car_exp: 0.0,
          purchases: 0.0,
          other: 0.0,
        },
      ],
    }));
  };

  const deleteRow = (index) => {
    const newDetails = [...editFormData.details];
    newDetails.splice(index, 1);
    setEditFormData((prev) => ({ ...prev, details: newDetails }));
  };

  const calculateRowTotal = (item) => {
    return (
      Number(item.travelling_exp || 0) +
      Number(item.loading_boarding || 0) +
      Number(item.printing_stationery || 0) +
      Number(item.food_expenses || 0) +
      Number(item.company_car_exp || 0) +
      Number(item.purchases || 0) +
      Number(item.other || 0)
    ).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return editFormData.details
      .reduce(
        (sum, curr) =>
          sum +
          Number(curr.travelling_exp || 0) +
          Number(curr.loading_boarding || 0) +
          Number(curr.printing_stationery || 0) +
          Number(curr.food_expenses || 0) +
          Number(curr.company_car_exp || 0) +
          Number(curr.purchases || 0) +
          Number(curr.other || 0),
        0
      )
      .toFixed(2);
  };

  const calculateColumnTotal = (field) => {
    return editFormData.details
      .reduce((sum, curr) => sum + parseFloat(curr[field] || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1500px] rounded-[6px]">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Edit Local Expenses
        </h2>

        <div className="fixed top-5 right-5 z-50">
          {editFlashMessage && editFlashMsgType === "success" && (
            <SuccessMessage message={editFlashMessage} />
          )}
          {editFlashMessage && editFlashMsgType === "error" && (
            <ErrorMessage message={editFlashMessage} />
          )}
        </div>

        <div className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* General Information */}
          <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
            DIMPLE CHEMICALS & SERVICES PVT LTD
            <br />
            <span className="text-gray-700 text-[18px]">
              OUTSTATION / LOCAL EXPENSES STATEMENT
            </span>
          </h3>
          <div className="border border-gray-400 mx-[2px]">
            <div className="w-100 flex items-start justify-between px-0">
              <div className="bg-[#e5e7eb38] rounded-[5px] w-[500px]">
                <table className="w-full border border-gray-300 text-sm table-fixed">
                  <tbody>
                    {/* Employee Name */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600 w-[40%]">
                        Name of Employee
                      </td>
                      <td className="py-2 text-right align-middle w-[5%]">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24 w-[55%]">
                        <select
                          name="employee_id"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          value={editFormData.employee_id}
                          onChange={handleEditChange}
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

                    {/* Period of Expenses */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Period of Expenses
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="text"
                          name="period_of_expenses"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Period of Expenses"
                          value={editFormData.period_of_expenses}
                          onChange={handleEditChange}
                        />
                        {editFormErrors.period_of_expenses && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.period_of_expenses}
                          </p>
                        )}
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
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Place of Visit"
                          value={editFormData.place_of_visit}
                          onChange={handleEditChange}
                        />
                        {editFormErrors.place_of_visit && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.place_of_visit}
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Bank A/C No. */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Bank A/C No.
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="text"
                          name="bank_account_no"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Bank A/C No."
                          value={editFormData.bank_account_no}
                          onChange={handleEditChange}
                        />
                        {editFormErrors.bank_account_no && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.bank_account_no}
                          </p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Add Button */}
            <div className="relative">
              <div className="absolute right-2 top-6">
                <span className="bg-gray-500 text-white rounded-l-[5px] px-4 py-[6.2px] mr-[0.5px]">
                  Please click Plus Button to add the row
                </span>
                <button
                  type="button"
                  onClick={addRow}
                  className="bg-bgDataNew text-white px-2 py-1 rounded-r-[5px] hover:bg-orange-600"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar mt-16">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-400">
                  <tr className="bg-gray-300 text-center">
                    <td colSpan="12" className="py-2 relative">
                      <div className="mb-1 border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700">
                        Expense Details of Visit
                      </div>
                      <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[15px] text-gray-600">
                        Amount in Rupees
                      </div>
                    </td>
                  </tr>
                  <tr>
                    {[
                      "S.N.",
                      "Date",
                      "Particulars",
                      "Travelling Exp.",
                      "Loading & Boarding",
                      "Printing & Stationary",
                      "Food Expenses",
                      "Company Car Exp.",
                      "Purchases",
                      "Other",
                      "Total",
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
                      <td className="border border-gray-300 px-4 py-2 text-left">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
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
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={item.particulars}
                          onChange={(e) =>
                            handleEditDetailChange(
                              index,
                              "particulars",
                              e.target.value
                            )
                          }
                          placeholder="Particular"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                        />
                      </td>
                      {[
                        "travelling_exp",
                        "loading_boarding",
                        "printing_stationery",
                        "food_expenses",
                        "company_car_exp",
                        "purchases",
                        "other",
                      ].map((field, i) => (
                        <td
                          key={i}
                          className="border border-gray-300 px-4 py-2"
                        >
                          <input
                            type="number"
                            value={item[field]}
                            onChange={(e) =>
                              handleEditDetailChange(
                                index,
                                field,
                                parseFloat(e.target.value) || 0
                              )
                            }
                             min="0"
                            className="w-full px-2 py-1 border border-gray-400 rounded"
                          />
                        </td>
                      ))}
                      <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-800">
                        {calculateRowTotal(item)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => deleteRow(index)}
                          className="bg-bgDataNew text-white px-2 py-1 rounded hover:bg-orange-600"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td
                      colSpan={2}
                      className="border border-gray-300 px-4 py-2 text-left"
                    ></td>
                    <td className="border font-semibold text-bgDataNew border-gray-300 px-4 py-2 text-center">
                      Total:
                    </td>
                    {[
                      "travelling_exp",
                      "loading_boarding",
                      "printing_stationery",
                      "food_expenses",
                      "company_car_exp",
                      "purchases",
                      "other",
                    ].map((field, i) => (
                      <td
                        key={i}
                        className="border font-semibold border-gray-300 px-4 py-2"
                      >
                        {calculateColumnTotal(field)}
                      </td>
                    ))}
                    <td className="border font-semibold text-bgDataNew border-gray-300 px-4 py-2">
                      {calculateGrandTotal()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-100 flex items-start justify-between px-0">
              <div className="bg-[#e5e7eb38] rounded-[5px] w-100">
                <table className="w-full border border-gray-300 text-sm table-fixed">
                  <tbody>
                    {/* Recon of Bank A/C */}
                    <tr className="border-b border-gray-200">
                      <td  colSpan={2} className="py-2 px-4 text-center font-bold text-gray-900">
                       <h1>Reconciliation of Bank A/c </h1>{" "}
                      </td>
                        <td
                          className="py-2 px-4 text-center font-bold text-gray-900"
                        >
                          
                        </td>
                     
                    </tr>

                    {/* Bank A/C Limit */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Bank A/C Limit
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="number"
                          name="bank_ac_limit"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Bank A/C Limit"
                          value={editFormData.bank_ac_limit}
                          onChange={handleEditChange}
                           min="0"
                        />
                        {editFormErrors.bank_ac_limit && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.bank_ac_limit}
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Petty Cash Submitted On */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Petty Cash Submitted On
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="number"
                          name="petty_cash_sub_on"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          value={editFormData.petty_cash_sub_on}
                          onChange={handleEditChange}
                           min="0"
                        />
                        {editFormErrors.petty_cash_sub_on && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.petty_cash_sub_on}
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Petty Cash Pending for Reload */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Petty Cash Pending for Reload
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="number"
                          name="petty_cash_pending_for_reload"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Pending for Reload"
                          value={editFormData.petty_cash_pending_for_reload}
                          onChange={handleEditChange}
                           min="0"
                        />
                        {editFormErrors.petty_cash_pending_for_reload && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.petty_cash_pending_for_reload}
                          </p>
                        )}
                      </td>
                    </tr>

                     <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                       Cash in Hand
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="number"
                          name="cash_in_hand"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Cash in Hand"
                          value={editFormData.cash_in_hand}
                          onChange={handleEditChange}
                           min="0"
                        />
                        {editFormErrors.cash_in_hand && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.cash_in_hand}
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Balance on Bank A/C */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Balance on Bank A/C
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="number"
                          name="balance_on_bank_ac"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Balance on Bank A/C"
                          value={editFormData.balance_on_bank_ac}
                          onChange={handleEditChange}
                           min="0"
                        />
                        {editFormErrors.balance_on_bank_ac && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.balance_on_bank_ac}
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Difference */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Difference
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-left text-gray-800 pl-24">
                        <input
                          type="number"
                          name="diff"
                          className="w-full px-2 py-1 border border-gray-400 rounded"
                          placeholder="Difference"
                          value={editFormData.diff}
                          onChange={handleEditChange}
                          min="0"
                        />
                        {editFormErrors.diff && (
                          <p className="text-red-500 text-sm">
                            {editFormErrors.diff}
                          </p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                      <td
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
                      </td>

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
            type="button"
            onClick={handleEditLocalExpenseSubmit}
            className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
          >
            Update Local Expenses
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setIslocalEditOutTourOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocalEditOutTour;
