import React, { useState, useEffect, useRef } from "react";
import LocationPickerModal from "../../Common/LocationPickerModal";
//for google map
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

import { useDispatch, useSelector } from "react-redux";
import "./SalesProgressMange.css";
import { iconsImgs } from "../../../utils/images";
import DepartmentTable from "./DepartmentTable";
import Pagination from "./Pagination";
import AddRoleModal from "./AddRoleModal";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import ContentTop from "../../ContentTop/ContentTop";
import UserContentTop from "../../ContentTop/UserContentTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDollarSign,
  faPhone,
  faHandshake,
  faClock,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

import { fetchCurrentUser } from "../../../redux/authSlice";
import {
  todaysAssignedLeadsCount,
  todaysLead,
  pendingFollowupCount,
  getTotalsaleBySalePerson,
  getUserTotalVisits,
} from "../../../redux/leadSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

import axios from "axios";
import Calender from "../../calender/Calender";
import { useNavigate } from "react-router-dom";
import SalesPersonFollowUp from "../MarketingManagement/SalesFolllowUpForm/SalesPersonFollowUp";
import { useGetMyTasksQuery } from "../../../redux/services/taskService";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SalesProgressMange = ({ isLoaded }) => {
  const { data: myTasks, isLoading, isError } = useGetMyTasksQuery();

  //console.log("myTasks", myTasks?.tasks?.length);

  const [modalOpen, setModalOpen] = useState(false);

  const handleLocationConfirm = (locationData) => {
    console.log("Confirmed Location:", locationData);
    // send to your check-in API here
  };

  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [checkOutPickerOpen, setCheckOutPickerOpen] = useState(false);

  const [pickedLocation, setPickedLocation] = useState(null);

  const openLocationPicker = () => {
    setLocationPickerOpen(true);
  };

  // const submitCheckIn = async (locationData) => {
  //   const checkInData = {
  //     emp_id: userDeatail?.id,
  //     latitude: locationData.latitude,
  //     longitude: locationData.longitude,
  //     checkin_location: locationData.address,
  //     data: new Date().toISOString().split("T")[0],
  //   };

  //   //console.log("checkInData", checkInData);

  //   try {
  //     const token = getAuthToken();
  //     const response = await axios.post(
  //       `${API_URL}/auth/checkin`,
  //       checkInData,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const checkInTime = new Date(
  //       response?.data?.checkInRecord?.check_in_time
  //     );
  //     const now = new Date();
  //     localStorage.setItem("checkInTime", now.toISOString());
  //     setCheckInTime(now);
  //     setCheckOutTime(null);
  //     localStorage.removeItem("checkOutTime");
  //     setIsCheckedIn(true);

  //     handleFlashMessage(response?.data?.message, "success");
  //   } catch (error) {
  //     handleFlashMessage(error || "Failed to check in", "error");
  //   }
  // };

  // const handleCheckOut = async (locationData) => {
  //   const { latitude, longitude, address } = locationData;

  //   const checkOutData = {
  //     emp_id: userDeatail?.id,
  //     latitude,
  //     longitude,
  //     checkout_location: address,
  //     data: new Date().toISOString().split("T")[0],
  //   };

  //   try {
  //     const token = getAuthToken();
  //     const response = await axios.post(
  //       `${API_URL}/auth/checkout`,
  //       checkOutData,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     const checkOutTime = new Date(
  //       response?.data?.checkOutRecord?.check_out_time
  //     );
  //     const formattedTime = checkOutTime.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });

  //     setIsCheckedIn(false);
  //     //localStorage.removeItem(`${prefix}isCheckedIn`);
  //     setCheckOutTime(formattedTime);
  //     setCheckInTime(null);
  //     localStorage.setItem("checkOutTime", formattedTime);
  //     localStorage.removeItem("checkInTime");

  //     setElapsedTime("");

  //     handleFlashMessage(response?.data?.message, "success");
  //   } catch (error) {
  //     handleFlashMessage(error || "Failed to check out", "error");
  //   }
  // };

  const prefix = "saleperson_";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: userDeatail } = useSelector((state) => state.auth);
  const {
    allLeadsCount,
    salesPersonleads,
    pendingFCount,
    totalsalebysalespersonCount,
    totalPages,
    totaluserVisit,
  } = useSelector((state) => state.lead);

  //console.log("totaluserVisit", totaluserVisit?.totalVisits);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const leadPerPage = 10;

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(todaysAssignedLeadsCount());
    dispatch(pendingFollowupCount());
    dispatch(getTotalsaleBySalePerson());
    dispatch(getUserTotalVisits());
    dispatch(
      todaysLead({ page: currentPage, limit: leadPerPage, search: searchTerm })
    );
    // eslint-disable-next-line
  }, [dispatch, currentPage, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //const [searchTerm, setSearchTerm] = useState("");
  const [leadDataShowNew, setLeadDataShowNew] = useState(false);

  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);

  ///check in checkout button
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 1000);
  };

  //const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    const storedCheckIn = localStorage.getItem("checkInTime");
    const storedCheckOut = localStorage.getItem("checkOutTime");

    if (storedCheckIn) setCheckInTime(new Date(storedCheckIn));
    if (storedCheckOut) setCheckOutTime(storedCheckOut);
  }, []);

  useEffect(() => {
    if (checkInTime && !checkOutTime) {
      timerRef.current = setInterval(() => {
        const now = new Date();
        const diff = now - new Date(checkInTime);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
    }

    if (checkOutTime && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [checkInTime, checkOutTime]);

  // const [isCheckedIn, setIsCheckedIn] = useState(() => {
  //   const stored = localStorage.getItem(`${prefix}isCheckedIn`);
  //   return stored ? JSON.parse(stored) : false;
  // });
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  //checkin checkout status button toggle
  const [buttonText, setButtonText] = useState("Check In");

  const fetchAttendanceStatus = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/attendance-status`, {
        params: { emp_id: userDeatail?.id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "checkin") {
        setIsCheckedIn(true);
      } else {
        setIsCheckedIn(false);
      }
    } catch (error) {
      console.error("Status fetch error", error);
    }
  };

  useEffect(() => {
    if (userDeatail?.id) {
      fetchAttendanceStatus();
    }
  }, [userDeatail?.id]);

  //end checkin checkout status

  // ✅ Load data from localStorage on mount
  // useEffect(() => {
  //   const storedCheckIn = localStorage.getItem("checkInTime");
  //   const storedCheckOut = localStorage.getItem("checkOutTime");

  //   setCheckInTime(storedCheckIn ? storedCheckIn : null);
  //   setCheckOutTime(storedCheckOut ? storedCheckOut : null);
  // }, []);

  useEffect(() => {
    localStorage.setItem(`${prefix}isCheckedIn`, JSON.stringify(isCheckedIn));
  }, [isCheckedIn]);

  const handleToggle = async () => {
    if (isCheckedIn) {
      await handleCheckIn();
      //await handleCheckOut();
      //setIsCheckedIn(false);
      //setLocationPickerOpen(true);
    } else {
      await handleCheckOut();
      //await handleCheckIn();
      //setIsCheckedIn(true);
      //setCheckOutPickerOpen(true);
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

  const handleCheckIn = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await getLocationName(latitude, longitude);

        const checkInData = {
          emp_id: userDeatail?.id,
          latitude,
          longitude,
          checkin_location: locationName,
          data: new Date().toISOString().split("T")[0],
        };

        //console.log("checkInData", checkInData);

        try {
          const token = getAuthToken();
          //console.log("token",token);
          const response = await axios.post(
            `${API_URL}/auth/checkin`,
            checkInData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const checkInTime = new Date(
            response?.data?.checkInRecord?.check_in_time
          );

          const now = new Date();
          localStorage.setItem("checkInTime", now.toISOString());
          setCheckInTime(now);
          setCheckOutTime(null);
          localStorage.removeItem("checkOutTime");
          setIsCheckedIn(true);

          fetchAttendanceStatus();
          handleFlashMessage(response?.data?.message, "success");
        } catch (error) {
          handleFlashMessage(error || "Failed to check in", "error");
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleCheckOut = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await getLocationName(latitude, longitude);
        const checkOutData = {
          emp_id: userDeatail?.id,
          latitude,
          longitude,
          checkout_location: locationName,
          data: new Date().toISOString().split("T")[0],
        };

        try {
          const token = getAuthToken();
          const response = await axios.post(
            `${API_URL}/auth/checkout`,
            checkOutData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const checkOutTime = new Date(
            response?.data?.checkOutRecord?.check_out_time
          );
          const formattedTime = checkOutTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          setIsCheckedIn(false);
          setCheckOutTime(formattedTime);
          setCheckInTime(null);
          localStorage.setItem("checkOutTime", formattedTime);
          localStorage.removeItem("checkInTime");
          setElapsedTime("");
          fetchAttendanceStatus();
          handleFlashMessage(response?.data?.message, "success");
        } catch (error) {
          handleFlashMessage(error || "Failed to check out", "error");
          //return console.log(error.response?.data || "Failed to check out");
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  //google map

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  // Example: Salesperson's lat and lng

  const [checkinLocations, setCheckinLocations] = useState([]);

  const getcheckinLocations = async () => {
    try {
      const token = getAuthToken();
      //console.log("token",token);
      const response = await axios.get(`${API_URL}/auth/get-todays-location`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      //console.log("response",response?.data?.data);
      setCheckinLocations(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getcheckinLocations();
  }, []);

  // const { isLoaded } = useJsApiLoader({
  //   id: "55383078377-kpkl3r1n0qo8937ltrskk3ane2cvmoge.apps.googleusercontent.com",
  //   googleMapsApiKey: `${API_KEY}`, // replace with your actual API key
  // });

  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState(null);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const defaultCenter = { lat: 22.9734, lng: 78.6569 };
  const center =
    checkinLocations.length > 0 ? checkinLocations[0] : defaultCenter;

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }
  //google map
  return (
    <div className="main-content">
      <UserContentTop
        isCheckedIn={isCheckedIn}
        setIsCheckedIn={setIsCheckedIn}
        handleCheckOut={handleCheckOut}
      />

      {!leadDataShowNew && (
        <div className="main-content-holder max-h-[600px] overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* chech in check out  */}
            <div className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 cursor-pointer">
              <FontAwesomeIcon
                icon={faClock}
                className="text-2xl md:text-3xl text-bgDataNew mb-2"
              />
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap font-semibold">
                {" "}
                <button
                  onClick={handleToggle}
                  className={`float-end mt-2 text-right text-[12px] text-white px-2 py-1 rounded transition-all duration-300 ${
                    !isCheckedIn
                      ? "bg-red-600 hover:bg-red-800"
                      : "bg-green-600 hover:bg-green-800"
                  }`}
                >
                  {isCheckedIn ? "Check In" : "Check Out"}
                </button>
                {/* <LocationPickerModal
                  isOpen={locationPickerOpen}
                  onClose={() => setLocationPickerOpen(false)}
                  onConfirm={async (locationData) => {
                    setLocationPickerOpen(false);
                    setPickedLocation(locationData);
                    await submitCheckIn(locationData);
                    fetchAttendanceStatus(); // safely check latest from backend
                  }}
                  isLoaded={isLoaded}
                />
                <LocationPickerModal
                  isOpen={checkOutPickerOpen}
                  onClose={() => setCheckOutPickerOpen(false)}
                  onConfirm={async (locationData) => {
                    setCheckOutPickerOpen(false);
                    await handleCheckOut(locationData);
                    fetchAttendanceStatus();
                  }}
                  isLoaded={isLoaded}
                /> */}
              </h2>
              <p className="text-[12px]">
                {!checkInTime && !checkOutTime && (
                  <span className="text-bgDataNew">No check-in yet.</span>
                )}

                {checkInTime && !checkOutTime && (
                  <span className="text-bgDataNew text-[13px]">
                    {elapsedTime}
                  </span>
                )}

                {checkOutTime && (
                  <span className="text-bgDataNew text-[13px]">
                    Checked out.
                  </span>
                )}
              </p>
            </div>
            <div
              className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 cursor-pointer"
              onClick={() => {
                navigate("/plan-of-action-for-day/todayPOA");
              }}
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-2xl md:text-3xl text-bgDataNew mb-2"
                />
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {allLeadsCount?.assignedLeadsCount}
                </span>
              </div>
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap font-semibold">
                Today POA
              </h2>
              <p className="text-[12px]">{userDeatail?.fullname}</p>
            </div>
            <div
              className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 cursor-pointer"
              onClick={() => {
                navigate("/sale-management/plan-of-action-for-day");
              }}
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-2xl md:text-3xl text-bgDataNew mb-2"
                />
                {/* <span className="absolute -top-2 -right-3 bg-red-500 text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  {allLeadsCount?.assignedLeadsCount}
                </span> */}
              </div>
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap font-semibold">
                History POA
              </h2>
              <p className="text-[12px]">{userDeatail?.fullname}</p>
            </div>
            <div className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 cursor-pointer">
              {/* <FontAwesomeIcon
                icon={faDollarSign}
                className="text-2xl md:text-3xl text-bgDataNew mb-2"
              /> */}
              <FontAwesomeIcon
                icon={faIndianRupeeSign}
                className="text-2xl md:text-3xl text-bgDataNew mb-2"
              />

              <h2 className="text-[12px] md:text-textdata whitespace-nowrap font-semibold">
                Total Sales
              </h2>
              <p className="text-[12px]">
                ₹ {totalsalebysalespersonCount?.totalSum}
              </p>
            </div>
            <div className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 cursor-pointer">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-2xl md:text-3xl text-bgDataNew mb-2"
              />
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap font-semibold">
                Pending Follow-Ups
              </h2>
              <p className="text-[12px]">{pendingFCount?.count} Clients</p>
            </div>
            <div
              onClick={() => {
                navigate("/my-task/taskshedule-management");
              }}
              className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faHandshake}
                className="text-2xl md:text-3xl text-bgDataNew mb-2"
              />
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap font-semibold">
                {/* Closed Deals */}
                Assigned Task
              </h2>
              {/* <p className="text-[12px]">3 Successful Sales</p> */}
              <p className="text-[12px]">{myTasks?.tasks?.length}</p>
            </div>
            <div
              onClick={() => {
                navigate("/my-task/taskshedule-management");
              }}
              className="bg-bgData flex flex-col items-center justify-center rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faHandshake}
                className="text-2xl md:text-3xl text-bgDataNew mb-2"
              />
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap font-semibold">
                {/* Closed Deals */}
                Total Visits
              </h2>
              {/* <p className="text-[12px]">3 Successful Sales</p> */}
              <p className="text-[12px]">{totaluserVisit?.totalVisits}</p>
            </div>
          </div>
          <SalesPersonFollowUp />

          {/* show google map */}
          <div className="">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {checkinLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={{
                    url:
                      location.type === "checkin"
                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                  onClick={() => setSelected(location)}
                />
              ))}

              {selected && (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div>{selected.address}</div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
          {/* end google map  */}
          {/* <div>
              <Calender />
            </div> */}
        </div>
      )}
      {leadDataShowNew && (
        <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
              <div>
                <h1
                  class="text-white text-[14px] font-semibold flex items-center cursor-pointer"
                  onClick={() => setLeadDataShowNew(false)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="cursor-pointer"
                  >
                    <path
                      d="M22.5 27L13.5 18L22.5 9"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  Assign TaskLead
                </h1>
              </div>
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
            </div>
            <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
              {/*------- Table Data Start -------*/}
              <DepartmentTable
                setEditUserModalOpen={setEditUserModalOpen}
                SalesPersonleads={salesPersonleads?.data}
                setViewModalOpen={setViewModalOpen}
              />
              {/*------- Table Data End -------*/}
            </div>
            {/* Pagination Controls with Number */}
            <Pagination
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>

          {/* Edit User Modal */}
          {isEditUserModalOpen && (
            <EditUserModal setEditUserModalOpen={setEditUserModalOpen} />
          )}

          {/* View User Modal */}
          {isViewModalOpen && (
            <ViewUserModal setViewModalOpen={setViewModalOpen} />
          )}
        </div>
      )}
    </div>
  );
};

export default SalesProgressMange;
