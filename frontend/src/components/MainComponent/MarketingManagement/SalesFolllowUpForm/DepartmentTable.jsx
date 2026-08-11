import React, { useEffect, useState, useContext, useMemo } from "react";
import { SidebarContext } from "../../../../context/sidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { addLeadCommunication } from "../../../../redux/leadSlice";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../../../../redux/authSlice";
import useGoogleCalendar from "../../../../components/hooks/useGoogleCalendar";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const getAuthToken = () => localStorage.getItem("token");

const DepartmentTable = ({
  setEditUserModalOpen,
  poaList,
  setViewModalOpen,
  selectedPOA,
  setSelectedPOA,
  isLeadAssignPopup,
  setIsLeadAssignPopup,
  setSelectedPOAId,
  selectedPOAId,
  poaReportOpen,
  setpoaReportOpen,
  listLeads,
  isViewCustomerModalOpen,
  setViewCustomerModalOpen,
  currentPage,
  poaPerPage,
  searchTerm,
}) => {
  const { poaType } = useParams();
  const location = useLocation();
  const pathSegment = location.pathname.split("/")[1];

  const dispatch = useDispatch();
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

    const sortedpoalist = useMemo(() => {
    if (!sortConfig.key) return poaList;
    return [...poaList].sort((a, b) => {
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
  }, [poaList, sortConfig]);


   const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

   //----------------- Sorting code pm ---------------------//

  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    const stored = localStorage.getItem("isCheckedIn");
    return stored ? JSON.parse(stored) : false;
  });

  const [activeLeadId, setActiveLeadId] = useState(() => {
    const stored = localStorage.getItem("activeLeadId");
    return stored ? JSON.parse(stored) : null;
  });

  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  // ✅ Load data from localStorage on mount
  useEffect(() => {
    const storedCheckIn = localStorage.getItem("checkInTime");
    const storedCheckOut = localStorage.getItem("checkOutTime");

    setCheckInTime(storedCheckIn ? storedCheckIn : null);
    setCheckOutTime(storedCheckOut ? storedCheckOut : null);
  }, []);

  useEffect(() => {
    localStorage.setItem("isCheckedIn", JSON.stringify(isCheckedIn));
    localStorage.setItem("activeLeadId", JSON.stringify(activeLeadId));
  }, [isCheckedIn, activeLeadId]);

  const handleToggle = async (lead) => {
    if (activeLeadId === lead.id && isCheckedIn) {
      setLeadStatusProgress(true);
    } else {
      await handleCheckIn(lead);
      setIsCheckedIn(true);
      setActiveLeadId(lead.id);
    }
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(`${API_URL}/geocode-address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();
      return data.address || "Address not available";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Address not available";
    }
  };

  // const getLocationName = async (latitude, longitude) => {
  //   const apiKey = `${API_KEY}`;
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     if (data.status === "OK") {
  //       return data.results[0].formatted_address;
  //     } else {
  //       throw new Error("Failed to fetch address");
  //     }
  //   } catch (error) {
  //     console.error("Error getting address: ", error);
  //     return "Address not available";
  //   }
  // };

  const handleCheckIn = async (lead) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await getLocationName(latitude, longitude);

        const now = new Date();
        const currentTime = now.toTimeString().split(":").slice(0, 2).join(":");

        const checkInData = {
          start_location: locationName,
          customer_id: lead?.customer_id,
          lead_date: new Date().toISOString().split("T")[0],
          lead_id: lead?.id,
          start_meeting_time: currentTime,
          latitude: latitude,
          longitude: longitude,
          type: "checkin",
        };

        try {
          const token = getAuthToken();
          const response = await axios.post(
            `${API_URL}/auth/lead-communication`,
            checkInData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsCheckedIn(true);
        } catch (error) {
          console.log(error);
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  //add follow up
  const { isAuthenticated, createEvent } = useGoogleCalendar();
  const navigate = useNavigate();
  const { user: userDeatail } = useSelector((state) => state.auth);
  const [leadStatusProgress, setLeadStatusProgress] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  //add followup
  const [formData, setFormData] = useState({
    end_location: "",
    end_meeting_time: "",
    followup_summary: "",
    lead_status: "",
    lead_type: "",
    lead_date: null,
    final_meeting: false,
  });

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
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "lead_date") {
      setAttendeesEmails([userDeatail.email]);
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validate Inputs
  const validateInputs = () => {
    let errors = {};
    if (!formData.followup_summary.trim())
      errors.followup_summary = "*followup_summary is required";
    if (!formData.lead_status.trim())
      errors.lead_status = "*Lead stage is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit
  const handleSubmitAddFollowUp = async () => {
    if (validateInputs()) {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const locationName = await getLocationName(latitude, longitude);
            const now = new Date();
            const currentTime = now
              .toTimeString()
              .split(":")
              .slice(0, 2)
              .join(":");

            const updatedFormData = {
              ...formData,
              end_location: locationName,
              end_meeting_time: currentTime,
              lead_id: selectedPOA?.id,
            };

            setFormData(updatedFormData); // optional, if you want to persist it
            const token = getAuthToken();

            const response = await axios.post(
              `${API_URL}/auth/end-meeting`,
              updatedFormData,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (response?.data?.success) {
              handleFlashMessage(
                response?.message || "Lead Communication added successfully!",
                "success"
              );

              //refresh the lead poa list
              if (poaType || pathSegment == "lead-sales") {
                dispatch(
                  listLeads({
                    poaType: "todayPOA",
                    page: currentPage,
                    limit: poaPerPage,
                    search: searchTerm,
                  })
                );
              } else {
                dispatch(
                  listLeads({
                    page: currentPage,
                    limit: poaPerPage,
                    search: searchTerm,
                  })
                );
              }

              setFormData({});
              setIsCheckedIn(false);
              setActiveLeadId(null);
              localStorage.removeItem("isCheckedIn");
              localStorage.removeItem("activeLeadId");

              if (isAuthenticated) {
                handleAddEvent(updatedFormData);
              }

              setTimeout(() => {
                setLeadStatusProgress(false);
              }, 1000);
            } else {
              handleFlashMessage(
                response?.message || "Something went wrong",
                "error"
              );
            }
          });
        } else {
          console.error("Geolocation is not supported by this browser.");
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
    const leadDateValue =
      formData?.lead_date && !isNaN(Date.parse(formData.lead_date))
        ? new Date(formData.lead_date)
        : new Date(); // fallback to today

    const startDateTime = leadDateValue;
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = {
      title: "Meeting Sheduled",
      location: selectedPOA?.lead_address,
      description: formData?.lead_text,
      // startDateTime: formData?.lead_date,
      // endDateTime: formData?.lead_date,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      attendeesEmails: attendeesEmails,
    };
    //console.log("event", event);
    createEvent(event);
  };

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
  //end google calender (poa) event add
  //end add follow up

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

      <div className={`overflow-x-auto custom-scrollbar w-full max-h-[360px]`}>
        <table className="table-auto min-w-[1200px] w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap "onClick={()=> handleSort("customer.company_name")}>
                Company Name{renderSortIcon("customer.company_name")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={()=> handleSort("lead_source")}>
                Lead Source{renderSortIcon("lead_source")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={()=> handleSort("contactPerson.name")}>
                Contact Person Name{renderSortIcon("contactPerson.name")}
              </th>

              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={()=> handleSort("assignedPerson.fullname")}>
                Sales Person Name{renderSortIcon("assignedPerson.fullname")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={()=> handleSort("assign_date")}>
                Meeting Date{renderSortIcon("assign_date")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={() => handleSort("next_followup")}>
                Next Meeting Date{renderSortIcon("next_followup")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap " onClick={() => handleSort("meeting_time")}>
            Meeting Time {renderSortIcon("meeting_time")}
              </th>
              <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                Meeting Summary
              </th>

              {userDeatail?.employeeRole?.role_id === 3 &&
                (poaType === "todayPOA" || pathSegment == "lead-sales") && (
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                    Action
                  </th>
                )}
            </tr>
          </thead>
          <tbody>
            {sortedpoalist?.map((user, index) => (
              <tr key={index}>
                <td
                  className="relative group px-4 py-2 text-newtextdata whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    setSelectedPOA(user);
                    //setpoaReportOpen(true);
                    setViewCustomerModalOpen(true);
                  }}
                >
                  {user.customer?.company_name ?? null}
                </td>
                <td className="px-1 py-0 text-newtextdata text-center">
                  <button
                    className={`px-1 py-0 text-white font-semibold rounded ${getButtonColor(
                      user?.lead_source
                    )}`}
                  >
                    {user?.lead_source ?? "Other"}
                  </button>
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.contactPerson?.name ?? null}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user.assignedPerson?.fullname ?? null}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.next_followup?.split("T")[0] ===
                  new Date().toISOString().split("T")[0]
                    ? user?.next_followup?.split("T")[0]
                    : user?.assign_date
                    ? user?.assign_date?.split("T")[0]
                    : "-"}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.next_followup?.split("T")[0] ===
                  new Date().toISOString().split("T")[0]
                    ? "-"
                    : user?.next_followup?.split("T")[0] || "-"}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  {user?.meeting_time}
                </td>
                <td className="px-4 py-2 text-newtextdata whitespace-nowrap w-[480px] ">
                  {user?.lead_summary}
                </td>
                {/* {poaType === "todayPOA" || pathSegment == "lead-sales"
                ? "Today's Plan of Action (POA)"
                : "Visit Plan (POA)"} */}
                {userDeatail?.employeeRole?.role_id === 3 &&
                  (poaType === "todayPOA" || pathSegment == "lead-sales") && (
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      {!user.meeting_end ? (
                        <button
                          onClick={() => {
                            handleToggle(user);
                            setSelectedPOA(user);
                          }}
                          className={`float-end mt-2 text-[12px] text-white px-2 py-1 rounded transition-all duration-300 ${
                            isCheckedIn && activeLeadId === user.id
                              ? "bg-red-600 hover:bg-red-800"
                              : "bg-green-600 hover:bg-green-800"
                          }`}
                        >
                          {isCheckedIn && activeLeadId === user.id
                            ? "Meeting End"
                            : "Meeting Start"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="float-end mt-2 text-[12px] text-white px-2 py-1 rounded transition-all duration-300 bg-red-600 opacity-50 cursor-not-allowed"
                        >
                          Meeting Done
                        </button>
                      )}
                    </td>
                  )}
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
                    Lead Stage :
                  </label>
                  <select
                    name="lead_status"
                    value={formData.lead_status}
                    onChange={handleChange}
                    className="block w-full mb-2 rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-1 py-[9px]"
                  >
                    <option>Select the Stage</option>
                    <option value="Meeting">Meeting Done</option>
                    <option value="Revisit">Revisit</option>
                    <option value="Queries">Queries</option>
                    <option value="In discussion">In Discussion</option>
                    <option value="ProposalSent">Proposal Sent</option>
                    <option value="Demo Completed">Demo Completed</option>
                  </select>
                  {formErrors.lead_status && (
                    <p className="text-red-500 text-sm">
                      {formErrors.lead_status}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-poppins font-medium text-black text-[16px]">
                    Lead Status :
                  </label>
                  <select
                    name="lead_type"
                    value={formData.lead_type}
                    onChange={handleChange}
                    className="block w-full mb-2 rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-1 py-[9px]"
                  >
                    <option>Select the Status</option>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Lost">Lost</option>
                  </select>
                  {formErrors.lead_type && (
                    <p className="text-red-500 text-sm">
                      {formErrors.lead_type}
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
                    Final Meeting:
                  </label>
                  <div className="flex items-center w-full h-[40px] rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
                    <input
                      type="checkbox"
                      name="final_meeting"
                      checked={formData.final_meeting}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-[#473b33] border border-[#473b33]"
                    />
                    <span className="ml-2 font-poppins font-medium text-black text-[16px]">
                      Final Meeting
                    </span>
                  </div>
                </div>

                <div>
                  <label className="font-poppins font-medium text-black text-[16px]">
                    Meeting Summary :
                  </label>
                  <textarea
                    type="text"
                    name="followup_summary"
                    value={formData.followup_summary}
                    onChange={handleChange}
                    placeholder="Detail Note for Lead"
                    className="block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                  {formErrors.followup_summary && (
                    <p className="text-red-500 text-sm">
                      {formErrors.followup_summary}
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
