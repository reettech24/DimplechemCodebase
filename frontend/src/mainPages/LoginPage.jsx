import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate ,Link} from "react-router-dom";
import dimplechemical from "../assets/images/Dimple-Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../components/AlertMessage/SuccessMessage";
import ErrorMessage from "../components/AlertMessage/ErrorMessage";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formDataError, setFormDataError] = useState({});
  //forgetpassword
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleForgotPassword = () => {
    setForgotPasswordOpen(!isForgotPasswordOpen);
    setStep(1);
  };
  const handleNext = () => setStep(2);
  const handleBackToInput = () => setStep(1);
  const handleVerify = () => setStep(3);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
  };

  const handleSubmitPassword = () => {
    console.log("Create Password:", createPassword);
    console.log("Confirm Password:", confirmPassword);
    setForgotPasswordOpen(false);
  };
  //forgetpassword
  const [flashMessage, setFlashMessage] = useState('');
  const [flashMsgType, setFlashMsgType] = useState('');


  /* handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    Object.keys(formDataError).forEach((inputName) => {
      if(inputName === name && value !== '') {
          delete formDataError[inputName];
      }
  });
};


// checking for input field validation
const validateInputs = async() => {

  let formErrors = {};

  // User Name validation
  if (!formData.username.trim()) {
    formErrors.username = "*User name is required";
  }

  // Password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
    if (!formData.password) {
        formErrors.password = "*Password is required";
    } else if (!passwordPattern.test(formData.password)) {
        formErrors.password = "*Password must be at least 6 characters, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    setFormDataError(formErrors);
    return Object.keys(formErrors).length === 0;

}

// to show flash message
// handle flash messages show
const handleFlashMessage = (errorMessage, msgType) => {
  setFlashMessage(errorMessage);
  setFlashMsgType(msgType);
  setTimeout(() => {
    setFlashMessage("");
    setFlashMsgType("");
  }, 3000); // Hide the message after 3 seconds
}

const handleSubmit = async(e) => {
  e.preventDefault();
  const isValid = await validateInputs();

  if(isValid) {
    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      //console.log("response",response);
      if(response.success == false) {
        //alert("error");
        handleFlashMessage(response?.message, 'error');
      } else {
        localStorage.setItem("token", response.token);
        const userRoleID = response?.user?.employeeRole?.role_id || "";
        if(userRoleID == 3) {
          navigate("/lead-sales");
        }else{
          navigate("/dashboard");
        }   
      }
    } catch (error) {
      const errorMessage = error.message || "something went wrong";
      handleFlashMessage(errorMessage, 'error')
    }
    //navigate("/header")
  } else {
    console.log("not a valid form")
  }

}

  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen bg-gradient-to-r from-[#1e1e2dd4] to-[#1e1e2d] p-2">
      {/* Right Section */}
       <div className="fixed top-5 right-5 z-50">
              {flashMessage && flashMsgType === "success" && (
                <SuccessMessage message={flashMessage} />
              )}
              {flashMessage && flashMsgType === "error" && (
                <ErrorMessage message={flashMessage} />
              )}
            </div>
      
      <div className="flex flex-col justify-center items-center rounded-[16px] bg-[#2e2e3c] w-full p-2 py-4 w-full md:w-[480px] md:h-[452px]">
        <img
          src={dimplechemical}
          alt="Dimple Logo"
          className="bg-[#1e1e2d] p-2 rounded-[8px]"
        />
        <h2 className="font-poppins text-[32px] text-[#fff] border-[#fe6c00e6] border-b font-semibold text-center mt-10 mb-5">
          Login
        </h2>
        <form
          className="flex flex-col gap-[16px] w-full w-full md:w-[416px]"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              name="username"
              placeholder="Unique ID"
              value={formData.username}
              onChange={handleChange}
              className="font-inter w-full p-2  rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:font-inter placeholder:font-medium placeholder:text-[#667877] placeholder:text-[16px]"
            />
            {formDataError.username && (
              <p className="error text-left text-[#ff0000] text-sm">
                {formDataError.username}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="font-inter w-full p-2 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:font-inter placeholder:font-medium placeholder:text-[#667877] placeholder:text-[16px]"
            />
            {formDataError.password && (
              <p className="error text-left text-[#ff0000] text-sm">
                {formDataError.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="font-roboto mt-2 w-full py-2 bg-[#fe6c00] text-white font-semibold rounded-[8px] hover:bg-[#fe6c00e6] transition"
          >
            Login
          </button>
        </form>
        <div className="w-full flex justify-end mt-1 w-full md:w-[416px]">
          <p className="font-roboto text-[16px] font-normal text-base">
            <Link
              className="text-white hover:underline"
              onClick={toggleForgotPassword}
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 p-2 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 w-full md:w-1/2 lg:w-1/4 relative">
            <FontAwesomeIcon
              icon={faTimes}
              onClick={toggleForgotPassword}
              className="bg-black p-1 rounded absolute top-4 right-4 text-white cursor-pointer hover:text-white hover:bg-[#fe6c00]"
              size="lg"
            />

            <h3 className="text-2xl font-semibold text-center mb-8">
              Forgot Password
              <hr />
            </h3>

            {step === 1 && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => {
                    setActiveTab("email");
                    handleBackToInput();
                  }}
                  className={`mx-4 px-4 py-2 ${
                    activeTab === "email"
                      ? "bg-[#fe6c00] text-white"
                      : "bg-gray-200 text-black"
                  } rounded-[4px]`}
                >
                  Email ID
                </button>
                <button
                  onClick={() => {
                    setActiveTab("employeeid");
                    handleBackToInput();
                  }}
                  className={`px-4 px-4 py-2 ${
                    activeTab === "employeeid"
                      ? "bg-[#fe6c00] text-white"
                      : "bg-gray-200 text-black"
                  } rounded-[4px]`}
                >
                  Employee Id
                </button>
              </div>
            )}

            <div className="p-4">
              {step === 1 && (
                <div>
                  {activeTab === "email" && (
                    <form>
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:font-poppins placeholder:text-customBlack"
                      />
                      <button
                        onClick={handleNext}
                        className="mt-4 w-full py-2 bg-[#fe6c00] text-white font-semibold rounded-[8px] hover:bg-[#fe6c00] transition"
                      >
                        Next
                      </button>
                    </form>
                  )}
                  {activeTab === "employeeid" && (
                    <form>
                      <input
                        type="number"
                        placeholder="Employee Id"
                        className="bg-white w-full p-2 border border-[#2DC6BE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:font-poppins placeholder:text-customBlack"
                      />
                      <button
                        onClick={handleNext}
                        className="mt-4 w-full py-2 bg-[#fe6c00] text-white font-semibold rounded-[8px] hover:bg-[#fe6c00] transition"
                      >
                        Next
                      </button>
                    </form>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="flex-col justify-center space-x-2">
                  <p className="text-left mb-5 text-lg">Please  OTP</p>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-10 h-10 text-center border border-[#2DC6BE] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:font-poppins placeholder:text-customBlack"
                    />
                  ))}
                  <button
                    onClick={handleVerify}
                    className="mt-4 w-full py-2 bg-[#fe6c00] text-white font-semibold rounded-[8px] hover:bg-[#fe6c00] transition"
                  >
                    Verify
                  </button>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmitPassword}>
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="bg-white w-full p-2 mb-4 border border-[#2DC6BE] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:font-poppins placeholder:text-customBlack"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white w-full p-2 mb-4 border border-[#2DC6BE] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#fe6c00] placeholder:font-poppins placeholder:text-customBlack"
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full py-2 bg-[#fe6c00] text-white font-semibold rounded-[8px] hover:bg-[#fe6c00] transition"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
   
  );
};

export default LoginPage;