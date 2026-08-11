import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//for google map
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./ContentMain.css";
import Cards from "../Cards/Cards";
import Transactions from "../Transactions/Transactions";
import Report from "../Report/Report";
import Budget from "../Budget/Budget";
import Subscriptions from "../Subscriptions/Subscriptions";
import Savings from "../Savings/Savings";
import Loans from "../Loans/Loans";
import Financial from "../Financial/Financial";
import Employee from "../Employee/Employee";
import MeetingPage from "../Meeting/MeetingPage";
import MeetingStatusReport from "../MeetingStatusReport/AttendanceSheetData";
import { iconsImgs } from "../../utils/images";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDollarSign,
  faPhone,
  faHandshake,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { fetchCurrentUser } from "../../redux/authSlice";
import {
  getTotalSaleByAllEmployees,
  getAllPendingPoaFollowupCount,
  getTotalExpected,
} from "../../redux/leadSlice";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import SuccessMessage from "../AlertMessage/SuccessMessage";
import ErrorMessage from "../AlertMessage/ErrorMessage";

const ContentMain = () => {
  const prefix = "saleperson_";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { totalsaleCount, allpendingFCount, totalExpected } = useSelector(
    (state) => state.lead
  );

  //console.log("totalExpected", totalExpected);

  const { user: userDeatail } = useSelector((state) => state.auth);

  const [totalLeadCount, setTotalLeadCount] = useState(0);
  const [totalVisitCount, setTotalVisitCount] = useState(0);

  const fetchTotalLeadCount = async () => {
    try {
      const token = getAuthToken();

      const response = await axios.get(`${API_URL}/auth/leadListofall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //console.log("total lead count",response?.data?.count );

      // const leads = response.data?.data || []; // assuming leads are in response.data.data

      // const today = new Date().toISOString().slice(0, 10);

      // const todaysLeadCount = leads.filter(
      //   (lead) => lead.assign_date?.split("T")[0] === today
      // ).length;

      //console.log("Today's lead count:", todaysLeadCount);
      // optionally set state here if needed
      setTotalLeadCount(response?.data?.count);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  const fetchTotalVisitCount = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/total-months-visits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalVisitCount(response.data.totalVisits);
      //console.log("total lead count", response.data.totalVisits);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };
  useEffect(() => {
    dispatch(fetchCurrentUser());
    fetchTotalLeadCount();
    fetchTotalVisitCount();
    dispatch(getTotalSaleByAllEmployees());
    dispatch(getAllPendingPoaFollowupCount());
    dispatch(getTotalExpected());
  }, [dispatch]);

  //check in chekcout
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

  const getLocationName = async (latitude, longitude) => {
    const apiKey = `${API_KEY}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        return data.results[0].formatted_address;
      } else {
        throw new Error("Failed to fetch address");
      }
    } catch (error) {
      console.error("Error getting address: ", error);
      return "Address not available";
    }
  };

  const handleCheckIn = async () => {
    console.log("checkin called");
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
    console.log("checkout called");
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
  //check in chekout

  const formatIntlShort = (num) =>
    new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div className="main-content-holder max-h-[600px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="space-y-3">
        {/* Flex row for 4 divs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-bgData flex-1 flex flex-col items-center justify-between gap-5 rounded-[8px] shadow-md shadow-black/5 text-white p-4 md:p-4 cursor-pointer">
            <div className="w-full flex items-center justify-between">
              <h3 className="grid-c-title-text">Check In/Out</h3>
              <button className="grid-c-title-icon">
                <img src={iconsImgs.plus} alt="plus-icon" />
              </button>
            </div>
            <div class="flex flex-col items-center justify-center">
              <FontAwesomeIcon
                icon={faClock}
                className="text-2xl md:text-3xl text-bgDataNew"
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
          </div>
          <div
            className="bg-bgData flex-1 flex flex-col items-center justify-between gap-5 rounded-[8px] shadow-md shadow-black/5 text-white p-4 md:p-4 cursor-pointer"
            onClick={() => {
              navigate("/plan-of-action-for-day/todayPOA");
            }}
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="grid-c-title-text">Total Today POA</h3>
              <button className="grid-c-title-icon">
                <img src={iconsImgs.plus} alt="plus-icon" />
              </button>
            </div>
            <div class="flex flex-col items-center justify-center">
              <span className="bg-gradient-to-br from-[#5d5d66] to-[#abacb5] text-white text-[15px] font-bold rounded-[5px] max-w-fit p-2 flex items-center justify-center h-[35px]">
                {totalLeadCount}
              </span>
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap text-[#dccfc6] font-medium mt-1">
                Today POA
              </h2>
            </div>
          </div>
          <div onClick={() => {
              navigate("/plan-of-action-for-day/todayPOA");
            }} className="bg-bgData flex-1 flex flex-col items-center justify-between gap-5 rounded-[8px] shadow-md shadow-black/5 text-white p-4 md:p-4 cursor-pointer">
            <div className="w-full flex items-center justify-between">
              <h3 className="grid-c-title-text">Pending Foll-Ups</h3>
              <button className="grid-c-title-icon">
                <img src={iconsImgs.plus} alt="plus-icon" />
              </button>
            </div>
            <div class="flex flex-col items-center justify-center">
              <span className="bg-gradient-to-br from-[#5d5d66] to-[#abacb5] text-white text-[15px] font-bold rounded-[5px] max-w-fit p-2 flex items-center justify-center h-[35px]">
                {allpendingFCount?.count}
              </span>
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap text-[#dccfc6] font-medium mt-1">
                Pending Foll-Ups
              </h2>
            </div>
          </div>
          <div className="bg-bgData flex-1 flex flex-col items-center justify-between gap-5 rounded-[8px] shadow-md shadow-black/5 text-white p-4 md:p-4 cursor-pointer">
            <div className="w-full flex items-center justify-between">
              <h3 className="grid-c-title-text">Total Sales</h3>
              <button className="grid-c-title-icon">
                <img src={iconsImgs.plus} alt="plus-icon" />
              </button>
            </div>
            <div
              onClick={() => {
                navigate("/sale-management/leads/po-form");
              }}
              class="flex flex-col items-center justify-center"
            >
              <span className="bg-gradient-to-br from-[#5d5d66] to-[#abacb5] text-white text-[15px] font-bold rounded-[5px] max-w-fit p-2 flex items-center justify-center h-[35px]">
                {totalsaleCount?.totalSum}
              </span>
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap text-[#dccfc6] font-medium mt-1">
                Total Sales
              </h2>
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/report-management/admin-annual-buisness-plan");
            }}
            className="bg-bgData flex-1 flex flex-col items-center justify-between gap-5 rounded-[8px] shadow-md shadow-black/5 text-white p-4 md:p-4 cursor-pointer"
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="grid-c-title-text">Total Clients Expected</h3>
              <button className="grid-c-title-icon">
                <img src={iconsImgs.plus} alt="plus-icon" />
              </button>
            </div>
            <div class="flex flex-col items-center justify-center">
              <span className="bg-gradient-to-br from-[#5d5d66] to-[#abacb5] text-white text-[15px] font-bold rounded-[5px] max-w-fit p-2 flex items-center justify-center h-[35px]">
                {totalExpected?.total_potential}
              </span>
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap text-[#dccfc6] font-medium mt-1">
                Total Clients Expected
              </h2>
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/report-management/sales-visit-activity-report");
            }}
            className="bg-bgData flex-1 flex flex-col items-center justify-between gap-5 rounded-[8px] shadow-md shadow-black/5 text-white p-4 md:p-4 cursor-pointer"
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="grid-c-title-text">Total Visits</h3>
              <button className="grid-c-title-icon">
                <img src={iconsImgs.plus} alt="plus-icon" />
              </button>
            </div>
            <div class="flex flex-col items-center justify-center">
              <span className="bg-gradient-to-br from-[#5d5d66] to-[#abacb5] text-white text-[15px] font-bold rounded-[5px] max-w-fit p-2 flex items-center justify-center h-[35px]">
                {totalVisitCount}
              </span>
              <h2 className="text-[12px] md:text-textdata whitespace-nowrap text-[#dccfc6] font-medium mt-1">
                Total Visits
              </h2>
            </div>
          </div>
        </div>

        {/* Grid for components (3 per row on medium screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3">
          <Cards />
          <Financial />
          <Budget />
          <Report />
          <Loans />
          <Transactions />
        </div>
      </div>

      <MeetingPage />
      <MeetingStatusReport />
      <Employee />
    </div>
  );
};

export default ContentMain;
