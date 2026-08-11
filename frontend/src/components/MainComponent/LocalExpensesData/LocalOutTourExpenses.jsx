import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./LocalOutTourExpenses.css";
import { iconsImgs } from "../../../utils/images";
import ContentTop from "../../ContentTop/ContentTop";
import Pagination from "./Pagination";
import axios from "axios";
import LocalOutTourTable from "./LocalOutTourTable";
import LocalEditOutTour from "./LocalEditOutTour";
import LocalAddOutTour from "./LocalAddOutTour";
import LocalViewOutTour from "./LocalViewOutTour";

import { fetchAllUsers } from "../../../redux/userSlice";
import { fetchCurrentUser } from "../../../redux/authSlice";
import {
  useAddLocalExpenseMutation,
  useGetLocalExpensesQuery,
  useGetLocalExpenseByIdQuery,
  useUpdateLocalExpenseMutation,
  useDeleteLocalExpenseMutation,
  useExportLocalExpensesQuery,
  useLazyExportLocalExpensesQuery,
} from "../../../redux/services/localExpenseApi";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const LocalOutTourExpenses = () => {
  const { hasPermission } = useUserPermissionCheck();
  const dispatch = useDispatch();

  const { user: userDetail } = useSelector((state) => state.auth);

  const { allusers } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const [selectedExpense, setSelectedExpense] = useState({});
  const [islocalAddOutTouropen, setIslocalAddOutTourOpen] = useState(false);
  const [islocalViewOutTouropen, setIslocalViewOutTourOpen] = useState(false);
  const [islocalEditOutTouropen, setIslocalEditOutTourOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const outTourPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  const { data, error, isLoading, refetch } = useGetLocalExpensesQuery({
    page: currentPage,
    limit: outTourPerPage,
    search: searchTerm,
  });

  //console.log("localTourExpData", data?.data);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const [addLocalExpense, { isSuccess, isError, error: baerror }] =
    useAddLocalExpenseMutation();

  const [
    updateLocalExpense,
    { isSuccess: editisSuccess, isError: isIsError, error: editBaerror },
  ] = useUpdateLocalExpenseMutation();

  const {
    data: getLocalExpenseById,
    isLoading: getisLoading,
    isError: getisError,
    error: geterror,
  } = useGetLocalExpenseByIdQuery(selectedExpense?.id);

  const [deleteLocalExpense] = useDeleteLocalExpenseMutation();

  // const [exportLocalExpenses] = useExportLocalExpensesQuery();
  const [triggerExport, { isFetching }] = useLazyExportLocalExpensesQuery();

  const [formData, setFormData] = useState({
    employee_id: "",
    period_of_expenses: "",
    place_of_visit: "",
    bank_account_no: "",
    prepared_by: "",
    checked_by: "",
    approved_by: "",
    //recon_of_bank_ac: "",
    bank_ac_limit: "",
    petty_cash_sub_on: "",
    petty_cash_pending_for_reload: "",
    balance_on_bank_ac: "",
    diff: "",
    cash_in_hand: "",
    details: [
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
        total: 0.0,
      },
    ],
  });

  const [formErrors, setFormErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  // Flash message handler
  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

     const {
      bank_ac_limit,
      petty_cash_sub_on,
      petty_cash_pending_for_reload,
      cash_in_hand,
      balance_on_bank_ac,
    } = formData;

    const diff =
      (Number(bank_ac_limit) || 0) -
      (Number(petty_cash_sub_on) || 0) -
      (Number(petty_cash_pending_for_reload) || 0) -
      (Number(cash_in_hand) || 0) -
      (Number(balance_on_bank_ac) || 0);

    setFormData((prev) => ({
    ...prev,
    diff: diff.toFixed(2),
  }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.details];
    newDetails[index][field] = value;

    //setFormData((prev) => ({ ...prev, details: newDetails }));

    const total = newDetails.reduce(
      (sum, curr) =>
        sum +
        (Number(curr.travelling_exp) || 0) +
        (Number(curr.loading_boarding) || 0) +
        (Number(curr.printing_stationery) || 0) +
        (Number(curr.food_expenses) || 0) +
        (Number(curr.company_car_exp) || 0) +
        (Number(curr.purchases) || 0) +
        (Number(curr.other) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      details: newDetails,
      petty_cash_sub_on: total.toFixed(2),
    }));
  };

  const validateInputs = () => {
    let errors = {};

    if (!formData.employee_id.trim())
      errors.employee_id = "*Employee Name is required";
    if (!formData.period_of_expenses.trim())
      errors.period_of_expenses = "*Period of Expenses is required";
    if (!formData.place_of_visit.trim())
      errors.place_of_visit = "*Place of Visit is required";
    if (!formData.bank_account_no.trim())
      errors.bank_account_no = "*Bank A/C No. is required";

    // Optional: validate at least one detail row exists
    if (formData.details.length === 0) {
      errors.details = "*At least one expense row is required";
    } else {
      formData.details.forEach((row, index) => {
        if (!row.date)
          errors[`details_${index}_date`] = `*Date is required at row ${
            index + 1
          }`;
        if (!row.particulars.trim())
          errors[
            `details_${index}_particulars`
          ] = `*Particular is required at row ${index + 1}`;
        // Optionally, validate amounts are numbers ≥ 0
        [
          "travelling_exp",
          "loading_boarding",
          "printing_stationery",
          "food_expenses",
          "company_car_exp",
          "purchases",
          "other",
        ].forEach((field) => {
          if (isNaN(row[field]) || row[field] < 0)
            errors[
              `details_${index}_${field}`
            ] = `*Invalid amount for ${field.replace(/_/g, " ")} at row ${
              index + 1
            }`;
        });
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitLocalExpense = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await addLocalExpense(formData).unwrap();

        if (response?.success) {
          handleFlashMessage(response.message, "success");
          await refetch();
          setTimeout(() => {
            setIslocalAddOutTourOpen(false);
          }, 1000);

          // Reset form after successful submit
          setFormData({
            employee_name: "",
            period_of_expenses: "",
            place_of_visit: "",
            bank_account_no: "",
            details: [
              {
                date: "",
                particulars: "",
                travelling_exp: 0,
                loading_boarding: 0,
                printing_stationery: 0,
                food_expenses: 0,
                company_car_exp: 0,
                purchases: 0,
                other: 0,
                total: 0,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error adding Local Expense:", error);
        handleFlashMessage(
          error?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };

  const [editFormData, setEditFormData] = useState({
    employee_id: "",
    period_of_expenses: "",
    place_of_visit: "",
    bank_account_no: "",
    prepared_by: "",
    checked_by: "",
    approved_by: "",
    //recon_of_bank_ac: "",
    bank_ac_limit: "",
    petty_cash_sub_on: "",
    petty_cash_pending_for_reload: "",
    balance_on_bank_ac: "",
    diff: "",
    cash_in_hand: "",
    details: [
      {
        date: "",
        particulars: "",
        travelling_exp: 0,
        loading_boarding: 0,
        printing_stationery: 0,
        food_expenses: 0,
        company_car_exp: 0,
        purchases: 0,
        other: 0,
        total: 0,
      },
    ],
  });

  const [editFormErrors, setEditFormErrors] = useState({});
  const [editFlashMessage, setEditFlashMessage] = useState("");
  const [editFlashMsgType, setEditFlashMsgType] = useState("");

  useEffect(() => {
    if (selectedExpense) {
      setEditFormData({
        employee_id: selectedExpense?.employee_id || "",
        period_of_expenses: selectedExpense?.period_of_expenses || "",
        place_of_visit: selectedExpense?.place_of_visit || "",
        bank_account_no: selectedExpense?.bank_account_no || "",
        prepared_by: selectedExpense?.prepared_by || "",
        checked_by: selectedExpense?.checked_by || "",
        approved_by: selectedExpense?.approved_by || "",
        //recon_of_bank_ac: selectedExpense?.recon_of_bank_ac || "",
        bank_ac_limit: selectedExpense?.bank_ac_limit || "",
        petty_cash_sub_on: selectedExpense?.petty_cash_sub_on || "",
        petty_cash_pending_for_reload:
          selectedExpense?.petty_cash_pending_for_reload || "",
        balance_on_bank_ac: selectedExpense?.balance_on_bank_ac || "",
        diff: selectedExpense?.diff || "",
        cash_in_hand: selectedExpense?.cash_in_hand || "",
        details: selectedExpense?.details || [
          {
            date: "",
            particulars: "",
            travelling_exp: 0,
            loading_boarding: 0,
            printing_stationery: 0,
            food_expenses: 0,
            company_car_exp: 0,
            purchases: 0,
            other: 0,
            total: 0,
          },
        ],
      });
    }
  }, [selectedExpense?.id]);

  const handleEditFlashMessage = (message, type) => {
    setEditFlashMessage(message);
    setEditFlashMsgType(type);
    setTimeout(() => {
      setEditFlashMessage("");
      setEditFlashMsgType("");
    }, 1000);
  };

  // OnChange handler
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));

      const {
      bank_ac_limit,
      petty_cash_sub_on,
      petty_cash_pending_for_reload,
      cash_in_hand,
      balance_on_bank_ac,
    } = editFormData;

     const diff =
      (Number(bank_ac_limit) || 0) -
      (Number(petty_cash_sub_on) || 0) -
      (Number(petty_cash_pending_for_reload) || 0) -
      (Number(cash_in_hand) || 0) -
      (Number(balance_on_bank_ac) || 0);

      setEditFormData((prev) => ({ ...prev,  diff: diff.toFixed(2) }));

    setEditFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditDetailChange = (index, field, value) => {
    const updatedDetails = [...editFormData.details];
    updatedDetails[index][field] = value;

     const total = updatedDetails.reduce(
      (sum, curr) =>
        sum +
        (Number(curr.travelling_exp) || 0) +
        (Number(curr.loading_boarding) || 0) +
        (Number(curr.printing_stationery) || 0) +
        (Number(curr.food_expenses) || 0) +
        (Number(curr.company_car_exp) || 0) +
        (Number(curr.purchases) || 0) +
        (Number(curr.other) || 0),
      0
    );

    setEditFormData((prev) => ({ ...prev, details: updatedDetails ,petty_cash_sub_on: total.toFixed(2),}));
  };

  const validateEditInputs = () => {
    let errors = {};

    if (!editFormData.employee_id.trim())
      errors.employee_id = "*Employee Name is required";
    if (!editFormData.period_of_expenses.trim())
      errors.period_of_expenses = "*Period of Expenses is required";
    if (!editFormData.place_of_visit.trim())
      errors.place_of_visit = "*Place of Visit is required";
    if (!editFormData.bank_account_no.trim())
      errors.bank_account_no = "*Bank A/C No. is required";

    // Optional: validate at least one detail row exists
    if (editFormData.details.length === 0) {
      errors.details = "*At least one expense row is required";
    } else {
      editFormData.details.forEach((row, index) => {
        if (!row.date)
          errors[`details_${index}_date`] = `*Date is required at row ${
            index + 1
          }`;
        if (!row.particulars.trim())
          errors[
            `details_${index}_particulars`
          ] = `*Particular is required at row ${index + 1}`;
        // Optionally, validate amounts are numbers ≥ 0
        [
          "travelling_exp",
          "loading_boarding",
          "printing_stationery",
          "food_expenses",
          "company_car_exp",
          "purchases",
          "other",
        ].forEach((field) => {
          if (isNaN(row[field]) || row[field] < 0)
            errors[
              `details_${index}_${field}`
            ] = `*Invalid amount for ${field.replace(/_/g, " ")} at row ${
              index + 1
            }`;
        });
      });
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditLocalExpenseSubmit = async (e) => {
    e.preventDefault();

    if (validateEditInputs()) {
      try {
        const response = await updateLocalExpense({
          id: selectedExpense?.id,
          updatedData: editFormData,
        }).unwrap();

        if (response.success) {
          handleEditFlashMessage(response.message, "success");
          await refetch();
          setTimeout(() => {
            setIslocalEditOutTourOpen(false);
          }, 1000);
        } else {
          handleEditFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error editing Local Expense:", error);
        handleEditFlashMessage(
          error?.data?.message || "An error occurred",
          "error"
        );
      }
    }
  };

  //delete functinality
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // Function to show flash messages for delete actions
  const handleDeleteFlashMessage = (message, type) => {
    setDeleteFlashMessage(message);
    setDeleteFlashMsgType(type);
    setTimeout(() => {
      setDeleteFlashMessage("");
      setDeleteFlashMsgType("");
    }, 1000); // Hide the message after 3 seconds
  };

  const handleDelete = async (id) => {
    try {
      await deleteLocalExpense(id).unwrap();
      handleDeleteFlashMessage("LocalTour deleted successfully!", "success");
      await refetch();
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete task",
        "error"
      );
    }
  };

  const handleExportData = async () => {
    try {
      const { data } = await triggerExport({
        page: currentPage,
        limit: outTourPerPage,
        search: searchTerm,
      });

      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "local_expenses.xlsx"); // your desired filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting local expenses:", error);
    }
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              OutStation/Local Management Expenses
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div className="md:mb-0 mb-2">
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              {hasPermission(14, 1) && (
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={() => setIslocalAddOutTourOpen(true)}
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add Local Expenses
                </button>
              )}
            </div>
            <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={handleExportData}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
        <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*--------- New Pagination Code Start  ---------*/}
            <div className="flex justify-end items-center mb-5 text-white rounded-md font-sans gap-10">
              <div className="flex items-center">
                <span className="text-sm text-white bg-[#473b33] rounded-l-[5px] flex items-center text-center px-3 h-8">
                  Show Data
                </span>
                <div className="relative cursor-pointer">
                  <select
                    className="appearance-none cursor-pointer h-8 pr-8 pl-5 rounded-r-[5px] bg-[#3d3d57] text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    value={entriesPerPageNewData}
                    onChange={(e) => {
                      setEntriesPerPageNewData(Number(e.target.value));
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/*--------- New Pagination Code End  ---------*/}
            {/*------- Table Data Start -------*/}
            <LocalOutTourTable
              setIslocalEditOutTourOpen={setIslocalEditOutTourOpen}
              setIslocalViewOutTourOpen={setIslocalViewOutTourOpen}
              localTourExpData={data?.data}
              selectedExpense={selectedExpense}
              setSelectedExpense={setSelectedExpense}
              handleDelete={handleDelete}
              deleteFlashMessage={deleteFlashMessage}
              deleteFlashMsgType={deleteFlashMsgType}
              empRole={userDetail?.employeeRole?.role_id}
            />
            {/*------- Table Data End -------*/}
          </div>
        </div>

        {/* Edit User Modal */}
        {islocalEditOutTouropen && (
          <LocalEditOutTour
            setIslocalEditOutTourOpen={setIslocalEditOutTourOpen}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            editFormErrors={editFormErrors}
            setEditFormErrors={setEditFormErrors}
            editFlashMessage={editFlashMessage}
            editFlashMsgType={editFlashMsgType}
            handleEditFlashMessage={handleEditFlashMessage}
            handleEditChange={handleEditChange}
            handleEditDetailChange={handleEditDetailChange}
            validateEditInputs={validateEditInputs}
            handleEditLocalExpenseSubmit={handleEditLocalExpenseSubmit}
            allusers={allusers}
          />
        )}

        {/* View User Modal */}
        {islocalViewOutTouropen && (
          <LocalViewOutTour
            setIslocalViewOutTourOpen={setIslocalViewOutTourOpen}
            getLocalExpenseById={getLocalExpenseById?.data}
          />
        )}

        {/* Assign Customer Modal */}
        {islocalAddOutTouropen && (
          <LocalAddOutTour
            setIslocalAddOutTourOpen={setIslocalAddOutTourOpen}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            flashMessage={flashMessage}
            setFlashMessage={setFlashMessage}
            flashMsgType={flashMsgType}
            setFlashMsgType={setFlashMsgType}
            handleFlashMessage={handleFlashMessage}
            handleChange={handleChange}
            handleDetailChange={handleDetailChange}
            validateInputs={validateInputs}
            refetch={refetch}
            allusers={allusers}
            handleSubmitLocalExpense={handleSubmitLocalExpense}
          />
        )}
        {/* Pagination Controls with Number */}
        <Pagination
          currentPage={data?.currentPage}
          handlePageChange={handlePageChange}
          totalPages={data?.totalPages}
        />
      </div>
    </div>
  );
};

export default LocalOutTourExpenses;
