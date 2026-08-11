import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, listCustomers } from "../../../redux/customerSlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { iconsImgs } from "../../../utils/images";
import {
  fetchAllPincodes,
  getAreaByPincode,
  getCityByAreaname,
} from "../../../redux/customerSlice";
import AutoCompleteInput from "./AutoCompletePincode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const AddCustomerModal = ({
  setAddCustomerModalOpen,
  handleSubmitAddCustomer,
  formData,
  setFormData,
  handleChange,
  setFormErrors,
  formErrors,
  flashMessage,
  setFlashMessage,
  setFlashMsgType,
  flashMsgType,
  handleFlashMessage,
  bussinesasociatedata,
  handleUpdateAssociate,
  associatePopup,
  setAssociatePopup,
  handleAssociatePopup,
  newAssociateName,
  setNewAssociateName,
  newAssociatePhone,
  setNewAssociatePhone,
  newAssociateEmail,
  setNewAssociateEmail,
  BAformErrors,
  setBAFormErrors,
  bavalidateInputs,
  editFlashMessage,
  setEditFlashMessage,
  editFlashMsgType,
  setEditFlashMsgType,
  userDataWithRole
}) => {
  //console.log("bussinesasociatedata", bussinesasociatedata);

  const dispatch = useDispatch();
  const { allPincodes, allAreas, allCity } = useSelector(
    (state) => state.customer
  );

  useEffect(() => {
    dispatch(fetchAllPincodes());
  }, [dispatch]);

  //console.log("allAreas", allAreas);

  //const [associatePopup, setAssociatePopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ New state for success message
  const [areasByIndex, setAreasByIndex] = useState({});

  // const [newAssociateName, setNewAssociateName] = useState("");
  // const [newAssociateName, setNewAssociateName] = useState("");
  // const [newAssociatePhone, setNewAssociatePhone] = useState("");
  // const [newAssociateEmail, setNewAssociateEmail] = useState("");

  // const handleNewAssociateChange = (e) => {
  //   setNewAssociateName(e.target.value);
  // };

  // const handleAddAssociate = () => {
  //   if (newAssociateName.trim() === "") return;

  //   setFormData((prev) => ({
  //     ...prev,
  //     associate_name: [...prev.associate_name, newAssociateName],
  //   }));

  //   setNewAssociateName(""); // clear input

  //   handleFlashMessage("Business Associate added successfully!", "success");
  //   setNewAssociateName(""); // clear input field after adding

  //   setTimeout(() => {
  //     setAssociatePopup(false);
  //   }, 1000);
  // };

  //console.log("dsfds", formData.associate_name);

  const handleAddAssociate = () => {
    if (newAssociateName.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      associate_name: [
        ...prev.associate_name,
        {
          associate_name: newAssociateName,
          phone_no: newAssociatePhone,
          email: newAssociateEmail,
        },
      ],
    }));

    handleFlashMessage("Business Associate added successfully!", "success");

    // Clear inputs
    setNewAssociateName("");
    setNewAssociatePhone("");
    setNewAssociateEmail("");

    setTimeout(() => {
      setAssociatePopup(false);
    }, 1000);
  };

  // const handleAssociatePopup = () => {
  //   setAssociatePopup(true);
  // };

  //add more contact persons
  const handleContactPersonChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedContacts = [...prevData.contact_persons];
      updatedContacts[index][name] = value;
      return { ...prevData, contact_persons: updatedContacts };
    });
  };

  const addContactPerson = () => {
    setFormData((prevData) => ({
      ...prevData,
      contact_persons: [
        ...prevData?.contact_persons,
        { name: "", email: "", phone_no: "", designation: "" },
      ],
    }));
  };

  const removeContactPerson = (index) => {
    setFormData((prevData) => {
      const updatedContacts = [...prevData.contact_persons];
      updatedContacts.splice(index, 1);
      return { ...prevData, contact_persons: updatedContacts };
    });
  };
  //end add more conatct persons

  //add more address
  const addressTypes = ["Factory", "Office", "Plant / Unit 1", "Reg Office"];
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const newAddresses = [...formData.company_address];
    newAddresses[index][name] = value;

    // If location (areaname) changes — dispatch to get city
    if (name === "location") {
      dispatch(getCityByAreaname({ areaname: value }))
        .unwrap()
        .then((res) => {
          //console.log("res?.data[0]?.district", res?.data[0]?.district);
          if (res?.data[0]?.district) {
            newAddresses[index]["city"] = res?.data[0]?.district;
            setFormData((prevFormData) => ({
              ...prevFormData,
              company_address: newAddresses,
            }));
          }
        });
    }

    // Otherwise just update normally
    setFormData((prevFormData) => ({
      ...prevFormData,
      company_address: newAddresses,
    }));
  };

  const addAddress = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      company_address: [
        ...(prevFormData.company_address || []),
        {
          pincode: "",
          location: "",
          city: "",
          address_type: "",
          full_address: "",
        },
      ],
    }));
  };

  const removeAddress = (index) => {
    //console.log("index",index);
    // const newAddresses = formData?.company_address?.filter((_, i) => i !== index);
    // setFormData(newAddresses);
    setFormData((prevFormData) => ({
      ...prevFormData,
      company_address: prevFormData.company_address.filter(
        (_, i) => i !== index
      ),
    }));
  };
  //end add more address

  console.log("formData", formData);

  return (
    <>
      {/* Flash Messages */}

      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New Customer
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {editFlashMessage && editFlashMsgType === "success" && (
              <SuccessMessage message={editFlashMessage} />
            )}
            {editFlashMessage && editFlashMsgType === "error" && (
              <ErrorMessage message={editFlashMessage} />
            )}
          </div>
          <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
            )}
          </div>
          <div className="mt-5 md:mt-5 px-2 md:px-4  overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Date :
            </label>
            <input
              type="date"
              placeholder="Date"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div> */}
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Company Name :
                </label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.company_name && (
                  <p className="text-red-500 text-sm">
                    {formErrors.company_name}
                  </p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Business Associate Name :
                </label>
                <select
                  name="business_associate"
                  value={formData.business_associate}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                >
                  <option value="">Select Business Associate</option>
                  {/* {formData?.associate_name &&
                    formData?.associate_name.length > 0 &&
                    formData?.associate_name.map((item) => (
                      <option key={item.id} value={item.associate_name}>
                        {`${item.associate_name} - ${item.email}`}
                      </option>
                    ))} */}
                  {bussinesasociatedata &&
                    bussinesasociatedata?.length > 0 &&
                    bussinesasociatedata?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {`${item.associate_name} - ${item.email}`}
                      </option>
                    ))}
                </select>

                {formErrors.business_associate && (
                  <p className="text-red-500 text-sm">
                    {formErrors.business_associate}
                  </p>
                )}
              </div>

              <div onClick={handleAssociatePopup}>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData "></label>
                <input
                  type="text"
                  value="Add Associate"
                  className="block w-full mt-[22px] mb-2  text-center bg-green-500 cursor-pointer text-white rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>
              {/* Associate Popup Design */}
              {associatePopup && (
                <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white w-full md:w-[800px] pt-0 pb-4 rounded-[6px] flex flex-col">
                    <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
                      Add New Associate
                    </h2>
                    <div className="mt-5 md:mt-5 px-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto md:h-fit">
                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Associate Name :
                        </label>
                        <input
                          type="text"
                          name="associate_name"
                          value={newAssociateName}
                          onChange={(e) => setNewAssociateName(e.target.value)}
                          placeholder="associate name"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                        {BAformErrors.associate_name && (
                          <p className="text-red-500 text-sm">
                            {BAformErrors.associate_name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Phone no. :
                        </label>
                        <input
                          type="number"
                          name="phone_no"
                          value={newAssociatePhone}
                          onChange={(e) => setNewAssociatePhone(e.target.value)}
                          placeholder="Phone no."
                           min="0"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                        {BAformErrors.phone_no && (
                          <p className="text-red-500 text-sm">
                            {BAformErrors.phone_no}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Email ID :
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={newAssociateEmail}
                          onChange={(e) => setNewAssociateEmail(e.target.value)}
                          placeholder="Email"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                        {BAformErrors.email && (
                          <p className="text-red-500 text-sm">
                            {BAformErrors.email}
                          </p>
                        )}
                      </div>
                      {/* ✅ Success message */}
                      {successMessage && (
                        <div className="text-green-600 text-sm font-medium">
                          {successMessage}
                        </div>
                      )}
                    </div>
                    <div className="flex items-end justify-end gap-2 px-4">
                      <button
                        className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
                        //onClick={handleAddAssociate}
                        onClick={handleUpdateAssociate}
                      >
                        Add
                      </button>
                      <button
                        className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                        onClick={() => setAssociatePopup(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Company GST no :
                </label>
                <input
                  type="text"
                  name="gst_number"
                  placeholder="27ABCDE1234F1Z5"
                  value={formData.gst_number}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.gst_number && (
                  <p className="text-red-500 text-sm">
                    {formErrors.gst_number}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Enter Designation :
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.designation && (
                  <p className="text-red-500 text-sm">
                    {formErrors.designation}
                  </p>
                )}
              </div> */}

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Company Primary Contact :
                </label>
                <input
                  type="number"
                  name="primary_contact"
                  placeholder="Primary Contact"
                  value={formData.primary_contact}
                  onChange={handleChange}
                  min="0"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.primary_contact && (
                  <p className="text-red-500 text-sm">
                    {formErrors.primary_contact}
                  </p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Company Secondary Contact :
                </label>
                <input
                  type="number"
                  name="secondary_contact"
                  placeholder="Secondary Contact"
                  value={formData.secondary_contact}
                  onChange={handleChange}
                   min="0"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.secondary_contact && (
                  <p className="text-red-500 text-sm">
                    {formErrors.secondary_contact}
                  </p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Company Email Id :
                </label>
                <input
                  type="email"
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleChange}
                  placeholder="Email Id"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.email_id && (
                  <p className="text-red-500 text-sm">{formErrors.email_id}</p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Pan No :
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
              {/* <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  PinCode :
                </label>
                <input
                  type="number"
                  name="pincode"
                  placeholder="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.pincode && (
                  <p className="text-red-500 text-sm">{formErrors.pincode}</p>
                )}
              </div>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  City :
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm">{formErrors.location}</p>
                )}
              </div>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Address :
                </label>
                <textarea
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Reg Office Add :
                </label>
                <textarea
                  type="text"
                  name="address_2"
                  placeholder="Address 2"
                  value={formData.address_2}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.address_2 && (
                  <p className="text-red-500 text-sm">{formErrors.address_2}</p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Factory Add :
                </label>
                <textarea
                  type="text"
                  name="address_3"
                  placeholder="Address"
                  value={formData.address_3}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.address_3 && (
                  <p className="text-red-500 text-sm">{formErrors.address_3}</p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Plant / Unit Add :
                </label>
                <textarea
                  type="text"
                  name="address_4"
                  placeholder="Address"
                  value={formData.address_4}
                  onChange={handleChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {formErrors.address_4 && (
                  <p className="text-red-500 text-sm">{formErrors.address_4}</p>
                )}
              </div> */}
               {/* Sales Person */}
            <div>
              <label>Select Sales Person</label>
              <select
                name="sales_person_id"
                value={formData?.sales_person_id}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Person</option>
                {userDataWithRole?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
              {formErrors?.sales_person_id && (
                <p className="text-red-500">
                  {formErrors?.sales_person_id}
                </p>
              )}
            </div>
            </div>

            <h3 className="mt-12 mb-2 text-bgDataNew font-poppins border w-[300px] font-medium text-[20px] text-bgData mb-3 text-center mx-auto">
              Contact Person's
            </h3>

            {formData?.contact_persons?.map((person, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-4 rounded-md"
              >
                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Name: {index + 1}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contact Person Name"
                    value={person.name}
                    onChange={(e) => handleContactPersonChange(index, e)}
                    className="w-full border border-gray-400 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Designation: {index + 1}
                  </label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="Contact Person Designation"
                    value={person.designation}
                    onChange={(e) => handleContactPersonChange(index, e)}
                    className="w-full border border-gray-400 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Email: {index + 1}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={person.email}
                    onChange={(e) => handleContactPersonChange(index, e)}
                    className="w-full border border-gray-400 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Phone: {index + 1}
                  </label>
                  <input
                    type="number"
                    name="phone_no"
                    placeholder="Phone"
                    value={person.phone_no}
                     min="0"
                    onChange={(e) => handleContactPersonChange(index, e)}
                    className="w-full border border-gray-400 rounded px-3 py-2"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeContactPerson(index)}
                    className="text-white bg-red-500 px-3 py-1 rounded-[3px] mt-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}

            <div>
              <button
                type="button"
                onClick={addContactPerson}
                className="flex items-center text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />
                Add Contact
              </button>
            </div>

            {/* add more address */}

            <div>
              <h3 className="mt-12 mb-2 text-bgDataNew font-poppins border w-[300px] font-medium text-[20px] text-bgData mb-3 text-center mx-auto">
                Add Address
              </h3>

              {formData?.company_address?.map((address, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-4 rounded-md"
                >
                  <AutoCompleteInput
                    label={`PIN Code: ${index + 1}`}
                    name="pincode"
                    value={address.pincode}
                    onChange={(e) => handleAddressChange(index, e)}
                    placeholder="PIN Code"
                    options={allPincodes.data.map((item) => item.pincode)}
                    onSelect={(selectedPincode) => {
                      dispatch(getAreaByPincode({ pincode: selectedPincode }))
                        .unwrap()
                        .then((res) => {
                          setAreasByIndex((prev) => ({
                            ...prev,
                            [index]: res?.data || [],
                          }));
                        });
                    }}
                  />

                  {/* <div>
                    <label className="font-poppins text-bgData">PIN Code: {index + 1}</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={(e) => handleAddressChange(index, e)}
                      placeholder="PIN Code"
                      className="w-full border border-gray-400 rounded px-3 py-2"
                    />
                  </div> */}

                  <div>
                    <label className="font-poppins text-bgData">
                      Location: {index + 1}
                    </label>
                    <select
                      name="location"
                      value={address.location}
                      onChange={(e) => handleAddressChange(index, e)}
                      className="w-full border border-gray-400 rounded px-3 py-2"
                    >
                      <option value="">Select Location</option>
                      {areasByIndex[index]?.map((area, i) => (
                        <option key={i} value={area.areaname}>
                          {area.areaname}
                        </option>
                      ))}
                    </select>

                    {/* <input
                      type="text"
                      name="location"
                      value={address.location}
                      onChange={(e) => handleAddressChange(index, e)}
                      placeholder="Location"
                      className="w-full border border-gray-400 rounded px-3 py-2"
                    /> */}
                  </div>

                  <div>
                    <label className="font-poppins text-bgData">
                      City: {index + 1}
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      //onChange={(e) => handleAddressChange(index, e)}
                      placeholder="City"
                      className="w-full border border-gray-400 rounded px-3 py-2"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="font-poppins text-bgData">
                      Address Type: {index + 1}
                    </label>
                    <select
                      name="address_type"
                      value={address.address_type}
                      onChange={(e) => handleAddressChange(index, e)}
                      className="w-full border border-gray-400 rounded px-3 py-2"
                    >
                      <option value="">Select Type</option>
                      {addressTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-poppins text-bgData">
                      Detailed Address: {index + 1}
                    </label>
                    <textarea
                      name="full_address"
                      placeholder="Full Address"
                      onChange={(e) => handleAddressChange(index, e)}
                      className="w-full border border-gray-400 rounded px-3 py-2"
                      value={address.full_address}
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="text-white bg-red-500 px-3 py-2 rounded"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  onClick={addAddress}
                  className="flex items-center text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />
                  Add Address
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              //onClick={handleSubmit}
              onClick={handleSubmitAddCustomer}
            >
              Add Customer
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setAddCustomerModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCustomerModal;
