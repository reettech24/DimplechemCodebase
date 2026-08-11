import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CostWorkingManageData.css";
import { iconsImgs } from "../../../utils/images";
import CostWorkingTable from "./CostWorkingTable";
import ContentTop from "../../ContentTop/ContentTop";
import Pagination from "./Pagination";
import AddCostWorkingModal from "./AddCostWorkingModal";
import ViewCostWorkingModal from "./ViewCostWorkingModal";
import EditCostWorkingModal from "./EditCostWorkingModal";
import {
  addCostWorking,
  listCostWorkings,
  updateCostWorking,
} from "../../../redux/costWorkingSlice";
import { updateLead, listLeads, removeLead } from "../../../redux/leadSlice";
import { fetchCurrentUser } from "../../../redux/authSlice";
import { fetchUserWithRole } from "../../../redux/userSlice";
import {
  fetchAllCustomers,
  getAllAddressByCustomerId,
} from "../../../redux/customerSlice";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const CostWorkingManageData = () => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();

  const dispatch = useDispatch();
  const { costWorkings, totalPages, costWorkingLoading, costWorkingError } =
    useSelector((state) => state.costWorking);

  //console.log("costWorkings",costWorkings);

  const { user: userDeatail } = useSelector((state) => state.auth);

  const { allCustomers, customerAddress } = useSelector(
    (state) => state.customer
  );

  const [selectedCostWorking, setSelectedCostWorking] = useState({});
  const [isViewCostWorkingModalOpen, setViewCostWorkingModalOpen] =
    useState(false);
  const [isEditCostWorkingModalOpen, setEditCostWorkingModalOpen] =
    useState(false);
  const [isCostWorkingModalOpen, setIsCostWorkingModalOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const costWorkingPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  // Fetch departments whenever searchTerm or currentPage changes
  useEffect(() => {
    dispatch(fetchAllCustomers());
    // dispatch(
    //   fetchUserWithRole({
    //     roleId: 4,
    //   })
    // );
    dispatch(
      listCostWorkings({
        page: currentPage,
        limit: costWorkingPerPage,
        search: searchTerm,
      })
    );
  }, [
    dispatch,
    currentPage,
    searchTerm,
    costWorkingPerPage,
    entriesPerPageNewData,
  ]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //add lead====================================================================================
  const [costWorkingData, setCostWorkingData] = useState({
    company_name: "",
    location: "",
    nature_of_work: "",
    technology_used: "",
    estimate_no: "",
    revision_no: "R00",
    estimate_date: new Date().toISOString().split("T")[0],
    revision_date: "",
    area_to_be_coated: "",
    thickness_in_mm: "",
    labour_cost: "",
    cunsumable_cost: "",
    transport_cost: "",
    supervision_cost: "",
    contractor_profit: 10,
    labour_cost_area: "",
    cunsumable_cost_area: "",
    transport_cost_area: "",
    supervision_cost_area: "",
    finance_cost_month: "",
    finance_cost_persantage: "",
    over_head_charges_area: "",
    over_head_charges_persantage: "",
    contractor_profit_persantage: "",
    approved_by: "",
    checked_by: "",
    dcpl_representative: "",
    prepared_by: "",
    notes: "",
    //over_head_charges: "",
    //total_application_labour_cost: "",
    //total_project_cost: "",
    //total_material_cost: "",
    b2_percent: 6.0,
    b3_percent: 20,
    products: [],
    cost_per_sqft: "", // Array to store multiple products
  });

  useEffect(() => {
    // Only fetch on new entry (not in edit mode)
    const fetchNextEstimateNo = async () => {
      try {
        const token = getAuthToken();

        const res = await axios.get(`${API_URL}/auth/next-estimate-no`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setCostWorkingData((prev) => ({
            ...prev,
            estimate_no: res?.data?.estimate_no,
          }));
        }
      } catch (error) {
        console.error("Error fetching estimate number", error);
      }
    };

    fetchNextEstimateNo();
  }, []);

  //console.log("fromdata", costWorkingData);

  const [costWorkingFormErrors, setCostWorkingErrors] = useState({});
  const [costWorkingFlashMessage, setCostWorkingFlashMessage] = useState("");
  const [costWorkingFlashMsgType, setCostWorkingFlashMsgType] = useState("");

  // const handleCostWorkingChange = (e) => {
  //   const { name, value } = e.target;

  //   // Update field as-is (string) so input works correctly
  //   const updatedData = {
  //     ...costWorkingData,
  //     [name]: value,
  //   };

  //   setCostWorkingData(updatedData);
  //   setCostWorkingErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: "",
  //   }));
  // };

  const handleCostWorkingChange = (e) => {
    const { name, value } = e.target;

    // Update field as-is (string)
    const updatedData = {
      ...costWorkingData,
      [name]: value,
    };

    // If area_to_be_coated changes, recalculate related fields
    if (name === "area_to_be_coated") {
      const area = parseFloat(value || 0);
      const updatedProducts = [...updatedData.products];

      updatedProducts.forEach((cat) => {
        cat.items.forEach((item) => {
          const qty = parseFloat(item.qty_for || 0);
          const rate = parseFloat(item.std_basic_rate || 0);

          item.qty_for_1 = (qty * area).toFixed(2);
          item.basic_amount = (parseFloat(item.qty_for_1 || 0) * rate).toFixed(
            2
          );
        });
      });

      // Recalculate total material cost
      const total = updatedProducts
        .flatMap((cat) => cat.items)
        .reduce((sum, i) => sum + (parseFloat(i.basic_amount) || 0), 0);

      updatedData.products = updatedProducts;

      //updatedData.cost_per_sqft = area ? (total / area).toFixed(2) : "0.00";

      updatedData.cost_per_sqft = costWorkingData?.area_to_be_coated
        ? (total / costWorkingData?.area_to_be_coated).toFixed(2)
        : "0.00";
      updatedData.total_material_cost = total.toFixed(2);
    }

    setCostWorkingData(updatedData);
    setCostWorkingErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleCostWorkingCustomerChange = (e) => {
    const { value } = e.target;

    dispatch(getAllAddressByCustomerId({ id: value }));
    // Only store customer_id in leadData
    setCostWorkingData((prevData) => ({
      ...prevData,
      company_name: value, // Store only customer_id
    }));
  };

  // Function to show flash messages for delete actions
  const handleCostWorkingFlashMessage = (message, type) => {
    setCostWorkingFlashMessage(message);
    setCostWorkingFlashMsgType(type);
    setTimeout(() => {
      setCostWorkingFlashMessage("");
      setCostWorkingFlashMsgType("");
    }, 1000); // Hide the message after 3 seconds
  };

  const costWorkingValidateForm = () => {
    let errors = {};

    if (!costWorkingData.company_name)
      errors.company_name = "Company Name is required.";
    if (!costWorkingData.location) errors.location = "Location is required.";
    if (!costWorkingData.nature_of_work)
      errors.nature_of_work = "Nature of Work is required.";
    if (!costWorkingData.technology_used)
      errors.technology_used = "Technology Used is required.";
    //if (!costWorkingData.estimate_no) errors.estimate_no = "Estimate Number is required.";
    if (!costWorkingData.estimate_date)
      errors.estimate_date = "Estimate Date is required.";
    //if (!costWorkingData.revision_no) errors.revision_no = "Revision Number is required.";
    // if (!costWorkingData.revision_date) errors.revision_date = "Revision Date is required.";
    if (!costWorkingData.area_to_be_coated)
      errors.area_to_be_coated = "Area to be Coated is required.";
    // if (!costWorkingData.thickness_in_mm)
    //   errors.thickness_in_mm = "Thickness in MM is required.";
    // if (!costWorkingData.labour_cost)
    //   errors.labour_cost = "Labour Cost is required.";
    // if (!costWorkingData.cunsumable_cost)
    //   errors.cunsumable_cost = "Consumable Cost is required.";
    // if (!costWorkingData.transport_cost)
    //   errors.transport_cost = "Transport Cost is required.";
    // if (!costWorkingData.supervision_cost)
    //   errors.supervision_cost = "Supervision Cost is required.";
    // if (!costWorkingData.contractor_profit)
    //   errors.contractor_profit = "Contractor Profit is required.";
    // if (!costWorkingData.over_head_charges)
    //   errors.over_head_charges = "Overhead Charges are required.";
    //if (!costWorkingData.total_application_labour_cost) errors.total_application_labour_cost = "Total Application Labour Cost is required.";
    // if (!costWorkingData.total_project_cost)
    //   errors.total_project_cost = "Total Project Cost is required.";

    setCostWorkingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //console.log("costWorkingFormErrors",costWorkingFormErrors);
  const handleSubmitCostWorking = async (e) => {
    if (costWorkingValidateForm()) {
      try {
        const response = await dispatch(
          addCostWorking(costWorkingData)
        ).unwrap();

        if (response?.success) {
          handleCostWorkingFlashMessage(response?.message, "success");

          dispatch(
            listCostWorkings({
              page: currentPage,
              limit: costWorkingPerPage,
              search: searchTerm,
            })
          );

          setCostWorkingData((prevData) => ({
            company_name: "",
            location: "",
            nature_of_work: "",
            technology_used: "",
            //estimate_no: "",
            estimate_date: "",
            revision_date: "",
            area_to_be_coated: "",
            thickness_in_mm: "",
            labour_cost: "",
            cunsumable_cost: "",
            transport_cost: "",
            supervision_cost: "",
            contractor_profit: "",
            //over_head_charges: "",
            //total_application_labour_cost: "",
            //total_project_cost: "",
            //total_material_cost: "",
            b2_persantage: "",
            b3_persantage: "",
            products: [],
          }));

          setTimeout(() => {
            setIsCostWorkingModalOpen(false);
          }, 3000);
        } else {
          handleCostWorkingFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error adding cost working:", error);
        handleCostWorkingFlashMessage(
          error?.message || "An error occurred",
          "error"
        );
      }
    }
  };

  //end add lead================================================================================

  //update lead====================================================================================
  const [editCostWorkingData, setEditCostWorkingData] = useState({
    company_name: "",
    location: "",
    nature_of_work: "",
    technology_used: "",
    estimate_no: "",
    estimate_date: "",
    revision_date: "",
    revision_no: "",
    area_to_be_coated: "",
    thickness_in_mm: "",
    labour_cost: "",
    cunsumable_cost: "",
    transport_cost: "",
    supervision_cost: "",
    contractor_profit: 10,
    labour_cost_area: "",
    cunsumable_cost_area: "",
    transport_cost_area: "",
    supervision_cost_area: "",
    finance_cost_month: "",
    finance_cost_persantage: "",
    over_head_charges_area: "",
    over_head_charges_persantage: "",
    contractor_profit_persantage: "",
    approved_by: "",
    checked_by: "",
    dcpl_representative: "",
    prepared_by: "",
    notes: "",
    //over_head_charges: "",
    //total_application_labour_cost: "",
    //total_project_cost: "",
    //total_material_cost: "",
    b2_persantage: 6.0,
    b3_persantage: 20,
    products: [],
    cost_per_sqft: "", // Array to store multiple products
  });

  const [editCostWorkingFormErrors, setEditCostWorkingFormErrors] = useState(
    {}
  );
  const [editCostWorkingFlashMessage, setEditCostWorkingFlashMessage] =
    useState("");
  const [editCostWorkingFlashMsgType, setEditCostWorkingFlashMsgType] =
    useState("");

  const getNextRevisionNo = (currentRev) => {
    if (!currentRev) return "R00"; // Start from R00 if no revision yet
    if (currentRev === "R00") return "R001"; // After R00, go to R001
    const num = parseInt(currentRev.replace("R", ""), 10);
    const nextNum = num + 1;
    return `R${nextNum.toString().padStart(3, "0")}`;
  };

  // useEffect(() => {
  //   if (selectedCostWorking) {
  //     setEditCostWorkingData({
  //       company_name: selectedCostWorking.company_name || "",
  //       location: selectedCostWorking.location || "",
  //       nature_of_work: selectedCostWorking.nature_of_work || "",
  //       technology_used: selectedCostWorking.technology_used || "",
  //       estimate_no: selectedCostWorking?.estimate_no || "",
  //       estimate_date: selectedCostWorking?.estimate_date?.split("T")[0] || "",
  //       revision_no: getNextRevisionNo(selectedCostWorking?.revision_no) || "",
  //       revision_date: selectedCostWorking.revision_date?.split("T")[0] || "",
  //       area_to_be_coated: selectedCostWorking.area_to_be_coated || "",
  //       thickness_in_mm: selectedCostWorking.thickness_in_mm || "",
  //       labour_cost: selectedCostWorking.labour_cost || "",
  //       cunsumable_cost: selectedCostWorking.cunsumable_cost || "",
  //       transport_cost: selectedCostWorking.transport_cost || "",
  //       supervision_cost: selectedCostWorking.supervision_cost || "",
  //       contractor_profit: selectedCostWorking.contractor_profit || "",
  //       labour_cost_area: selectedCostWorking.labour_cost_area || "",
  //       cunsumable_cost_area: selectedCostWorking.cunsumable_cost_area || "",
  //       transport_cost_area: selectedCostWorking.transport_cost_area || "",
  //       supervision_cost_area: selectedCostWorking.supervision_cost_area || "",
  //       finance_cost_month: selectedCostWorking.finance_cost_month || "",
  //       finance_cost_persantage:
  //         selectedCostWorking.finance_cost_persantage || "",
  //       over_head_charges_area:
  //         selectedCostWorking.over_head_charges_area || "",
  //       over_head_charges_persantage:
  //         selectedCostWorking.over_head_charges_persantage || "",
  //       contractor_profit_persantage:
  //         selectedCostWorking.contractor_profit_persantage || "",
  //       approved_by: selectedCostWorking.approved_by || "",
  //       checked_by: selectedCostWorking.checked_by || "",
  //       dcpl_representative: selectedCostWorking.dcpl_representative || "",
  //       prepared_by: selectedCostWorking.prepared_by || "",
  //       notes:selectedCostWorking.notes || "",
  //       products: selectedCostWorking.products || [],
  //     });
  //   }
  // }, [selectedCostWorking]);

  // Handle input changes for update form

  useEffect(() => {
    if (selectedCostWorking) {
      const groupedProducts = Array.isArray(selectedCostWorking.products)
        ? selectedCostWorking.products.reduce((acc, item) => {
            const existingGroup = acc.find(
              (group) => group.category_name === item.category_name
            );

            const cleanItem = {
              product_id: item.product_id,
              unit: item.unit,
              qty_for: item.qty_for,
              std_pak: item.std_pak,
              std_basic_rate: item.std_basic_rate,
              basic_amount: item.basic_amount,
              qty_for_1: item.qty_for_1,
            };

            if (existingGroup) {
              existingGroup.items.push(cleanItem);
            } else {
              acc.push({
                category_name: item.category_name,
                items: [cleanItem],
              });
            }

            return acc;
          }, [])
        : [];

      const totalMaterialCost = groupedProducts
        .flatMap((cat) => cat.items)
        .reduce((sum, item) => sum + (parseFloat(item.basic_amount) || 0), 0);

      setEditCostWorkingData({
        company_name: selectedCostWorking.company_name || "",
        location: selectedCostWorking.location || "",
        nature_of_work: selectedCostWorking.nature_of_work || "",
        technology_used: selectedCostWorking.technology_used || "",
        estimate_no: selectedCostWorking?.estimate_no || "",
        estimate_date: selectedCostWorking?.estimate_date?.split("T")[0] || "",
        revision_no: getNextRevisionNo(selectedCostWorking?.revision_no) || "",
        revision_date: selectedCostWorking.revision_date?.split("T")[0] || "",
        area_to_be_coated: selectedCostWorking.area_to_be_coated || "",
        thickness_in_mm: selectedCostWorking.thickness_in_mm || "",
        labour_cost: selectedCostWorking.labour_cost || "",
        cunsumable_cost: selectedCostWorking.cunsumable_cost || "",
        transport_cost: selectedCostWorking.transport_cost || "",
        supervision_cost: selectedCostWorking.supervision_cost || "",
        contractor_profit: selectedCostWorking.contractor_profit || "",
        labour_cost_area: selectedCostWorking.labour_cost_area || "",
        cunsumable_cost_area: selectedCostWorking.cunsumable_cost_area || "",
        transport_cost_area: selectedCostWorking.transport_cost_area || "",
        supervision_cost_area: selectedCostWorking.supervision_cost_area || "",
        finance_cost_month: selectedCostWorking.finance_cost_month || "",
        finance_cost_persantage:
          selectedCostWorking.finance_cost_persantage || "",
        over_head_charges_area:
          selectedCostWorking.over_head_charges_area || "",
        over_head_charges_persantage:
          selectedCostWorking.over_head_charges_persantage || "",
        contractor_profit_persantage:
          selectedCostWorking.contractor_profit_persantage || "",
        approved_by: selectedCostWorking.approved_by || "",
        checked_by: selectedCostWorking.checked_by || "",
        dcpl_representative: selectedCostWorking.dcpl_representative || "",
        prepared_by: selectedCostWorking.prepared_by || "",
        notes: selectedCostWorking.notes || "",

        products: groupedProducts,
        total_material_cost: totalMaterialCost.toFixed(2),
        cost_per_sqft:(totalMaterialCost/selectedCostWorking.area_to_be_coated).toFixed(2)
      });
    }
  }, [selectedCostWorking]);

  // const handleEditCostWorkingChange = (e) => {
  //   const { name, value } = e.target;

  //   // Update field as-is (string) so input works correctly
  //   const updatedData = {
  //     ...editCostWorkingData,
  //     [name]: value,
  //   };
  //   setEditCostWorkingData(updatedData);
  // };

  //console.log("editCostWorkingData123", editCostWorkingData);


  const handleEditCostWorkingChange = (e) => {
  const { name, value } = e.target;

  const updatedData = {
    ...editCostWorkingData,
    [name]: value,
  };

  // Recalculate dependent fields if area_to_be_coated changes
  if (name === "area_to_be_coated") {
    const area = parseFloat(value || 0);

    // Deep clone products and recalculate qty_for_1 and basic_amount
    const updatedProducts = editCostWorkingData.products.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => {
        const qty = parseFloat(item.qty_for || 0);
        const rate = parseFloat(item.std_basic_rate || 0);
        const qty_for_1 = qty * area;
        const basic_amount = qty_for_1 * rate;

        return {
          ...item,
          qty_for_1: qty_for_1.toFixed(2),
          basic_amount: basic_amount.toFixed(2),
        };
      }),
    }));

    // Calculate total material cost
    const total = updatedProducts
      .flatMap((cat) => cat.items)
      .reduce((sum, item) => sum + parseFloat(item.basic_amount || 0), 0);

    updatedData.products = updatedProducts;
    updatedData.cost_per_sqft = editCostWorkingData?.area_to_be_coated ? (total / editCostWorkingData?.area_to_be_coated).toFixed(2) : "0.00";
    updatedData.total_material_cost = total.toFixed(2);
  }

  setEditCostWorkingData(updatedData);
};


  const handleEditCostWorkingCustomerChange = (e) => {
    const { value } = e.target;

    dispatch(getAllAddressByCustomerId({ id: value }));

    // Only store customer_id in editCostWorkingData
    setEditCostWorkingData((prevData) => ({
      ...prevData,
      company_name: value, // Store only customer_id
    }));
  };

  useEffect(() => {
    if (isEditCostWorkingModalOpen) {
      const response = dispatch(
        getAllAddressByCustomerId({ id: selectedCostWorking?.company_name })
      );
    }
  }, [isEditCostWorkingModalOpen]);

  // Function to show flash messages for update actions
  const handleEditCostWorkingFlashMessage = (message, type) => {
    setEditCostWorkingFlashMessage(message);
    setEditCostWorkingFlashMsgType(type);
    setTimeout(() => {
      setEditCostWorkingFlashMessage("");
      setEditCostWorkingFlashMsgType("");
    }, 1000); // Hide the message after 3 seconds
  };

  // Validate the update form
  const editCostWorkingValidateForm = () => {
    let errors = {};

    if (!editCostWorkingData.company_name)
      errors.company_name = "Company Name is required.";
    if (!editCostWorkingData.location)
      errors.location = "Location is required.";
    if (!editCostWorkingData.nature_of_work)
      errors.nature_of_work = "Nature of Work is required.";
    if (!editCostWorkingData.technology_used)
      errors.technology_used = "Technology Used is required.";
    //if (!editCostWorkingData.estimate_no) errors.estimate_no = "Estimate Number is required.";
    if (!editCostWorkingData.estimate_date)
      errors.estimate_date = "Estimate Date is required.";
    // if (!editCostWorkingData.revision_no) errors.revision_no = "Revision Number is required.";
    // if (!editCostWorkingData.revision_date) errors.revision_date = "Revision Date is required.";
    if (!editCostWorkingData.area_to_be_coated)
      errors.area_to_be_coated = "Area to be Coated is required.";
    // if (!editCostWorkingData.thickness_in_mm)
    //   errors.thickness_in_mm = "Thickness in MM is required.";
    // if (!editCostWorkingData.labour_cost)
    //   errors.labour_cost = "Labour Cost is required.";
    // if (!editCostWorkingData.cunsumable_cost)
    //   errors.cunsumable_cost = "Consumable Cost is required.";
    // if (!editCostWorkingData.transport_cost)
    //   errors.transport_cost = "Transport Cost is required.";
    // if (!editCostWorkingData.supervision_cost)
    //   errors.supervision_cost = "Supervision Cost is required.";
    // if (!editCostWorkingData.contractor_profit)
    //   errors.contractor_profit = "Contractor Profit is required.";
    // if (!editCostWorkingData.over_head_charges)
    //   errors.over_head_charges = "Overhead Charges are required.";
    // // if (!editCostWorkingData.total_application_labour_cost) errors.total_application_labour_cost = "Total Application Labour Cost is required.";
    // if (!editCostWorkingData.total_project_cost)
    //   errors.total_project_cost = "Total Project Cost is required.";

    setEditCostWorkingFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission for updating lead
  const handleSubmitEditCostWorking = async (e) => {
    console.log("edit form data", selectedCostWorking.id, editCostWorkingData);

    if (editCostWorkingValidateForm()) {
      try {
        const response = await dispatch(
          updateCostWorking({
            id: selectedCostWorking.id,
            data: editCostWorkingData,
          })
        ).unwrap();

        if (response?.success) {
          handleEditCostWorkingFlashMessage(response?.message, "success");

          dispatch(
            listCostWorkings({
              page: currentPage,
              limit: costWorkingPerPage,
              search: searchTerm,
            })
          );

          // setEditCostWorkingData({
          //   company_name: "",
          //   location: "",
          //   nature_of_work: "",
          //   technology_used: "",
          //   estimate_no: "",
          //   estimate_date: "",
          //   revision_date: "",
          //   area_to_be_coated: "",
          //   thickness_in_mm: "",
          //   labour_cost: "",
          //   cunsumable_cost: "",
          //   transport_cost: "",
          //   supervision_cost: "",
          //   contractor_profit: "",
          //   over_head_charges: "",
          //   total_application_labour_cost: "",
          //   total_project_cost: "",
          //   total_material_cost: "",
          //   products: [],
          // });

          setTimeout(() => {
            setEditCostWorkingModalOpen(false);
          }, 1000);
        } else {
          handleEditCostWorkingFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error updating cost working:", error);
        handleEditCostWorkingFlashMessage(
          error?.message || "An error occurred",
          "error"
        );
      }
    }
  };

  //end update lead================================================================================
  //delete lead==========================================================
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // ✅ Function to show delete flash messages
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
      await dispatch(removeLead(id)).unwrap();
      handleDeleteFlashMessage("Lead deleted successfully!", "success");
      dispatch(
        listLeads({
          page: currentPage,
          limit: leadPerPage,
          search: searchTerm,
        })
      );
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete lead",
        "error"
      );
    }
  };

  //end delete lead======================================================

  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/costworking/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: costWorkingPerPage,
          search: searchTerm,
        },
        responseType: "blob", // ✅ Important to keep it here
      });

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "CostWorkingManage.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              CostWorking Management
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
              {hasPermission(15, 1) && (
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={() => setIsCostWorkingModalOpen(true)}
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add New Cost
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
                    onChange={(e) =>
                      setEntriesPerPageNewData(Number(e.target.value))
                    }
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
            <CostWorkingTable
              setEditCostWorkingModalOpen={setEditCostWorkingModalOpen}
              CostWorkings={costWorkings}
              setViewCostWorkingModalOpen={setViewCostWorkingModalOpen}
              setSelectedCostWorking={setSelectedCostWorking}
              selectedCostWorking={selectedCostWorking}
              deleteFlashMessage={deleteFlashMessage}
              deleteFlashMsgType={deleteFlashMsgType}
              handleDeleteFlashMessage={handleDeleteFlashMessage}
              handleDelete={handleDelete}
            />
            {/*------- Table Data End -------*/}
          </div>
        </div>

        {/* Add User Modal */}
        {/* {isAddUserModalOpen && (
        <AddRoleModal setAddUserModalOpen={setAddUserModalOpen} />
      )} */}

        {/* Edit User Modal */}
        {isEditCostWorkingModalOpen && (
          <EditCostWorkingModal
            isEditCostWorkingModalOpen={isEditCostWorkingModalOpen}
            setEditCostWorkingModalOpen={setEditCostWorkingModalOpen}
            selectedCostWorking={selectedCostWorking}
            setSelectedCostWorking={setSelectedCostWorking}
            allCustomers={allCustomers}
            editCostWorkingData={editCostWorkingData}
            setEditCostWorkingData={setEditCostWorkingData}
            editCostWorkingFormErrors={editCostWorkingFormErrors}
            setEditCostWorkingFormErrors={setEditCostWorkingFormErrors}
            editCostWorkingFlashMessage={editCostWorkingFlashMessage}
            setEditCostWorkingFlashMessage={setEditCostWorkingFlashMessage}
            editCostWorkingFlashMsgType={editCostWorkingFlashMsgType}
            setEditCostWorkingFlashMsgType={setEditCostWorkingFlashMsgType}
            handleEditCostWorkingChange={handleEditCostWorkingChange}
            handleEditCostWorkingFlashMessage={
              handleEditCostWorkingFlashMessage
            }
            editCostWorkingValidateForm={editCostWorkingValidateForm}
            handleSubmitEditCostWorking={handleSubmitEditCostWorking}
            handleEditCostWorkingCustomerChange={
              handleEditCostWorkingCustomerChange
            }
            customerAddress={customerAddress}
          />
        )}

        {/* View User Modal */}
        {isViewCostWorkingModalOpen && (
          <ViewCostWorkingModal
            setViewCostWorkingModalOpen={setViewCostWorkingModalOpen}
            selectedCostWorking={selectedCostWorking}
          />
        )}

        {/* Assign Customer Modal */}

        {isCostWorkingModalOpen && (
          <AddCostWorkingModal
            setIsCostWorkingModalOpen={setIsCostWorkingModalOpen}
            costWorkingData={costWorkingData}
            setCostWorkingData={setCostWorkingData}
            costWorkingFormErrors={costWorkingFormErrors}
            selectedCostWorking={selectedCostWorking}
            setSelectedCostWorking={setSelectedCostWorking}
            costWorkingFlashMessage={costWorkingFlashMessage}
            costWorkingFlashMsgType={costWorkingFlashMsgType}
            handleCostWorkingChange={handleCostWorkingChange}
            handleSubmitCostWorking={handleSubmitCostWorking}
            allCustomers={allCustomers}
            customerAddress={customerAddress}
            handleCostWorkingCustomerChange={handleCostWorkingCustomerChange}
          />
        )}
        {/* Pagination Controls with Number */}
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default CostWorkingManageData;
