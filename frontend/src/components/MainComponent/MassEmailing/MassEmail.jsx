import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentTop from "../../ContentTop/ContentTop";
import { fetchAllCustomers } from "../../../redux/customerSlice";

const MassEmail = () => {
  const dispatch = useDispatch();

  const { allCustomers } = useSelector(
    (state) => state.customer
  );

  console.log("allCustomers" , allCustomers);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [showAlert, setShowAlert] = useState(false);

  const allEmails = [
    "uma@example.com",
    "prashant@example.com",
    "rishabh@example.com",
    "nikhil@example.com",
    "priyanka@example.com",
  ];

  const [selectedEmails, setSelectedEmails] = useState([]);

  const allEmailIds = allCustomers?.data?.map((item) => item.email_id) || [];

  const isAllSelected = selectedEmails.length === allEmailIds.length && allEmailIds.length > 0;


  const toggleEmail = (emailId) => {
  if (emailId === "Select all") {
    if (isAllSelected) {
      setSelectedEmails([]); // unselect all
    } else {
      setSelectedEmails(allEmailIds); // select all
    }
  } else {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId) // unselect
        : [...prev, emailId] // select
    );
  }
};

  // Optional: Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 12000); // 3 seconds
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="main-content-holder max-h-[660px] heightfixalldevice overflow-y-auto scrollbar-hide mb-4">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
            <div className="md:mb-0 mb-2">
              <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
                Mass Emailing
              </h1>
            </div>
            <div className="flex items-center flex-row gap-[8px] md:gap-[5px]"></div>
          </div>
          <div className="main-content-holder max-h-[660px] heightfixalldevice overflow-y-auto scrollbar-hide">
            <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
              {/*--------- Mass Emailing Code Start  ---------*/}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white w-full md:w-[650px]  rounded-[6px]">
                  <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
                    Please Select the Email
                  </h2>
                  <div className="mt-5 md:mt-5 px-4 overflow-y-auto ">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-sm text-black border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] bg-white rounded-l-[5px] flex items-center text-center px-12 h-10">
                        Customers :
                      </span>
                      <div
                        className="relative inline-block text-left"
                        ref={dropdownRef}
                      >
                        <button
                          onClick={() => setOpen(!open)}
                          className="block w-full text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-8 py-2 flex items-center"
                        >
                          Select the Email
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="chevron-down"
                            class="svg-inline--fa fa-chevron-down text-white text-[12px] ml-48"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path
                              fill="black"
                              d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                            ></path>
                          </svg>
                        </button>

                        {open && (
                          <div className="absolute mt-2 right-0 w-[380px] bg-bgData border border-gray-300 rounded shadow-lg z-10">
                            <ul className="max-h-60 overflow-y-auto text-white">
                              <li
                                className="flex items-center cursor-pointer px-4 py-2"
                                onClick={() => toggleEmail("Select all")}
                              >
                                <input
                                  type="checkbox"
                                  checked={isAllSelected}
                                  readOnly
                                  className="mr-2 w-4 h-4 accent-orange-500"
                                />
                                <span>Select all</span>
                              </li>
                              {allCustomers?.data?.map((item, index) => (
                                <li
                                  key={index+1}
                                  className="flex items-center cursor-pointer px-4 py-2 hover:bg-bgDataNew"
                                  onClick={() => toggleEmail(item.email_id)}
                                >
                                  <input
                                    type="checkbox"
                                   checked={selectedEmails.includes(item.email_id)}
                                    readOnly
                                    className="mr-2 w-4 h-4 accent-orange-500"
                                  />
                                  <span>{item.email_id}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                        Email Description :
                      </label>
                      <textarea
                        name="description"
                        className="block w-full mb-2 text-black rounded-[5px] h-[130px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        placeholder="Enter Description"
                      />
                    </div>
                    <div className="flex items-end justify-end gap-2 mb-3">
                      <button
                        className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                        onClick={handleSend}
                      >
                        Send
                      </button>
                    </div>
                    {/* Alert Box */}
                    {showAlert && (
                      <div className="fixed inset-0 z-40">
                        {/* Overlay for blur effect */}
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

                        {/* Alert message */}
                        <div
                          className="fixed top-[39%] left-[59%] -translate-x-1/2 mt-5 flex items-center justify-between p-5 leading-normal text-red-800 bg-red-100 rounded-lg shadow-lg z-50 max-w-sm"
                          role="alert"
                        >
                          <p>
                            Google does not allow mass emailing via Gmail API.
                            Please use a verified bulk email service.
                          </p>

                          <svg
                            onClick={() => setShowAlert(false)}
                            className="inline w-12 h-12 fill-current ml-5 hover:opacity-80 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/*--------- Mass Emailing Code End  ---------*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassEmail;
