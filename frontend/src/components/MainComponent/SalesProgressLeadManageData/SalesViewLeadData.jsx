import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getLeadById,
  addLeadCommunication,
  leadCommunicationById,
} from "../../../redux/leadSlice";
import "./SalesProgressMange.css";
import SingleLeadTable from "./SingleLeadTable";
import { useNavigate } from "react-router-dom";
import ContentTop from "../../ContentTop/ContentTop";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import Pagination from "./Pagination";

const SalesViewLeadData = () => {
  const { leadId } = useParams();
  const dispatch = useDispatch();
  const { lead, communicationleadsList, totalPages, leadLoading, leadError } =
    useSelector((state) => state.lead);

  console.log("communicationleadsList", communicationleadsList);
  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const leadCumPerPage = 5;

  useEffect(() => {
    if (leadId) {
      dispatch(getLeadById({ leadId }));
      dispatch(
        leadCommunicationById({
          leadId: leadId,
          page: currentPage,
          limit: leadCumPerPage,
          search: searchTerm,
        })
      );
    }
  }, [dispatch, leadId, currentPage, searchTerm]);
  const navigate = useNavigate();
  const [leadStatusProgress, setLeadStatusProgress] = useState(false);
  const [leadStatusData, setLeadStatusData] = useState(false);

  //add followup
  const [formData, setFormData] = useState({
    lead_id: "",
    customer_id: "",
    lead_owner_id: "",
    client_name: "",
    lead_text: "",
    lead_status: "",
    lead_date: "",
    start_meeting_time: "",
    end_meeting_time: "",
    next_meeting_time: "",
  });

  // Update formData when lead data is available
  useEffect(() => {
    if (lead?.data) {
      setFormData({
        lead_id: lead?.data?.id || "",
        customer_id: lead?.data?.customer_id || "",
        lead_owner_id: lead?.data?.lead_owner_id || "",
        client_name: lead?.data?.customer?.client_name || "",
        lead_text: formData.lead_text, // Keep existing lead_text if already typed
        lead_status: formData.lead_status, // Keep existing lead_status
        lead_date: formData.lead_date, // Keep existing lead_date
        start_meeting_time: formData.start_meeting_time,
        end_meeting_time: formData.end_meeting_time,
        next_meeting_time: formData.next_meeting_time,
      });
    }
  }, [lead]);

  const [formErrors, setFormErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

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
    // New validations for meeting times
    if (!formData.start_meeting_time.trim())
      errors.start_meeting_time = "*Start meeting time is required";
    if (!formData.end_meeting_time.trim())
      errors.end_meeting_time = "*End meeting time is required";
    if (!formData.next_meeting_time.trim())
      errors.next_meeting_time = "*Next meeting time is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit
  const handleSubmitAddFollowUp = async () => {
    //e.preventDefault();

    if (validateInputs()) {
      try {
        console.log("formData", formData);
        const response = await dispatch(
          addLeadCommunication(formData)
        ).unwrap();

        if (response?.success) {
          handleFlashMessage(
            response?.message || "Lead Communication added successfully!",
            "success"
          );

          dispatch(
            leadCommunicationById({
              leadId: leadId,
              page: currentPage,
              limit: leadCumPerPage,
              search: searchTerm,
            })
          );

          // Reload lead list after adding lead
          // dispatch(
          //   listLeads({
          //     page: currentPage,
          //     limit: leadsPerPage,
          //     search: searchTerm,
          //   })
          // );

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="fixed top-5 right-5 z-50">
        {flashMessage && flashMsgType === "success" && (
          <SuccessMessage message={flashMessage} />
        )}
        {flashMessage && flashMsgType === "error" && (
          <ErrorMessage message={flashMessage} />
        )}
      </div>
      <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
            <div>
              <h1 className="text-white text-textdata whitespace-nowrap font-semibold flex items-center cursor-pointer" onClick={() => navigate(-1)}>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => navigate(-1)}
                  className="cursor-pointer"
                >
                  <path
                    d="M22.5 27L13.5 18L22.5 9"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="border border-gray-300 px-3 rounded-[5px]">Back</span> &nbsp;&nbsp;&nbsp;Full Details of Lead
              </h1>
            </div>
          </div>
          <div className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6">
            <div className="w-full">
              {/*------- Table Data Start -------*/}
              <SingleLeadTable
                setLeadStatusProgress={setLeadStatusProgress}
                LeadSingleData={lead?.data}
              />
              {/*------- Table Data End -------*/}

              {/*--------- Follow Up Data Start -------*/}
              {leadStatusProgress && (
                <div className="mt-5 md:mt-9 bg-white w-full pt-0 pb-4 rounded-[6px] flex flex-col">
                  <h2 className="text-white text-textdata whitespace-nowrap font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
                    Follow Up Form
                  </h2>
                  <div className="px-4 grid grid-cols-1 md:grid-cols-1 gap-4 overflow-y-auto md:h-[380px]">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
                        </select>
                        {formErrors.lead_status && (
                          <p className="text-red-500 text-sm">
                            {formErrors.lead_status}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-black text-[16px]">
                          Meeting Start time :
                        </label>
                        <input
                          type="time"
                          name="start_meeting_time"
                          value={formData.start_meeting_time}
                          onChange={handleChange}
                          placeholder="Start Meeting Time"
                          className="block w-full mb-2 h-[40px] rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                        {formErrors.start_meeting_time && (
                          <p className="text-red-500 text-sm">
                            {formErrors.start_meeting_time}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-black text-[16px]">
                          Meeting End Time :
                        </label>
                        <input
                          type="time"
                          name="end_meeting_time"
                          value={formData.end_meeting_time}
                          onChange={handleChange}
                          placeholder="End Meeting Time"
                          className="block w-full mb-2 h-[40px] rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                        {formErrors.end_meeting_time && (
                          <p className="text-red-500 text-sm">
                            {formErrors.end_meeting_time}
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
                          Next Meeting Start Time :
                        </label>
                        <input
                          type="time"
                          name="next_meeting_time"
                          value={formData.next_meeting_time}
                          onChange={handleChange}
                          placeholder="Next Meeting Time"
                          className="block w-full mb-2 h-[40px] rounded-[5px] text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                        {formErrors.next_meeting_time && (
                          <p className="text-red-500 text-sm">
                            {formErrors.next_meeting_time}
                          </p>
                        )}
                      </div>

                      <div>
                        <button
                          className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
                          onClick={() => {
                            handleSubmitAddFollowUp();
                            setLeadStatusData(true);
                            //setLeadStatusProgress(false);
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/*--------- Follow Up Data End -------*/}
            </div>
            {/*-------------- Data Showing With the Follow Of Status ------------*/}
            {/* {leadStatusData && (  */}
            <div className="w-full mt-8 overflow-x-auto">
              <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
                <div>
                  <input
                    type="search"
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                    <th className="px-4 py-2 text-left text-bgDataNew">Id</th>
                    <th className="px-4 py-2 text-left text-bgDataNew">Next Meeting Date</th>
                    <th className="px-4 py-2 text-left text-bgDataNew">Next Meeting Time</th>
                    <th className="px-4 py-2 text-left text-bgDataNew">
                      Company Name
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew">
                      Client Name
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew">
                      Communication
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {communicationleadsList?.data &&
                    communicationleadsList?.data.map((user, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{index + 1}</td>
                        {/* <td className="px-4 py-2">{user?.lead_date?.split('T')[0]}</td> */}
                        <td className="px-4 py-2">
                          {new Date(user?.lead_date)?.toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-2">
                         {user?.next_meeting_time}
                        </td>
                        <td className="px-4 py-2">
                          {user?.Customer?.company_name}
                        </td>
                        <td className="px-4 py-2">{user?.client_name}</td>
                        <td className="px-4 py-2 w-[300px]">
                          {user?.lead_text}
                        </td>
                        <td className="px-4 py-2">{user?.lead_status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls with Number */}
            <Pagination
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              totalPages={totalPages}
            />
            {/* )} */}
            {/*-------------- Data Showing With the Follow Of Status ------------*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesViewLeadData;
