import React, { useState, useEffect, useRef } from "react";
import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, fetchCurrentUser } from "../../redux/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../AlertMessage/SuccessMessage";
import ErrorMessage from "../AlertMessage/ErrorMessage";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const ContentTop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [totalNotifi, isSettotalNotifi] = useState(0);

  const { user: userDeatail } = useSelector((state) => state.auth);
  //console.log("userDeatail", userDeatail);
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // const [isQuickOpen, setIsQuickOpen] = useState(false);
  // const QuickRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    //localStorage.removeItem("isCheckedIn"); // Clear check-in state
    navigate("/"); // Redirect to login page
  };

  const { toggleSidebar } = useContext(SidebarContext);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const TotalNotification = async (id) => {
      try {
        const token = getAuthToken();
        const response = await axios.get(`${API_URL}/auth/get-today-lead-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //console.log("response", response?.data?.count);
        isSettotalNotifi(response?.data?.count);
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };
  
    useEffect(() => {
      TotalNotification();
    }, []);

  //end check in check out button
  return (
    <>
      <div className="fixed top-5 right-5 z-50">
        {flashMessage && flashMsgType === "success" && (
          <SuccessMessage message={flashMessage} />
        )}
        {flashMessage && flashMsgType === "error" && (
          <ErrorMessage message={flashMessage} />
        )}
      </div>
      <div className="main-content-top">
        <div className="content-top-left bgdatacolornew">
          <button
            type="button"
            className="sidebar-toggler"
            onClick={() => toggleSidebar()}
          >
            <img src={iconsImgs.menu} alt="" />
          </button>
          {/* <h3 className="content-top-title">
            Welcome {userDeatail?.fullname}
          </h3> */}
          <h3 className="content-top-title">
            <span className="full-name">
              Welcome&nbsp;{userDeatail?.fullname}
            </span>
            <span className="short-name">
              Welcome&nbsp;
              {userDeatail?.fullname
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </span>
          </h3>
        </div>
        <div className="content-top-btns flex">
          {/* <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold 
                 hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Logout
        </button> */}
          {/* <button
          type="button"
          className="search-btn content-top-btn bgdatacolornews"
        >
          <img
            src={iconsImgs.search}
            alt=""
            style={{ width: "20px", height: "20px" }}
          />
        </button> */}
          <button className="notification-btn content-top-btn bgdatacolornews relative">
            <img
              src={iconsImgs.bell}
              alt=""
              style={{
                width: "30px",
                height: "28px",
                borderRadius: "50%",
                border: "1px solid #ccc6c6ff",
                padding: "4px",
                boxSizing: "border-box",
              }}
            />
            <span className="notification-btn-dot text-white text-[12px] absolute top-0 right-0 bg-red-600 rounded-full w-[25px] h-[25px] flex items-center justify-center">
              {totalNotifi}
            </span>
          </button>

          {/* Quick Action */}
          {/* <div className="relative inline-block" ref={QuickRef}>
          <button
            className="notification-btn content-top-btns bgdatacolornews bgdatacolornewsData flex items-center gap-2"
            onClick={() => setIsQuickOpen(!isQuickOpen)}
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start">
              <h2 className="font-bai text-[12px] text-white">Quick Action</h2>
              </div>
              <div>
              <FontAwesomeIcon icon={faChevronDown} className="text-white text-[12px] mb-0"/>
              </div>
            </div>
          </button>

          {isQuickOpen && (
            <div className="absolute right-0 w-fit bg-white bordernewdata shadow-lg rounded-[5px] p-3 z-10">
              <div className="flex flex-col items-center gap-2 border-b pb-2">
                  <p className="text-[12px] font-semibold">Update Lead</p>
                  <p className="text-[12px] font-semibold"></p>
              </div>
            </div>
          )}
        </div> */}

          {/* Profile Action */}
          <div className="relative inline-block" ref={profileRef}>
            <button
              className="notification-btn content-top-btns bgdatacolornews bgdatacolornewsData flex items-center gap-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div>
                <img
                  src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg"
                  alt="User"
                  className="w-[20px] h-[20px] w-full md:w-[32px] md:h-[32px] rounded-full bordernewdata object-cover aspect-square"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start">
                  {/* <h2 className="font-bai text-[12px] text-white datashowname">
                    {userDeatail?.fullname}
                  </h2> */}
                  <h2 className="font-bai text-[12px] text-white datashowname">
                    <span className="full-name">{userDeatail?.fullname}</span>
                    <span className="short-name">
                      {userDeatail?.fullname
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </h2>
                  <p className="font-bai text-[10px] text-white datashowemail">
                    {userDeatail?.email}
                  </p>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="text-white text-[12px] md:mb-2"
                  />
                </div>
              </div>

              {/* <span className="notification-btn-dot"></span> */}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 w-max bg-white bordernewdata shadow-lg rounded-[5px] p-3 mt-1 z-10">
                <div className="flex items-center gap-2 border-b pb-2">
                  <img
                    src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?cs=srgb&dl=pexels-sulimansallehi-1704488.jpg&fm=jpg"
                    alt="User"
                    className="w-9 h-9 rounded-full aspect-square object-cover"
                  />
                  <div>
                    <p className="text-[12px] font-semibold">
                      {userDeatail?.fullname}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {userDeatail?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-bgDataNew float-end mt-2 text-right text-[12px] text-white hover:bg-orange-800 px-2 py-1 rounded"
                >
                  Logout
                </button>
                <button></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentTop;
