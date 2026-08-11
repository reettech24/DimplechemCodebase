import React, { useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./SettingData.css";
import { NavLink } from "react-router-dom";
import { settingsList } from "../../data/data";
import EditProfile from "./SettingInternalPages/EditProfile";
import Notification from "./SettingInternalPages/Notification";

const SettingData = () => {
  const [activeSetting, setActiveSetting] = useState(settingsList[0]);

  console.log("active Setting", activeSetting);

  return (
    <div className="main-content-holder max-h-[620px] overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <h1 className="text-white text-textdata whitespace-nowrap font-semibold">Settings</h1>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-[20px]">
          {/* Left Sidebar for Settings List */}
          <div className="w-full md:w-[350px] bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            <nav className="navigationData">
              <ul className="space-y-4 nav-list">
                {settingsList.map((setting) => (
                  <li
                    key={setting.id}
                    onClick={() => setActiveSetting(setting)}
                    className={`cursor-pointer p-1 py-1.5 px-4 rounded-[5px] nav-item ${
                      activeSetting.id === setting.id
                        ? "bg-[#fe6c00cf] text-black font-semibold"
                        : "bg-transparent text-white hover:bg-[#fc6b001c]"
                    }`}
                  >
                    <NavLink className="flex items-center gap-1">
                      <img
                        src={setting.image}
                        className="nav-link-icons"
                        alt={setting.title}
                      />
                      <span className="nav-link-text text-textdata">{setting.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {/* Right Content Section */}
          <div className="w-full bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {activeSetting.title === "Edit Profile" && <EditProfile />}
            {activeSetting.title === "Notifications" && <Notification />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingData;
