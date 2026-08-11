import React, { useEffect, useState, useContext,useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listDepartments,
  removeDepartment,
} from "../../../redux/departmentSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { SidebarContext } from "../../../context/sidebarContext";
import { addLeadCommunication } from "../../../redux/leadSlice";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../../../redux/authSlice";
import useGoogleCalendar from "../../../components/hooks/useGoogleCalendar";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";

const DepartmentTable = ({
  Leads,
  setEditUserModalOpen,
  setViewModalOpen,
  setIsAssignModalOpen,
  selectedLead,
  setSelectedLead,
  deleteFlashMessage,
  deleteFlashMsgType,
  handleDeleteFlashMessage,
  handleDelete,
  updateDealFinalize,
  isLeadAssignPopup,
  setIsLeadAssignPopup,
  setSelectedPOAId,
  selectedPOAId,
  // fetchCustomerHistory,
  setViewCustomerHistoryCardModalOpen,
  dealCreationOpenForm,
  setDealCreationOpenForm,
  setDealData,
  isViewCustomerModalOpen,
  setViewCustomerModalOpen,
  selectedPOAIds,
  setSelectedPOAIds,
  poaReportOpen,
  setpoaReportOpen,
}) => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();
  const { isAuthenticated, createEvent } = useGoogleCalendar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: userDeatail } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useContext(SidebarContext);


  //----------------- Sorting code pm ---------------------//
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

    const sortedlead = useMemo(() => {
    if (!sortConfig.key) return Leads;
    return [...Leads].sort((a, b) => {
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
  }, [Leads, sortConfig]);


   const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

   //----------------- Sorting code pm ---------------------//


  const [leadStatusProgress, setLeadStatusProgress] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  //add followup
  const [formData, setFormData] = useState({
    lead_id: "",
    customer_id: "",
    lead_owner_id: "",
    client_name: "",
    lead_text: "",
    lead_status: "",
    lead_date: "",
  });

  //console.log("follow up formData", formData);

  const [formErrors, setFormErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");
  const [attendeesEmails, setAttendeesEmails] = useState([]);

  // Show flash message for success or error
  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 3000);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setAttendeesEmails([userDeatail.email]); // If you want an array of one email
    // Clear error when user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Validate Inputs
  const validateInputs = () => {
    let errors = {};
    if (!formData.lead_text.trim()) errors.lead_text = "*Lead text is required";
    if (!formData.lead_status.trim())
      errors.lead_status = "*Lead status is required";
    if (!formData.lead_date.trim()) errors.lead_date = "*Lead date is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit
  const handleSubmitAddFollowUp = async () => {
    if (validateInputs()) {
      try {
        //console.log("formData", formData);
        const response = await dispatch(
          addLeadCommunication(formData)
        ).unwrap();

        if (response?.success) {
          handleFlashMessage(
            response?.message || "Lead Communication added successfully!",
            "success"
          );

          //add google calender event
          if (isAuthenticated) {
            handleAddEvent(formData);
          }
          // Close modal after successful submission
          setTimeout(() => {
            setLeadStatusProgress(false);
          }, 1000);
        } else {
          handleFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error adding lead:", error);
        handleFlashMessage(error?.message || "An error occurred", "error");
      }
    }
  };
  //end add followup

  //google calender (poa) event add
  const handleAddEvent = (formData) => {
    const event = {
      title: "Meeting Sheduled",
      location: selectedLead?.lead_address,
      description: formData?.lead_text,
      startDateTime: formData?.lead_date,
      endDateTime: formData?.lead_date,
      attendeesEmails: attendeesEmails,
    };
    console.log("event", event);
    createEvent(event);
  };
  //end google calender (poa) event add

  const getButtonColor = (source) => {
    switch (source) {
      case "Marketing":
        return "bg-red-500";
      case "Sales":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
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
      <div className="overflow-x-auto custom-scrollbar max-h-[360px]">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-orange-500"
                  disabled
                />
              </th>
             
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={()=> handleSort("customer.company_name")}>
                Company Name{renderSortIcon("customer.company_name")}
              </th>
               <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={() => handleSort("lead_source")}>
            Lead Source {renderSortIcon("lead_source")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("customer.email_id")}>
            Email {renderSortIcon("customer.email_id")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("customer.primary_contact")}>
            Phone {renderSortIcon("customer.primary_contact")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("leadOwner.fullname")}>
            Lead Owner {renderSortIcon("leadOwner.fullname")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("contactPerson.name")}>
            Contact Person Name {renderSortIcon("contactPerson.name")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("assignedPerson.fullname")}>
            Sales Person Name {renderSortIcon("assignedPerson.fullname")}
              </th>

              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("communications[0].lead_date")}>
            Meeting Date {renderSortIcon("communications[0].lead_date")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("meeting_type")}>
            Meeting Type {renderSortIcon("meeting_type")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" onClick={() => handleSort("communications[0].lead_type")}>
            Lead Status {renderSortIcon("communications[0].lead_type")}
              </th>
              {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" >
                Meeting Summary
              </th> */}
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap" >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedlead?.map((user, index) => (
              <tr key={index} className="">
                <td className="px-4 py-2 text-newtextdata ">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-orange-500"
                    //checked={selectedPOAId === user.id}
                    // onChange={() => {
                    //   setSelectedPOAId(user.id);
                    //   setSelectedLead(user);
                    //   //setIsLeadAssignPopup(true);
                    // }}
                    checked={selectedPOAIds.includes(user.id)}
                    onChange={() => {
                      if (selectedPOAIds.includes(user.id)) {
                        // remove if already selected
                        setSelectedPOAIds(
                          selectedPOAIds.filter((id) => id !== user.id)
                        );
                      } else {
                        // add if not selected
                        setSelectedPOAIds([...selectedPOAIds, user.id]);
                      }
                    }}
                  />
                </td>
                {/* <td className="px-4 py-2 text-newtextdata">{index + 1}</td> */}
                <td
                  className="relative group cursor-pointer px-4 py-2 text-newtextdata whitespace-nowrap  cursor-pointer"
                  onClick={() => {
                    setSelectedLead(user);
                    //setViewCustomerModalOpen(true);
                    setpoaReportOpen(true);
                  }}
                >
                  {(() => {
                    const companyName = user?.customer?.company_name || "";
                    const words = companyName.split(" ");
                    return words.length > 2
                      ? `${words.slice(0, 2).join(" ")}...`
                      : companyName;
                  })()}

                  {/* Tooltip on hover */}
                  {(() => {
                    const companyName = user?.customer?.company_name || "";
                    const words = companyName?.split(" ");
                    const tooltipWidth =
                      words.length <= 4 ? "w-auto" : "w-[300px]";

                    return (
                      <div
                        className={`absolute z-10 hidden group-hover:block bg-white text-gray-800 text-sm rounded-md px-3 py-1 top-10 left-[75%] -translate-x-1/2 whitespace-normal ${tooltipWidth} shadow-lg text-center`}
                      >
                        {companyName}
                      </div>
                    );
                  })()}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.lead_source && (
                  <button
                    className={`px-2 py-1 text-white font-semibold rounded ${getButtonColor(
                      user?.lead_source
                    )}`}
                  >
                    {user?.lead_source ?? ""}
                  </button>)}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.customer?.email_id ?? null}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.customer?.primary_contact ?? null}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.leadOwner?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.contactPerson?.name ?? null}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.assignedPerson?.fullname}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {/* {user?.assign_date?.split("T")[0]} */}
                  {user?.communications[0]?.lead_date?.split("T")[0]}
                  {/* {user?.next_followup ? user?.next_followup?.split("T")[0] : user?.assign_date?.split("T")[0]} */}
                </td>

                {/* <td className="px-4 py-2 text-newtextdata">
                  {user?.customer?.client_name}
                </td> */}
                <td className="px-4 py-2 text-newtextdata">
                  {user?.meeting_type}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.communications[0]?.lead_type}
                </td>
                {/* <td className="px-4 py-2 text-newtextdata"> */}
                {/* {user?.lead_summary} */}
                {/* {user?.communications[0]?.lead_text} */}
                {/* {user?.communications[0]?.lead_text?.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))} */}
                {/* </td> */}
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap flex items-center space-x-2 text-center">
                  {/* <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 mb-2"
                onClick={() => {
                setIsAssignModalOpen(true)
              }}
              >
                Assign Lead
              </button> */}
                  {/* <button
                    className="bg-[#bf9c85] text-white px-3 py-1 rounded hover:bg-green-600"
                    //onClick={() => updateDealFinalize(user?.id)}
                    onClick={() => {
                      // updateDealFinalize(user?.id)
                      setSelectedLead(user);
                      setFormData((prev) => ({
                        ...prev,
                        lead_id: user.id,
                        customer_id: user?.customer_id || "",
                        lead_owner_id: user?.lead_owner_id || "",
                        client_name: user?.contact_person_name || "",
                        lead_text: formData.lead_text, // Keep existing lead_text if already typed
                        lead_status: formData.lead_status, // Keep existing lead_status
                        lead_date: formData.lead_date, // Keep existing lead_date
                      }));
                      setLeadStatusProgress(true);
                    }}
                  >
                    Followup
                  </button> */}
                  {hasPermission(4, 2) && (
                    <button
                      className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-green-600"
                      //onClick={() => updateDealFinalize(user?.id)}
                      onClick={() => {
                        // updateDealFinalize(user?.id)
                        setSelectedLead(user);
                        // setDealData((prev) => ({
                        //   ...prev,
                        //   lead_id: user.id,
                        // }));
                        setDealCreationOpenForm(true);
                      }}
                    >
                      Deal
                    </button>
                  )}
                  {hasPermission(4, 4) && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedLead(user);
                        setViewModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}

                  {/* {userDeatail?.employeeRole?.role_id !== 3 && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => {
                        setSelectedLead(user);
                        setEditUserModalOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )} */}

                  {hasPermission(4, 3) && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this lead?"
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
        {leadStatusProgress && (
          <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full md:w-[900px] pt-0 pb-4 rounded-[6px] flex flex-col">
              <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
                Follow Up Form
              </h2>
              <div className="mt-5 md:mt-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto md:h-fit">
                <div>
                  <label className="font-poppins font-medium text-black text-[16px]">
                    Lead Status :
                  </label>
                  <select
                    name="lead_status"
                    value={formData.lead_status}
                    onChange={handleChange}
                    className="block w-full mb-2 rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-1 py-[9px]"
                  >
                    <option>Select the Status</option>
                    <option value="Meeting">Meeting Done</option>
                    <option value="Revisit">Revisit</option>
                    <option value="Queries">Queries</option>
                    <option value="ProposalSent">Proposal Sent</option>
                    <option value="Discussion">Discussion</option>
                    <option value="Lost">Lost</option>
                    <option value="Lost">Demo Completed</option>
                    <option value="Lost">Not interested</option>
                    <option value="Lost">Order Confirmed</option>
                  </select>
                  {formErrors.lead_status && (
                    <p className="text-red-500 text-sm">
                      {formErrors.lead_status}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-poppins font-medium text-black text-[16px]">
                    Next Metting Date :
                  </label>
                  <input
                    type="date"
                    name="lead_date"
                    value={formData.lead_date}
                    onChange={handleChange}
                    placeholder="Date"
                    min={new Date().toISOString().split("T")[0]}
                    className="block w-full mb-2 h-[40px] rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                  {formErrors.lead_date && (
                    <p className="text-red-500 text-sm">
                      {formErrors.lead_date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-poppins font-medium text-black text-[16px]">
                    Description :
                  </label>
                  <textarea
                    type="text"
                    name="lead_text"
                    value={formData.lead_text}
                    onChange={handleChange}
                    placeholder="Detail Note for Lead"
                    className="block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                  {formErrors.lead_text && (
                    <p className="text-red-500 text-sm">
                      {formErrors.lead_text}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-end justify-end gap-2 px-4 mt-3">
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
                  onClick={() => {
                    handleSubmitAddFollowUp();
                  }}
                >
                  Submit
                </button>

                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
                  onClick={() =>
                    navigate(`/lead-followups/${formData?.lead_id}`)
                  }
                >
                  View Follow
                </button>
                <button
                  className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setLeadStatusProgress(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DepartmentTable;
