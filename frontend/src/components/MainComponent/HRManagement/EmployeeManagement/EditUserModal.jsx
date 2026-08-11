import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { personsImgs } from "../../../../utils/images";
import {
  updateUser,
  listUsers,
  fetchAllUsers,
} from "../../../../redux/userSlice";
import { fetchAllRoles } from "../../../../redux/authSlice";
import { fetchAllDepartments } from "../../../../redux/departmentSlice";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import SignatureCanvas from "react-signature-canvas";

import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const EditUserModal = ({
  setEditUserModalOpen,
  selectedEmployee,
  setSelectedEmployee,
  updateFormData,
  setUpdateFormData,
  updateFormErrors,
  setUpdateFormErrors,
  updateFlashMessage,
  setUpdateFlashMessage,
  updateFlashMsgType,
  setUpdateFlashMsgType,
  handleUpdateChange,
  handleUpdateFileChange,
  handleUpdateMultipleFileChange,
  validateUpdateInputs,
  handleUpdateSubmit,
  handleUpdateFlashMessage,
  nextUpdateStep,
  prevUpdateStep,
  currentUpdateStep,
  userDeatail,
}) => {
  console.log("updateFormData",updateFormData);
  const dispatch = useDispatch();

  const { allRoles, loading, error } = useSelector((state) => state.auth);

  const { allDepartments, departmentloading, departmenterror } = useSelector(
    (state) => state.department
  );

  const { allusers, userLoading, userError } = useSelector(
    (state) => state.user
  );

  // Fetch roles whenever searchTerm or currentPage changes
  useEffect(() => {
    dispatch(fetchAllRoles());
    dispatch(fetchAllDepartments());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const sigauditCanvas = useRef(null);
  const [isSignatureauditEmpty, setIsSignatureauditEmpty] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Function to clear the signature
  const clearauditSignature = () => {
    sigauditCanvas.current.clear();
    setIsSignatureauditEmpty(true);
  };

  const saveauditSignature = () => {
    const originalCanvas = sigauditCanvas.current.getTrimmedCanvas();

    // Set the willReadFrequently attribute before any read operation
    const ctx = originalCanvas.getContext("2d");
    ctx.willReadFrequently = true; // Enable this flag to optimize read operations

    const resizeWidth = 300;
    const aspectRatio = originalCanvas.height / originalCanvas.width;
    const resizeHeight = resizeWidth * aspectRatio;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = resizeWidth;
    tempCanvas.height = resizeHeight;

    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(originalCanvas, 0, 0, resizeWidth, resizeHeight);

    const resizedDataUrl = tempCanvas.toDataURL("image/png");

    console.log("resizedDataUrl", resizedDataUrl);

    setupdateupdateFormData((prevData) => ({
      ...prevData,
      digital_signature: resizedDataUrl,
    }));

    alert("Saved Signature");
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  //assign user rights
  const [isassignpermission, setIsAssignPermission] = useState(false);
  const [modules, setModules] = useState([]);
  const [actions, setActions] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (selectedEmployee?.id) {
      fetchData();
    }
  }, [selectedEmployee?.id]);

  const fetchData = async () => {
    const token = getAuthToken();
    try {
      const [modulesRes, actionsRes, userRightsRes] = await Promise.all([
        axios.get(`${API_URL}/auth/modules`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/auth/get-actions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/auth/getUserRights/${selectedEmployee.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setModules(modulesRes.data.data);
      setActions(actionsRes.data.data);

      const existingRights = userRightsRes.data.permissions;
      setPermissions(existingRights);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleAssignPermit = () => {
    setIsAssignPermission(true);
  };

  const [selectAll, setSelectAll] = useState(false);

  // useEffect(() => {
  //   if (modules.length > 0) {
  //     const initialPermissions = modules.map((mod) => ({
  //       module_id: mod.id,
  //       permission_ids: [],
  //     }));
  //     setPermissions(initialPermissions);
  //   }
  // }, [modules]);

  // Toggle individual checkbox
  const togglePermission = (moduleId, actionId) => {
    //console.log("moduleId", moduleId, "actionId", actionId);
    setPermissions((prev) =>
      prev.map((mod) => {
        if (mod.module_id === moduleId) {
          const exists = mod.permission_ids.includes(actionId);
          return {
            ...mod,
            permission_ids: exists
              ? mod.permission_ids.filter((id) => id !== actionId)
              : [...mod.permission_ids, actionId],
          };
        }
        return mod;
      })
    );
  };

  // Toggle Allow All per row
  const toggleAllowAllRow = (moduleId) => {
    setPermissions((prev) =>
      prev.map((mod) => {
        if (mod.module_id === moduleId) {
          const isAllChecked = mod.permission_ids.length === actions.length;
          return {
            ...mod,
            permission_ids: isAllChecked ? [] : actions.map((a) => a.id),
          };
        }
        return mod;
      })
    );
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    const isAllChecked = permissions.every(
      (mod) => mod.permission_ids.length === actions.length
    );
    setPermissions((prev) =>
      prev.map((mod) => ({
        ...mod,
        permission_ids: isAllChecked ? [] : actions.map((a) => a.id),
      }))
    );
  };

  // Submit rights
  const handleSave = async (e) => {
    const token = getAuthToken();
    try {
      const payload = {
        user_id: selectedEmployee?.id,
        permissions,
      };
      const response = await axios.put(
        `${API_URL}/auth/update-rights`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log("Update success:", response?.data?.success);
      //console.log(response);

      if (response?.data?.success) {
        handleUpdateFlashMessage(response?.data?.message, "success");
        fetchData();
        setTimeout(() => {
          setIsAssignPermission(false);
        }, 1000);
      } else {
        handleUpdateFlashMessage(
          response.message || "Something went wrong",
          "error"
        );
      }
    } catch (error) {
      handleUpdateFlashMessage(error.message || "An error occurred", "error");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  //assign user rights
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Update Employee Details
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {updateFlashMessage && updateFlashMsgType === "success" && (
              <SuccessMessage message={updateFlashMessage} />
            )}
            {updateFlashMessage && updateFlashMsgType === "error" && (
              <ErrorMessage message={updateFlashMessage} />
            )}
          </div>

          {/* New Code */}
          {/* <div className="p-4 md:px-20  flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px]  md:mt-8 relative w-full">
            {["Personal", "Job", "Bank", "Documents"].map((step, index) => (
            {["Personal", "Job"].map((step, index) => (
              <div key={index} className="flex items-center w-full relative">
                {index > 0 && (
                  <div
                    className={`h-1 w-full ${
                      currentUpdateStep > index ? "bg-bgDataNew" : "bg-gray-300"
                    }`}
                  ></div>
                )}

                <div
                  className={`px-4 py-2 rounded-[8px] text-white font-semibold z-10 ${
                    currentUpdateStep >= index + 1
                      ? "bg-bgDataNew"
                      : "bg-gray-300"
                  }`}
                >
                  {step}
                </div>

                {index < 1 && (
                  <div
                    className={`h-1 w-full ${
                      currentUpdateStep > index + 1
                        ? "bg-bgDataNew"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div> */}

          {/* Step 1: Personal Details */}
          {/* {currentUpdateStep === 1 && ( */}
          <div className="mt-5 md:mt-5 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-x-4 gap-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Name :
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="name"
                value={updateFormData.fullname}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.fullname && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.fullname}
                </p>
              )}
            </div>
            {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Username :
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="name"
                  value={updateFormData.username}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.username && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.username}
                  </p>
                )}
              </div> */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Email :
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={updateFormData.email}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.email && (
                <p className="text-red-500 text-sm">{updateFormErrors.email}</p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Enter Date of Birth:
              </label>
              <input
                type="date"
                name="date_of_birth"
                placeholder="YYYY-MM-DD"
                value={updateFormData.date_of_birth}
                onChange={handleUpdateChange}
                max={(() => {
                  const today = new Date();
                  today.setFullYear(today.getFullYear() - 18);
                  return today.toISOString().split("T")[0]; // Set max date to 18 years ago
                })()}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
              />
              {updateFormErrors.date_of_birth && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.date_of_birth}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Phone :
              </label>
              <input
                type="number"
                name="phone"
                placeholder="Phone"
                value={updateFormData.phone}
                onChange={handleUpdateChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.phone && (
                <p className="text-red-500 text-sm">{updateFormErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Emergency Contact :
              </label>
              <input
                type="number"
                name="emergency_contact"
                placeholder="emergency contact"
                value={updateFormData.emergency_contact}
                onChange={handleUpdateChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.emergency_contact && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.emergency_contact}
                </p>
              )}
            </div>

            {/* <div className="relative">
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Password :
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  value={updateFormData.password}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 pr-10"
                />
                <span
                  className="absolute right-3 top-10 cursor-pointer text-[#473b33]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {updateFormErrors.password && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.password}
                  </p>
                )}
              </div> */}

            {/* <div className="relative">
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Confirm Password :
                </label>
                <input
                  type={showCPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="confirm password"
                  value={updateFormData.confirm_password}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 pr-10"
                />
                <span
                  className="absolute right-3 top-10 cursor-pointer text-[#473b33]"
                  onClick={() => setShowCPassword(!showCPassword)}
                >
                  {showCPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {updateFormErrors.confirm_password && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.confirm_password}
                  </p>
                )}
              </div> */}

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Aadhar No:
              </label>
              <input
                type="text"
                name="aadhar_no"
               placeholder="1234 5678 9012"
                value={updateFormData.aadhar_no}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.aadhar_no && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.aadhar_no}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                PAN No:
              </label>
              <input
                type="text"
                name="pan_no"
                placeholder="ABCDE1234F"
                value={updateFormData.pan_no}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.pan_no && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.pan_no}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Assign Role :
              </label>
              <select
                name="role_id"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                value={updateFormData.role_id} // Controlled state
                onChange={handleUpdateChange} // Update state
              >
                <option value="">Select the Role</option>
                {allRoles?.data?.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                    selected={updateFormData.role_id === role.id}
                  >
                    {role.role_name}
                  </option>
                ))}
              </select>
              {updateFormErrors.role_id && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.role_id}
                </p>
              )}
            </div>

            {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Select the Gender:
                </label>
                <select
                  name="gender"
                  value={updateFormData.gender}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                >
                  <option value="">Select the gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {updateFormErrors.gender && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.gender}
                  </p>
                )}
              </div> */}

            {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Status:
                </label>
                <select
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-[9px]"
                >
                  <option value="" disabled>
                    Select the Status
                  </option>
                  <option
                    value="Active"
                    selected={updateFormData.status === "Active"}
                  >
                    Active
                  </option>
                  <option
                    value="Inactive"
                    selected={updateFormData.status === "Inactive"}
                  >
                    Inactive
                  </option>
                </select>
                {updateFormErrors.status && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.status}
                  </p>
                )}
              </div> */}

            {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Upload Profile Picture:
                </label>
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={(e) => handleUpdateFileChange(e)}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[5px]"
                />
                <img
                  src={
                    updateFormData.profile_image
                      ? `${API_URL.replace("api", "")}${
                          updateFormData.profile_image
                        }`
                      : ""
                  }
                  className="w-10"
                  alt="Profile"
                />
                {updateFormErrors.profile_image && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.profile_image}
                  </p>
                )}
              </div> */}

            {/* <div className="mb-4">
                <label className="block font-poppins font-medium text-textdata whitespace-nowrap text-bgData mb-1">
                  Upload Profile Picture:
                </label>

                
                <div className="flex items-center gap-7 border border-[#473b33] rounded-md px-3 py-[5px] w-fit bg-white shadow-sm">
                  
                  <img
                    src={
                      updateFormData.profile_image
                        ? `${API_URL.replace("api", "")}${
                            updateFormData.profile_image
                          }`
                        : "/default-profile.png" // fallback image
                    }
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-[5px]"
                  />

                  
                  <label
                    htmlFor="profileUpload"
                    className="flex items-center gap-1 cursor-pointer text-[#473b33] hover:text-[#5a453a]"
                  >
                    <img
                      src={personsImgs.Image_Upload}
                      alt="Person Data"
                      className="w-12 h-10 object-cover"
                    />{" "}
                    Upload
                   
                  </label>

                 
                  <input
                    type="file"
                    id="profileUpload"
                    name="profile_image"
                    placeholder="select"
                    accept="image/*"
                    onChange={(e) => handleUpdateFileChange(e)}
                    className="hidden"
                  />
                </div>

               
                {updateFormErrors.profile_image && (
                  <p className="text-red-500 text-sm mt-1">
                    {updateFormErrors.profile_image}
                  </p>
                )}
              </div> */}

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Address:
              </label>
              <textarea
                placeholder="Address"
                name="address"
                value={updateFormData.address}
                onChange={handleUpdateChange}
                className="block w-full mb-2 h-[50px] rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
              {updateFormErrors.address && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.address}
                </p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Reporting Location:
              </label>
              <input
                type="text"
                name="work_location"
                placeholder="Enter Work Location"
                value={updateFormData.work_location}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateFormErrors.work_location && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.work_location}
                </p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Joining Date:
              </label>
              <input
                type="date"
                name="date_of_joining"
                value={updateFormData.date_of_joining}
                onChange={handleUpdateChange}
                min={today}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
              />
              {updateFormErrors.date_of_joining && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.date_of_joining}
                </p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Employment Type:
              </label>
              <select
                name="employment_type"
                value={updateFormData.employment_type}
                onChange={handleUpdateChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
              {updateFormErrors.employment_type && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.employment_type}
                </p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Reporting Manager:
              </label>
              <select
                name="reporting_manager_id"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                value={updateFormData.reporting_manager_id} // Controlled state
                onChange={handleUpdateChange} // Update state
              >
                <option value="">Select Reporting Manager</option>
                {allusers?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}{" "}
                    {/* Assuming user object has "name" property */}
                  </option>
                ))}
              </select>
              {updateFormErrors.reporting_manager_id && (
                <p className="text-red-500 text-sm">
                  {updateFormErrors.reporting_manager_id}
                </p>
              )}
            </div>
            {userDeatail?.employeeRole?.role_id === 1 && (
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Date Of Exit:
                </label>
                <input
                  type="date"
                  name="date_of_exit"
                  value={updateFormData.date_of_exit}
                  onChange={handleUpdateChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
                />
                {updateFormErrors.date_of_exit && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.date_of_exit}
                  </p>
                )}
              </div>
            )}             
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Documents Upload:
                </label>
                <input
                  type="file"
                  name="documents"
                  multiple
                  onChange={handleUpdateMultipleFileChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                Uploaded Doc : {updateFormData?.documents?.length}
                {updateFormErrors.documents && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.documents}
                  </p>
                )}
              </div>
            
            <div>
              <label className="font-poppins font-b text-textdata whitespace-nowrap text-bgData">
                Please click Assign Permission
              </label>
              <input
                type="text"
                name="Assign Permission"
                value="Assign Permission"
                className="block w-full mb-2 cursor-pointer rounded-[5px] bg-bgDataNew text-white text-center border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
                onClick={handleAssignPermit}
              />
            </div>

            {isassignpermission && (
              <div className="fixed inset-0 p-2 bg-black/50 flex justify-center items-center z-50">
                <div className="bg-white w-full w-full md:w-[800px] pt-0 pb-4 rounded-[6px] flex flex-col">
                  <h2 className="text-white text-[18px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
                    Assign Permission to {updateFormData.fullname}
                  </h2>

                  <div className="mt-5 px-4 flex flex-col gap-2 overflow-x-auto custom-scrollbar max-w-full h-[200px]">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-[#151c27] text-white">
                          <th className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={
                                permissions.length > 0 &&
                                permissions.every(
                                  (mod) =>
                                    mod.permission_ids.length === actions.length
                                )
                              }
                              onChange={toggleSelectAll}
                            />{" "}
                            SELECT ALL
                          </th>
                          {actions.map((action) => (
                            <th key={action.id} className="px-4 py-3">
                              {action.name.toUpperCase()}
                            </th>
                          ))}
                          <th className="px-4 py-3">ALLOW ALL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modules.map((module, idx) => {
                          const modPermissions = permissions.find(
                            (p) => p.module_id === module.id
                          );
                          const isRowAllSelected =
                            modPermissions?.permission_ids?.length ===
                            actions?.length;

                          return (
                            <tr
                              key={module.id}
                              className={
                                idx % 2 === 0
                                  ? "bg-[#2c3440] text-white"
                                  : "bg-[#1b2028] text-white"
                              }
                            >
                              <td className="px-4 py-3 font-medium">
                                {module.name}
                              </td>
                              {actions.map((action) => (
                                <td key={action.id} className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={modPermissions?.permission_ids?.includes(
                                      action.id
                                    )}
                                    onChange={() =>
                                      togglePermission(module.id, action.id)
                                    }
                                  />
                                </td>
                              ))}
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isRowAllSelected}
                                  onChange={() => toggleAllowAllRow(module.id)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-end justify-end gap-2 px-4">
                    <button
                      className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                      onClick={handleSave}
                    >
                      Assign
                    </button>
                    <button
                      className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                      onClick={() => setIsAssignPermission(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* )} */}

          {/* Step 2: Job Details */}
          {/* {currentUpdateStep === 2 && ( */}
          {/* <div className="mt-5 md:mt-5 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto md:h-[380px]"> */}
          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Basic Salary:
                </label>
                <input
                  type="number"
                  name="salary"
                  placeholder="Basic Salary"
                  value={updateFormData.salary}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.salary && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.salary}
                  </p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Designantion:
                </label>
                <input
                  type="text"
                  name="job_title"
                  placeholder="Designantion"
                  value={updateFormData.job_title}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.job_title && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.job_title}
                  </p>
                )}
              </div> */}

          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Reporting Location:
                </label>
                <input
                  type="text"
                  name="work_location"
                  placeholder="Enter Work Location"
                  value={updateFormData.work_location}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.work_location && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.work_location}
                  </p>
                )}
              </div> */}

          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Offer Letter Date:
                </label>
                <input
                  type="date"
                  name="offer_letter_date"
                  value={updateFormData.offer_letter_date}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
                />
                {updateFormErrors.offer_letter_date && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.offer_letter_date}
                  </p>
                )}
              </div> */}

          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Joining Date:
                </label>
                <input
                  type="date"
                  name="date_of_joining"
                  value={updateFormData.date_of_joining}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
                />
                {updateFormErrors.date_of_joining && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.date_of_joining}
                  </p>
                )}
              </div> */}

          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Select the Department:
                </label>
                <select
                  name="department_id"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                  value={updateFormData.department_id} // Controlled state
                  onChange={handleUpdateChange} // Update state
                >
                  <option value="">Select the Department</option>
                  {allDepartments?.data?.map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                      selected={updateFormData.department_id === department.id}
                    >
                      {department.department_name}
                    </option>
                  ))}
                </select>
                {updateFormErrors.department_id && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.department_id}
                  </p>
                )}
              </div> */}
          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Employment Type:
                </label>
                <select
                  name="employment_type"
                  value={updateFormData.employment_type}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
                {updateFormErrors.employment_type && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.employment_type}
                  </p>
                )}
              </div> */}

          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Reporting Manager:
                </label>
                <select
                  name="reporting_manager_id"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                  value={updateFormData.reporting_manager_id} // Controlled state
                  onChange={handleUpdateChange} // Update state
                >
                  <option value="">Select Reporting Manager</option>
                  {allusers?.data?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullname}{" "}
                    </option>
                  ))}
                </select>
                {updateFormErrors.reporting_manager_id && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.reporting_manager_id}
                  </p>
                )}
              </div> */}

          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Summary for Remarks:
                </label>
                <textarea
                  placeholder="Summary for Remarks"
                  name="remarks"
                  value={updateFormData.remarks}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                  rows="3"
                />
                {updateFormErrors.remarks && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.remarks}
                  </p>
                )}
              </div> */}

          {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Currently Working:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="currently_working"
                    checked={updateFormData.currently_working}
                    onChange={(e) =>
                      setupdateFormData({
                        ...updateFormData,
                        currently_working: e.target.checked,
                      })
                    }
                    className="w-5 h-5 border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] rounded"
                  />
                  <label
                    htmlFor="currently_working"
                    className="font-poppins text-textdata"
                  >
                    Yes
                  </label>
                </div>
                {updateFormErrors.currently_working && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.currently_working}
                  </p>
                )}
              </div> */}
          {/* </div> */}
          {/* )} */}

          {/* Step 3: Bank Details */}
          {/* {currentUpdateStep === 3 && (
            <div className="mt-5 md:mt-5 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto md:h-[380px]">
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Bank Name:
                </label>
                <input
                  type="text"
                  name="bank_name"
                  placeholder="Bank Name"
                  value={updateFormData.bank_name}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.bank_name && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.bank_name}
                  </p>
                )}
              </div>

              
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Branch Name:
                </label>
                <input
                  type="text"
                  name="branch_name"
                  placeholder="Branch Name"
                  value={updateFormData.branch_name}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.branch_name && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.branch_name}
                  </p>
                )}
              </div>

              
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Account Type:
                </label>
                <input
                  type="text"
                  name="account_type"
                  placeholder="Account Type"
                  value={updateFormData.account_type}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.account_type && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.account_type}
                  </p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Bank Account Number:
                </label>
                <input
                  type="number"
                  name="account_number"
                  placeholder="Bank Account Number"
                  value={updateFormData.account_number}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.account_number && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.account_number}
                  </p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  IFSC Code:
                </label>
                <input
                  type="text"
                  name="ifsc_code"
                  placeholder="IFSC Code"
                  value={updateFormData.ifsc_code}
                  onChange={handleUpdateChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.ifsc_code && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.ifsc_code}
                  </p>
                )}
              </div>
            </div>
          )} */}

          {/* Step 4: Document Upload */}
          {/* {currentUpdateStep === 4 && (
            <div className="mt-5 md:mt-5 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto md:h-[380px]">
             
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Documents Upload:
                </label>
                <input
                  type="file"
                  name="documents"
                  multiple
                  onChange={handleUpdateMultipleFileChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {updateFormErrors.documents && (
                  <p className="text-red-500 text-sm">
                    {updateFormErrors.documents}
                  </p>
                )}
              </div>

             
              <div className="">
                <label className="font-poppins font-medium text-[16px] text-bgData">
                  Upload Written Signature :
                </label>

                <div className="relative signature-container block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-gray-400">
                  <SignatureCanvas
                    ref={sigauditCanvas}
                    penColor="white"
                    canvasProps={{
                      width: 312,
                      height: 150,
                      className: "signature-canvas",
                      style: {
                        borderRadius: "8px",
                        backgroundColor: "#fe6c00",
                      },
                    }}
                    onEnd={() => setIsSignatureauditEmpty(false)}
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <div
                      onClick={clearauditSignature}
                      className="bg-gray-500 text-[15px] text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer"
                    >
                      Clear
                    </div>
                    <div
                      onClick={saveauditSignature}
                      disabled={isSignatureauditEmpty}
                      className={`${
                        isSignatureauditEmpty
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-green-700 hover:bg-green-600 cursor-pointer" 
                      } text-[15px] text-white px-3 py-1 rounded`}
                    >
                      Save Signature
                    </div>
                  </div>
                  <img
                    src={updateFormData.digital_signature} 
                    alt="Digital Signature"
                    className="absolute rounded-[5px] bottom-[53px] right-[26px]"
                    style={{
                      width: "114px",
                      height: "67px",
                      background: "rgb(212 32 32 / 68%)",
                      padding: "5px",
                    }} 
                  />
                </div>
              </div>
            </div>
          )} */}

          <div className="flex items-end justify-end gap-2 px-4">
            {/* {currentUpdateStep === 1 && (
              <>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={nextUpdateStep}
                >
                  Next
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setEditUserModalOpen(false)}
                >
                  Close
                </button>
              </>
            )} */}
            {/* {currentUpdateStep === 2 && ( */}
            <>
              {/* <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={prevUpdateStep}
                >
                  Previous
                </button> */}
              <button
                className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                //onClick={nextUpdateStep}
                onClick={handleUpdateSubmit}
              >
                Update Employee
              </button>
              <button
                className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                onClick={() => setEditUserModalOpen(false)}
              >
                Close
              </button>
            </>
            {/* )} */}

            {/* {currentUpdateStep === 3 && (
              <>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={prevUpdateStep}
                >
                  Previous
                </button>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={nextUpdateStep}
                >
                  Next
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setEditUserModalOpen(false)}
                >
                  Close
                </button>
              </>
            )}

            {currentUpdateStep === 4 && (
              <>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={prevUpdateStep}
                >
                  Previous
                </button>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={handleUpdateSubmit}
                >
                  Update Employee
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setEditUserModalOpen(false)}
                >
                  Close
                </button>
              </>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;
