import React, { useState, useEffect } from "react";
import "../SettingData.css";
import Select from "react-select";
import {genderOptions, countryOptions, stateOptions, cityOptions} from "../../../data/data"

const customStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "5px",
    padding: "2px 4px",
    minHeight: "45px",
    backgroundColor: "#F0F7F7",
    border: "1px solid #d1d5db", // Light grey border
    boxShadow: "none",
    "&:hover": {
      borderColor: "#93C5FD", // Blue on hover
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      && "#fe6c00",
    color: "white", // White text
    padding: "10px 15px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#fc6b001c", // Orange on hover
      color: "#fff", // White text
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#869E9D",
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "Inter, sans-serif",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "16px",
    fontFamily: "Inter, sans-serif",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#29221d",
    boxShadow: "0 4px 8px rgba(220, 199, 199, 0.2)",
    zIndex: "10"
  }),
};

const EditProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showEyePassword, setShowEyePassword] = useState(false);

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("userProfile"));
    if (savedData) {
      setFullName(savedData.fullName || "");
      setEmail(savedData.email || "");
      setPhone(savedData.phone || "");
      setPassword(savedData.password || "");
      setDescription(savedData.description || "");
      setSelectedGender(
        genderOptions.find((option) => option.label === savedData.gender) ||
          null
      );
      setSelectedCountry(
        countryOptions.find((option) => option.label === savedData.country) ||
          null
      );
      // Set the state based on the saved country
      const savedState =
        stateOptions[savedData.country?.toLowerCase()]?.find(
          (option) => option.label === savedData.state
        ) || null;
      setSelectedState(savedState);

      // After state is set, check for the saved city
      if (savedState) {
        const savedCity =
          cityOptions[savedData.country?.toLowerCase()]?.[
            savedState.value
          ]?.find((option) => option.label === savedData.city) || null;
        setSelectedCity(savedCity);
      }
      setProfilePhoto(savedData.profilePhoto || null);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      fullName,
      email,
      phone,
      password,
      description,
      gender: selectedGender?.label || "",
      country: selectedCountry?.label || "",
      state: selectedState?.label || "",
      city: selectedCity?.label || "",
      profilePhoto,
    };

    localStorage.setItem("userProfile", JSON.stringify(userData));
    alert("Your data has been saved to local storage.");
  };

  const togglePasswordVisibility = () => {
    setShowEyePassword(!showEyePassword);
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhoto(null);
  };

  return (
    <div className="navigationData">
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <div className="text-center mb-5">
          <h2 className="font-poppins text-[17px] md:text-[19px] font-semibold text-white">
            Profile Setup
          </h2>
          <p className="font-inter font-medium text-[12px] md:text-[10px] md:text-textdata whitespace-nowrap text-white">
            Fill important details to Update Profile
          </p>
        </div>
        {/* Profile Photo and Badge */}
        {/* Profile Photo Section */}
        <div className="mb-3 relative w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden border-[4px] md:border-[3px] border-[#FFFFFF] bg-[#F0F7F7] flex flex-col items-center justify-center group">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
              required
            />
          ) : (
            <div className="flex flex-col items-center">
              <img
                src="{Icon}"
                alt="Placeholder"
                className="w-full md:w-8 md:h-8 w-4 h-4 mb-1"
              />
              <span className="font-inter font-medium text-[10px] md:text-[12px] text-[#869E9D] text-center">
                Upload <br />
                Profile Photo
              </span>
            </div>
          )}
          {/* Buttons on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-1 md:gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <label
              htmlFor="profile-upload"
              className="bg-[#fe6c00] text-white p-[2px] md:py-2 md:px-2 rounded-[5px] cursor-pointer text-[13px]"
            >
              Upload
            </label>
            <button
              type="button"
              onClick={handleRemoveProfilePhoto}
              className="bg-red-500 text-white p-[2px] md:py-2 md:px-2 rounded-[5px] text-[13px] cursor-pointer"
            >
              Remove
            </button>
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePhotoUpload}
            />
          </div>
        </div>
        <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Full Name */}
          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-[5px] text-black px-4 py-2 w-full h-[45px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] bg-[#F0F7F7] placeholder:text-[#869E9D] placeholder:font-inter placeholder:font-medium placeholder:text-[14px]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              Email
            </label>
            <input
              type="text"
              placeholder="john_doe_21"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-[5px] text-black px-4 py-2 w-full h-[45px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] bg-[#F0F7F7] placeholder:text-[#869E9D] placeholder:font-inter placeholder:font-medium placeholder:text-[14px]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              Phone No.
            </label>
            <input
              type="number"
              placeholder="9546785241"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
               min="0"
              required
              className="rounded-[5px] text-black px-4 py-2 w-full h-[45px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] bg-[#F0F7F7] placeholder:text-[#869E9D] placeholder:font-inter placeholder:font-medium placeholder:text-[14px]"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              Gender
            </label>
            <Select
              options={genderOptions}
              placeholder="Choose your gender"
              styles={customStyles}
              classNamePrefix="custom"
              className="dataName"
              value={selectedGender}
              required
              onChange={(option) => setSelectedGender(option)}
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              Country
            </label>
            <Select
              options={countryOptions}
              placeholder="Select your Country"
              styles={customStyles}
              classNamePrefix="custom"
              className="dataName"
              value={selectedCountry}
              required
              onChange={(option) => {
                setSelectedCountry(option);
                setSelectedState(null);
                setSelectedCity(null);
              }}
            />
          </div>

          {/* State */}
          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              State
            </label>
            <Select
              options={stateOptions[selectedCountry?.value] || []}
              value={selectedState}
              onChange={(option) => {
                setSelectedState(option);
                setSelectedCity(null); // Reset city on state change
              }}
              placeholder="Select your State"
              styles={customStyles}
              classNamePrefix="custom"
              className="dataName"
              isDisabled={!selectedCountry}
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              City
            </label>
            <Select
              options={
                selectedCountry && selectedState
                  ? cityOptions[selectedCountry.value]?.[selectedState.value] ||
                    []
                  : []
              }
              value={selectedCity}
              onChange={(option) => setSelectedCity(option)}
              placeholder="Select your city"
              styles={customStyles}
              classNamePrefix="custom"
              className="dataName"
              isDisabled={!selectedState}
              required
            />
          </div>

          <div>
            <label className="text-left font-inter block text-white mb-1 text-[14px] font-medium">
              Password
            </label>
            <div className="w-full relative">
              <input
                type={showEyePassword ? "text" : "password"}
                name="usePassword"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-black font-sans w-full p-2 h-[45px] bg-[#F0F7F7] border border-[#F0F7F7] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#F0F7F7] placeholder:font-sans placeholder:font-normal placeholder:text-customBlack placeholder:text-[14px]"
              />
              <div
                className="absolute top-2/4 right-4 transform -translate-y-2/4 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showEyePassword ? (
                  <svg
                    width="22"
                    height="16"
                    viewBox="0 0 22 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.42012 8.71318C1.28394 8.49754 1.21584 8.38972 1.17772 8.22342C1.14909 8.0985 1.14909 7.9015 1.17772 7.77658C1.21584 7.61028 1.28394 7.50246 1.42012 7.28682C2.54553 5.50484 5.8954 1 11.0004 1C16.1054 1 19.4553 5.50484 20.5807 7.28682C20.7169 7.50246 20.785 7.61028 20.8231 7.77658C20.8517 7.9015 20.8517 8.0985 20.8231 8.22342C20.785 8.38972 20.7169 8.49754 20.5807 8.71318C19.4553 10.4952 16.1054 15 11.0004 15C5.8954 15 2.54553 10.4952 1.42012 8.71318Z"
                      stroke="#f06600"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.0004 11C12.6573 11 14.0004 9.65685 14.0004 8C14.0004 6.34315 12.6573 5 11.0004 5C9.34355 5 8.0004 6.34315 8.0004 8C8.0004 9.65685 9.34355 11 11.0004 11Z"
                      stroke="#f06600"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="22"
                    height="20"
                    viewBox="0 0 22 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.74294 3.09232C10.1494 3.03223 10.5686 3 11.0004 3C16.1054 3 19.4553 7.50484 20.5807 9.28682C20.7169 9.5025 20.785 9.61034 20.8231 9.77667C20.8518 9.90159 20.8517 10.0987 20.8231 10.2236C20.7849 10.3899 20.7164 10.4985 20.5792 10.7156C20.2793 11.1901 19.8222 11.8571 19.2165 12.5805M5.72432 4.71504C3.56225 6.1817 2.09445 8.21938 1.42111 9.28528C1.28428 9.50187 1.21587 9.61016 1.17774 9.77648C1.1491 9.9014 1.14909 10.0984 1.17771 10.2234C1.21583 10.3897 1.28393 10.4975 1.42013 10.7132C2.54554 12.4952 5.89541 17 11.0004 17C13.0588 17 14.8319 16.2676 16.2888 15.2766M2.00042 1L20.0004 19M8.8791 7.87868C8.3362 8.42157 8.00042 9.17157 8.00042 10C8.00042 11.6569 9.34356 13 11.0004 13C11.8288 13 12.5788 12.6642 13.1217 12.1213"
                      stroke="#869E9D"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="mb-6 w-full px-4">
          <label className="text-left text-white font-inter block text-[#000000] mb-1 text-[14px] font-medium">
            Description
          </label>
          <textarea
            placeholder="Your Story in few words..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="rounded-[5px] text-black px-4 py-2 w-full h-[132px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] bg-[#F0F7F7] placeholder:text-[#869E9D] placeholder:font-inter placeholder:font-medium placeholder:text-[14px]"
          ></textarea>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-[150px] h-[45px] bg-[#fe6c00] text-white py-3 px-4 rounded-[5px] hover:bg-[#fe6c00] transition text-[14px] font-bold font-poppins"
        >
          Update Data
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
