import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useGoogleCalendar from "../../components/hooks/useGoogleCalendar";
import ContentTop from "../ContentTop/ContentTop"
import "./Calender.css";
import EventDetailModal from "./EventDetailModal";
import { fetchCurrentUser } from "../../redux/authSlice";
const Calender = () => {
  const dispatch = useDispatch();
  const { user: userDeatail } = useSelector((state) => state.auth);
  const {
    isAuthenticated,
    events,
    handleLogin,
    handleLogout,
    fetchEvents,
    createEvent,
  } = useGoogleCalendar();

  useEffect(() => {
      dispatch(fetchCurrentUser());
    }, [dispatch]);

  //console.log("isAuthenticated",isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents(); // Fetch events when authenticated
    }
  }, [isAuthenticated]);

  // const handleAddEvent = () => {
  //   const event = {
  //     title: "Meeting Sheduled",
  //     location: "Indore",
  //     description: "Test meeting via Zoom",
  //     startDateTime: "2025-05-01T06:30:00", // ISO dateTime format
  //     endDateTime: "2025-05-01T06:45:00",
  //     attendeesEmails: [
  //       "nikhilpatankar74@gmail.com",
  //       "umasharma0821@gmail.com",
  //       "nikhil02.1998@gmail.com",
  //     ],
  //   };
  //   createEvent(event);
  // };

  // Convert Google Calendar events to FullCalendar format
  
  const eventsData = events.map((event) => ({
    id: event.id,
    title: event.summary,
    start: event.start.dateTime,
    end: event.end?.dateTime,
    extendedProps: {
      description: event.description,
      location: event.location,
    },
  }));

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="main-content">
      <ContentTop />
      {/* {!isAuthenticated ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-400">
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white border-none px-5 py-2 cursor-pointer rounded text-lg"
          >
            Sign In with Google
          </button>
        </div>
      ) : ( */}
      <div className="text-white p-4 h-screen">
        {!isAuthenticated ? (
          <div className="mt-12 flex flex-col justify-center items-center">
            <h3 class="mb-1 text-bgDataNew font-poppins border border-[#473b33] w-fit px-4 py-2 bg-[#473b33] rounded-[2px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
              Important Events With Google Calender *{" "}
              <span className="text-[14px] mb-12 text-white font-poppins font-medium py-1 text-bgData mb-0 text-center mx-auto">
                By clicking on SignIn Button You will be redirect to Google
                Calender
              </span>{" "}
              *
            </h3>
           <p className="mt-0 mb-12 text-bgDataNew font-poppins border-none w-fit px-4 py-2 bg-[#473b33] rounded-[5px] font-medium text-[15px] text-bgData mb-0 text-center mx-auto">
              ** Your Gmail ID will be verified by ADMIN **
            </p>
            <p className="mt-0 mb-12 text-bgDataNew font-poppins border-none w-fit px-4 py-2 bg-[#473b33] rounded-[5px] font-medium text-[15px] text-bgData mb-0 text-center mx-auto">
              ** Your Can SignIn With this Email {userDeatail?.email} **
            </p>

            <button
              onClick={handleLogin}
              className="bg-bgDataNew text-white border-none px-5 py-2 cursor-pointer rounded text-lg"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white border-none px-4 py-1 cursor-pointer rounded text-lg mb-5"
              >
                Sign Out
              </button>
            </div>

            {events?.length > 0 ? (
              <div className="w-full" id="googlecalenderdiv">
                <h2 className="text-[18px] font-bold mb-3">
                  📅 My Google Calendar Events
                </h2>
                <div className="w-full">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={eventsData}
                    dateClick={(info) => openModalForNewEvent(info.dateStr)}
                    eventClick={handleEventClick}
                    height="auto"
                  />
                </div>
              </div>
            ) : (
              <p>No events found.</p>
            )}
          </div>
        )}
      </div>
      {/* )} */}

      <EventDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
      />
    </div>
  );
};

export default Calender;
