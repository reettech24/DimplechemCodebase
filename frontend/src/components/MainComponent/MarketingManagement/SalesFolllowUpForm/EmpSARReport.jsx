import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import { addLeadCommunication } from "../../../../redux/leadSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const getAuthToken = () => localStorage.getItem("token");

const EmpSARReport = ({ setpoaReportOpen, selectedPOA }) => {
  const dispatch = useDispatch();

  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 3000);
  };

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  // ✅ Load data from localStorage on mount
  useEffect(() => {
    const storedCheckIn = localStorage.getItem("checkInTime");
    const storedCheckOut = localStorage.getItem("checkOutTime");

    setCheckInTime(storedCheckIn ? storedCheckIn : null);
    setCheckOutTime(storedCheckOut ? storedCheckOut : null);
  }, []);

  const handleToggle = async () => {
    if (isCheckedIn) {
      await handleCheckOut();
    } else {
      await handleCheckIn();
    }
    setIsCheckedIn(!isCheckedIn);
  };

  const getLocationName = async (latitude, longitude) => {
    //console.log("Lat/Lng sent to API: ", latitude, longitude);
    //latitude="22.7563797", longitude="75.5086203";
    //22.7563797,75.5086203
    // try {
    //   const response = await fetch(
    //     `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    //   );
    //   const data = await response.json();
    //   // Ensure you get a detailed address
    //   return data.address
    //     ? `${data.address.city}, ${data.address.state}, ${data.address.country}`
    //     : "Unknown Location";
    // } catch (error) {
    //   console.error("Error fetching location name:", error);
    //   return "Unknown Location";
    // }
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
    console.log("checkin function call.");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        //console.log("Accuracy: ", position.coords.accuracy);
        const { latitude, longitude } = position.coords;
        const locationName = await getLocationName(latitude, longitude);

        const now = new Date();
        const currentTime = now.toTimeString().split(":").slice(0, 2).join(":");

        //console.log("locationName",locationName);

        const checkInData = {
          start_location: locationName,
          customer_id: selectedPOA?.customer_id,
          lead_date: new Date().toISOString().split("T")[0],
          lead_id: selectedPOA?.id,
          start_meeting_time: currentTime,
        };

        //console.log("checkInData", checkInData);

        try {
          const token = getAuthToken();
          //console.log("token",token);
          const response = await axios.post(
            `${API_URL}/auth/lead-communication`,
            checkInData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // const checkInTime = new Date(
          //   response?.data?.checkInRecord?.check_in_time
          // );
          // const formattedTime = checkInTime.toLocaleTimeString([], {
          //   hour: "2-digit",
          //   minute: "2-digit",
          // });

          //setCheckInTime(formattedTime);
          //setCheckOutTime(null); // Reset checkout on new check-in
          //localStorage.setItem("checkInTime", formattedTime);
          //localStorage.removeItem("checkOutTime"); // Ensure fresh data

          setIsCheckedIn(true);
          handleFlashMessage(response?.data?.message, "success");
        } catch (error) {
          handleFlashMessage(error || "Failed to check in", "error");
          //console.log(error);
          //return console.log(error.response?.data || "Failed to check in");
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleCheckOut = async () => {
    console.log("checkout function call.");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const locationName = await getLocationName(latitude, longitude);
        const now = new Date();
        const currentTime = now.toTimeString().split(":").slice(0, 2).join(":");
        //console.log("locationName checkout",locationName);
        const checkOutData = {
          end_location: locationName,
          customer_id: selectedPOA?.customer_id,
          lead_date: new Date().toISOString().split("T")[0],
          lead_id: selectedPOA?.id,
          end_meeting_time: currentTime,
        };

        try {
          const token = getAuthToken();
          //console.log(token);
          const response = await axios.post(
            `${API_URL}/auth/end-meeting`,
            checkOutData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          //localStorage.removeItem("checkInTime");
          // const checkOutTime = new Date(
          //   response?.data?.checkOutRecord?.check_out_time
          // );
          // const formattedTime = checkOutTime.toLocaleTimeString([], {
          //   hour: "2-digit",
          //   minute: "2-digit",
          // });
          //setCheckOutTime(formattedTime);
          //setCheckInTime(null);
          //localStorage.setItem("checkOutTime", formattedTime);
          //localStorage.removeItem("checkInTime");

          setIsCheckedIn(false);
          // localStorage.setItem("isCheckedIn", JSON.stringify(false));
          //console.log("response?.data?.data?.message",response?.data?.message);
          handleFlashMessage(response?.data?.message, "success");
          //console.log(response);
          //return response.data;
        } catch (error) {
          handleFlashMessage(error || "Failed to check out", "error");
          //return console.log(error.response?.data || "Failed to check out");
        }
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  //console.log("selectedPOA", selectedPOA);
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
    
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        {/* Header */}
        {/* <div>
          <button
            onClick={handleToggle}
            className={`float-end mt-2 text-right text-[12px] text-white px-2 py-1 rounded transition-all duration-300 ${
              isCheckedIn
                ? "bg-red-600 hover:bg-red-800"
                : "bg-green-600 hover:bg-green-800"
            }`}
          >
            {isCheckedIn ? "Meeting End" : "Meeting Start"}
          </button>
        </div> */}

        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Summery of Sales Activity Report 
        </h2>

        {/* Table */}
        <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-200px)]">
          <div className="py-3 px-3 w-[1130px] overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 text-left border-collapse">
              <thead className="bg-[#473b33] rounded-[8px]">
                <tr>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap border border-gray-300">
                    Id
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Employee Name
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Company Name
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300 text-red-500">
                    Date of Visit
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    No. of Visits
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Total Hrs Spend
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Approx Area SqM
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Approx Area Cub. Mtr
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Total Product Qty. in Kg
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Total Potential Amount
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Types of Documents Sent
                  </th>
                  <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap  border border-gray-300">
                    Last Visit Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedPOA ? (
                  <tr className="text-center">
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      1
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.salesPerson?.fullname || "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.customer?.company_name || "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.meeting_date
                        ? new Date(
                            selectedPOA.meeting_date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.follow_up_record ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.total_hours_spent ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.approx_area_sqm ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.approx_area_cubm ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.total_material_qty ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.approx_business ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300 whitespace-pre-line">
                      {selectedPOA.documents?.length > 0
                        ? selectedPOA.documents.join("\n")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap border border-gray-300">
                      {selectedPOA.last_contact
                        ? new Date(
                            selectedPOA.last_contact
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan="13"
                      className="border px-4 py-4 text-center text-gray-500"
                    >
                      No Sales Activity Report data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setpoaReportOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EmpSARReport;
