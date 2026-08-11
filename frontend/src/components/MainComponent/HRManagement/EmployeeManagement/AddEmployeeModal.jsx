import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addUser, listUsers, fetchAllUsers } from "../../../../redux/userSlice";
import { fetchAllRoles } from "../../../../redux/authSlice";
import { fetchAllDepartments } from "../../../../redux/departmentSlice";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import SignatureCanvas from "react-signature-canvas";

const AddEmployeeModal = ({
  setAddEmployeeModalOpen,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  flashMessage,
  setFlashMessage,
  flashMsgType,
  setFlashMsgType,
  handleFlashMessage,
  handleChange,
  handleFileChange,
  handleMultipleFileChange,
  clearauditSignature,
  saveauditSignature,
  handleSubmit,
  validateInputs,
  sigauditCanvas,
  isSignatureauditEmpty,
  setIsSignatureauditEmpty,
  currentStep,
  setCurrentStep,
  nextStep,
  prevStep,
}) => {

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

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New Employee Details
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
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
                      currentStep > index ? "bg-bgDataNew" : "bg-gray-300"
                    }`}
                  ></div>
                )}

                <div
                  className={`px-4 py-2 rounded-[8px] text-white font-semibold z-10 ${
                    currentStep >= index + 1 ? "bg-bgDataNew" : "bg-gray-300"
                  }`}
                >
                  {step}
                </div>

                {index < 1 && (
                  <div
                    className={`h-1 w-full ${
                      currentStep > index + 1 ? "bg-bgDataNew" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div> */}

          {/* Step 1: Personal Details */}
          {/* {currentStep === 1 && ( */}
          <div className="mt-4 md:mt-5 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Name :
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="name"
                value={formData.fullname}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.fullname && (
                <p className="text-red-500 text-sm">{formErrors.fullname}</p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Email :
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm">{formErrors.email}</p>
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
                value={formData.date_of_birth}
                onChange={handleChange}
                max={(() => {
                  const today = new Date();
                  today.setFullYear(today.getFullYear() - 18);
                  return today.toISOString().split("T")[0]; // Set max date to 18 years ago
                })()}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
              />
              {formErrors.date_of_birth && (
                <p className="text-red-500 text-sm">
                  {formErrors.date_of_birth}
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
                value={formData.phone}
                onChange={handleChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm">{formErrors.phone}</p>
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
                value={formData.emergency_contact}
                onChange={handleChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.emergency_contact && (
                <p className="text-red-500 text-sm">
                  {formErrors.emergency_contact}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Username :
              </label>
              <input
                type="text"
                name="username"
                placeholder="name"
                value={formData.username}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm">{formErrors.username}</p>
              )}
            </div>

            <div className="relative">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Password :
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 pr-10"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-[#473b33]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password}</p>
              )}
            </div>
            <div className="relative">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Confirm Password :
              </label>
              <input
                type={showCPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="confirm password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 pr-10"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-[#473b33]"
                onClick={() => setShowCPassword(!showCPassword)}
              >
                {showCPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {formErrors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {formErrors.confirm_password}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Aadhar No:
              </label>
              <input
                type="text"
                name="aadhar_no"
                placeholder="1234 5678 9012"
                value={formData.aadhar_no}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.aadhar_no && (
                <p className="text-red-500 text-sm">{formErrors.aadhar_no}</p>
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
                value={formData.pan_no}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.pan_no && (
                <p className="text-red-500 text-sm">{formErrors.pan_no}</p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Assign Role :
              </label>
              <select
                name="role_id"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                value={formData.role_id} // Controlled state
                onChange={handleChange} // Update state
              >
                <option value="">Select the Role</option>
                {allRoles?.data?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              {formErrors.role_id && (
                <p className="text-red-500 text-sm">{formErrors.role_id}</p>
              )}
            </div>

            {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Select the Gender:
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                >
                  <option value="">Select the gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.gender && (
                  <p className="text-red-500 text-sm">{formErrors.gender}</p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Status:
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-[9px]"
                >
                  <option value="">Select the Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {formErrors.status && (
                  <p className="text-red-500 text-sm">{formErrors.status}</p>
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
                  onChange={(e) => handleFileChange(e)}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[5px]"
                />
                {formErrors.profile_image && (
                  <p className="text-red-500 text-sm">
                    {formErrors.profile_image}
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
                value={formData.address}
                onChange={handleChange}
                className="block w-full mb-2 h-[50px] rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm">{formErrors.address}</p>
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
                value={formData.work_location}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.work_location && (
                <p className="text-red-500 text-sm">
                  {formErrors.work_location}
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
                value={formData.date_of_joining}
                onChange={handleChange}
                min={today}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[7px]"
              />
              {formErrors.date_of_joining && (
                <p className="text-red-500 text-sm">
                  {formErrors.date_of_joining}
                </p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Employeement Type:
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Employeement Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
              {formErrors.employment_type && (
                <p className="text-red-500 text-sm">
                  {formErrors.employment_type}
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
                value={formData.reporting_manager_id} // Controlled state
                onChange={handleChange} // Update state
              >
                <option value="">Select Reporting Manager</option>
                {allusers?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}{" "}
                    {/* Assuming user object has "name" property */}
                  </option>
                ))}
              </select>
              {formErrors.reporting_manager_id && (
                <p className="text-red-500 text-sm">
                  {formErrors.reporting_manager_id}
                </p>
              )}
            </div>
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Upload Documents:
              </label>
              <input
                type="file"
                name="documents"
                multiple
                onChange={(e) => handleMultipleFileChange(e)}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[5px]"
              />
              {formErrors.documents && (
                <p className="text-red-500 text-sm">{formErrors.documents}</p>
              )}
            </div>
          </div>
          {/* )} */}

          <div className="flex items-end justify-end gap-2 px-4">
            {/* {currentStep === 1 && (
              <>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={nextStep}
                >
                  Next
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setAddEmployeeModalOpen(false)}
                >
                  Close
                </button>
              </>
            )} */}
            {/* {currentStep === 2 && ( */}
            <>
              {/* <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={prevStep}
                >
                  Previous
                </button> */}
              <button
                className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                //onClick={nextStep}
                onClick={handleSubmit}
              >
                Add Employee
              </button>
              <button
                className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                onClick={() => setAddEmployeeModalOpen(false)}
              >
                Close
              </button>
            </>
            {/* )} */}

            {/* {currentStep === 3 && (
              <>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={prevStep}
                >
                  Previous
                </button>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={nextStep}
                >
                  Next
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setAddEmployeeModalOpen(false)}
                >
                  Close
                </button>
              </>
            )}

            {currentStep === 4 && (
              <>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={prevStep}
                >
                  Previous
                </button>
                <button
                  className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                  onClick={handleSubmit}
                >
                  Add Employee
                </button>
                <button
                  className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                  onClick={() => setAddEmployeeModalOpen(false)}
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

export default AddEmployeeModal;
