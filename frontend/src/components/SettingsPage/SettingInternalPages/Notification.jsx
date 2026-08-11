import React, { useState } from "react";
import "../SettingData.css";

const Notification = () => {
  const [isCheckedToggle, setIsCheckedToggle] = useState(false);
  const [selectedOptionMessage, setSelectedOptionMessage] = useState("Off");
  const [selectedOptionLike, setSelectedOptionLike] = useState("Off");
  const [selectedOptionComment, setSelectedOptionComment] = useState("Off");
  const [selectedOptionStories, setSelectedOptionStories] = useState("Off");
  const [selectedOptionStoryLiked, setSelectedOptionStoryLiked] =
    useState("Off");
  const [selectedOptionStoryMention, setSelectedOptionStoryMention] =
    useState("Off");
  const [selectedOptionStoryComment, setSelectedOptionStoryComment] =
    useState("Off");
  const [selectedOptionPostTagged, setSelectedOptionPostTagged] =
    useState("Off");

  const sections = [
    {
      title: "Messages",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionMessage,
      setSelectedOption: setSelectedOptionMessage,
    },
    {
      title: "Like",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionLike,
      setSelectedOption: setSelectedOptionLike,
    },
    {
      title: "Comments",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionComment,
      setSelectedOption: setSelectedOptionComment,
    },
    {
      title: "Stories",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionStories,
      setSelectedOption: setSelectedOptionStories,
    },
    {
      title: "Story Liked",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionStoryLiked,
      setSelectedOption: setSelectedOptionStoryLiked,
    },
    {
      title: "Story Mention",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionStoryMention,
      setSelectedOption: setSelectedOptionStoryMention,
    },
    {
      title: "Story Comment",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionStoryComment,
      setSelectedOption: setSelectedOptionStoryComment,
    },
    {
      title: "Post Tagged",
      options: ["Off", "From profiles I follow", "From Everyone"],
      selectedOption: selectedOptionPostTagged,
      setSelectedOption: setSelectedOptionPostTagged,
    },
  ];

  const handleCheckboxChange = () => {
    setIsCheckedToggle((prev) => !prev);
  };

  return (
    <div className="navigationData px-4">
      <div className="md:hidden mb-4 md:mb-0">
        <p
          className="font-poppins text-[#212626] font-semibold text-[16px] md:text-[28px] text-left flex items-center"
          onClick={() => setShowSidebar(true)}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden md:flex"
          >
            <path
              d="M22.5 27L13.5 18L22.5 9"
              stroke="black"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            width="22"
            height="22"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex md:hidden"
          >
            <path
              d="M22.5 27L13.5 18L22.5 9"
              stroke="black"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </p>
      </div>
      <div className="mb-4">
        <div className="flex flex-col">
          <h3 className="text-left font-poppins font-semibold text-[15px] md:text-textdata whitespace-nowrap text-white">
            Notification Settings
          </h3>
          <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px]  mt-5">
            <p className="font-inter font-medium text-[14px] text-white">
              Pause all
            </p>
            <label className="flex cursor-pointer select-none items-center">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isCheckedToggle}
                  onChange={handleCheckboxChange}
                  className="sr-only"
                />
                <div
                  className={`block h-[20px] w-[45px] rounded-full transition ${
                    isCheckedToggle ? "bg-[#E6EBEB]" : "bg-[#E5E7EB]"
                  }`}
                ></div>
                <div
                  className={`dot absolute top-1 h-[12px] w-[12px] rounded-full transition-transform ${
                    isCheckedToggle
                      ? "translate-x-7 bg-[#fe6c00]"
                      : "translate-x-1 bg-white"
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-[24px] mt-8">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-[10px]">
              <h5 className="text-left font-poppins font-semibold text-[12px] md:text-[14px] text-white">
                {section.title}
              </h5>
              <div className="flex flex-col gap-[8px]">
                {section.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={section.title}
                      value={option}
                      checked={section.selectedOption === option} 
                      onChange={() => section.setSelectedOption(option)}
                      className="hidden peer"
                    />
                    <div className="w-[14px] h-[14px] border-2 border-white rounded-full flex items-center justify-center">
                      <div
                        className={`${
                          section.selectedOption === option
                            ? "w-[6px] h-[6px] bg-[#fe6c00] rounded-full"
                            : ""
                        }`}
                      ></div>
                    </div>
                    <span className="font-inter font-medium text-[12px] md:text-[13px] text-white">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
