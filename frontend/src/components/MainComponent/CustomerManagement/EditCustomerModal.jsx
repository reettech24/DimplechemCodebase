import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCustomer, listCustomers } from "../../../redux/customerSlice";
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

const EditUserModal = ({
  setEditCustomerModalOpen,
  selectedCustomer,
  setSelectedCustomer,
  editFormData,
  setEditFormData,
  editFormErrors,
  setEditFormErrors,
  editFlashMessage,
  setEditFlashMessage,
  editFlashMsgType,
  setEditFlashMsgType,
  handleEditChange,
  handleEditSubmit,
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
  userDataWithRole={userDataWithRole}
}) => {
  console.log("editFormData", editFormData);
  const dispatch = useDispatch();
  const { allPincodes, allAreas, allCity } = useSelector(
    (state) => state.customer
  );

  const [areasByIndex, setAreasByIndex] = useState({});
  const [citiesByIndex, setCitiesByIndex] = useState({});

  useEffect(() => {
    dispatch(fetchAllPincodes());
  }, [dispatch]);
  //  const [associatePopup, setAssociatePopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ New state for success message

  // const handleEditContactPersonChange = (index, e) => {
  //   const { name, value } = e.target;
  //   setEditFormData((prevData) => {
  //     const updatedContacts = [...prevData.contact_persons];
  //     updatedContacts[index][name] = value;
  //     return { ...prevData, contact_persons: updatedContacts };
  //   });
  // };
  const handleEditContactPersonChange = (index, e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => {
      const updatedContacts = prevData.contact_persons.map((person, i) =>
        i === index ? { ...person, [name]: value } : person
      );
      return { ...prevData, contact_persons: updatedContacts };
    });
  };

  const addEditContactPerson = () => {
    setEditFormData((prevData) => ({
      ...prevData,
      contact_persons: [
        ...prevData.contact_persons,
        { name: "", email: "", phone_no: "", designation: "" },
      ],
    }));
  };

  const removeEditContactPerson = (index) => {
    setEditFormData((prevData) => {
      const updatedContacts = [...prevData.contact_persons];
      updatedContacts.splice(index, 1);
      return { ...prevData, contact_persons: updatedContacts };
    });
  };

  //add more address
  const addressTypes = ["Factory", "Office", "Plant / Unit 1", "Reg Office"];

  useEffect(() => {
    editFormData.company_address.forEach((address, idx) => {
      if (address.pincode) {
        dispatch(getAreaByPincode({ pincode: address.pincode }))
          .unwrap()
          .then((res) => {
            setAreasByIndex((prev) => ({
              ...prev,
              [idx]: res.data || [],
            }));
          });
      }
    });
  }, [editFormData.company_address]);

  // Handle input changes for addresses
  const handleEditAddressChange = (index, e) => {
    const { name, value } = e.target;

    // Clone the array of addresses
    const newAddresses = [...editFormData.company_address];

    // Clone the specific address object before modifying
    const updatedAddress = { ...newAddresses[index], [name]: value };

    newAddresses[index] = updatedAddress;

    // If location changes, fetch city and update city field
    if (name === "location") {
      dispatch(getCityByAreaname({ areaname: value }))
        .unwrap()
        .then((res) => {
          if (res?.data[0]?.district) {
            // Clone the address again before modifying
            const updatedAddressWithCity = {
              ...newAddresses[index],
              city: res?.data[0]?.district,
            };

            newAddresses[index] = updatedAddressWithCity;

            setEditFormData((prevFormData) => ({
              ...prevFormData,
              company_address: newAddresses,
            }));
          }
        });
    }

    // Finally update form data state
    setEditFormData((prevData) => ({
      ...prevData,
      company_address: newAddresses,
    }));
  };

  // Add a new blank address
  const addEditAddress = () => {
    setEditFormData((prevData) => ({
      ...prevData,
      company_address: [
        ...prevData.company_address,
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

  // Remove an address by index
  const removeEditAddress = (index) => {
    const newAddresses = editFormData.company_address.filter(
      (_, i) => i !== index
    );
    setEditFormData((prevData) => ({
      ...prevData,
      company_address: newAddresses,
    }));
  };

  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Customer
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {editFlashMessage && editFlashMsgType === "success" && (
              <SuccessMessage message={editFlashMessage} />
            )}
            {editFlashMessage && editFlashMsgType === "error" && (
              <ErrorMessage message={editFlashMessage} />
            )}
          </div>
          <div className="mt-5 md:mt-5 px-4  overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Company Name :
                </label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Company Name"
                  value={editFormData.company_name}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.company_name && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.company_name}
                  </p>
                )}
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Business Associate Name :
                </label>
                <select
                  name="business_associate"
                  value={editFormData?.business_associate || " "}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                >
                  <option value="">Select Business Associate</option>
                  {bussinesasociatedata &&
                    bussinesasociatedata?.length > 0 &&
                    bussinesasociatedata?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {`${item.associate_name} - ${item.email}`}
                      </option>
                    ))}
                </select>

                {editFormErrors.business_associate && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.business_associate}
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

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Company GST no :
                </label>
                <input
                  type="text"
                  name="gst_number"
                  placeholder="27ABCDE1234F1Z5"
                  value={editFormData.gst_number}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.gst_number && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.gst_number}
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
                  value={editFormData.designation}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.designation && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.designation}
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
                  value={editFormData.primary_contact}
                  onChange={handleEditChange}
                   min="0"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.primary_contact && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.primary_contact}
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
                  value={editFormData.secondary_contact}
                  onChange={handleEditChange}
                   min="0"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.secondary_contact && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.secondary_contact}
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
                  value={editFormData.email_id}
                  onChange={handleEditChange}
                  placeholder="Email Id"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.email_id && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.email_id}
                  </p>
                )}
              </div>

              {/* <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               AadharNo :
            </label>
            <input
              type="number"
              placeholder="aadharNo"
              value={editFormData.aadharNo}
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
            {editFormErrors.aadharNo && (
          <p className="text-red-500 text-sm">{editFormErrors.aadharNo}</p>
        )}
          </div> */}

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Pan No :
                </label>
                <input
                  type="text"
                  name="pan_no"
                  placeholder="ABCDE1234F"
                  value={editFormData.pan_no}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.pan_no && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.pan_no}
                  </p>
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
                  value={editFormData.pincode}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.pincode && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.pincode}
                  </p>
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
                  value={editFormData.location}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.location && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.location}
                  </p>
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
                  value={editFormData.address}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.address && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.address}
                  </p>
                )}
              </div>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Reg Office Add :
                </label>
                <textarea
                  type="text"
                  name="address_2"
                  placeholder="Address"
                  value={editFormData.address_2}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.address_2 && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.address_2}
                  </p>
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
                  value={editFormData.address_3}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.address_3 && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.address_3}
                  </p>
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
                  value={editFormData.address_4}
                  onChange={handleEditChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {editFormErrors.address_4 && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.address_4}
                  </p>
                )}
              </div> */}
              {/* Sales Person */}
            <div>
              <label>Select Sales Person</label>
              <select
                name="sales_person_id"
                value={editFormData?.sales_person_id}
                onChange={handleEditChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Person</option>
                {userDataWithRole?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
              {editFormErrors?.sales_person_id && (
                <p className="text-red-500">
                  {editFormErrors?.sales_person_id}
                </p>
              )}
            </div>
            </div>

            {/* newe code */}
            <h3 className="mt-12 mb-2 text-bgDataNew font-poppins border w-[300px] font-medium text-[20px] text-bgData mb-3 text-center mx-auto">
              Contact Person's
            </h3>
            <div className="">
              {editFormData.contact_persons.map((person, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 mb-4 rounded-md relative"
                >
                  <div>
                    <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                      Name:{index + 1}
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Contact Person Name"
                      value={person.name}
                      onChange={(e) => handleEditContactPersonChange(index, e)}
                      className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                      Designation:{index + 1}
                    </label>
                    <input
                      type="text"
                      name="designation"
                      placeholder="Contact Person Designation"
                      value={person.designation}
                      onChange={(e) => handleEditContactPersonChange(index, e)}
                      className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                      Email:{index + 1}
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={person.email}
                      onChange={(e) => handleEditContactPersonChange(index, e)}
                      className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                      Phone:{index + 1}
                    </label>
                    <input
                      type="number"
                      name="phone_no"
                      placeholder="Phone"
                      value={person.phone_no}
                       min="0"
                      onChange={(e) => handleEditContactPersonChange(index, e)}
                      className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-4 flex justify-end items-start">
                    <button
                      type="button"
                      onClick={() => removeEditContactPerson(index)}
                      className="text-white bg-red-500 px-2 py-1 rounded-[3px] mt-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <button
                type="button"
                onClick={addEditContactPerson}
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

            {/* add address */}

            <div>
              <h3 className="mt-12 mb-2 text-bgDataNew font-poppins border w-[300px] font-medium text-[20px] text-bgData mb-3 text-center mx-auto">
                Edit Address
              </h3>

              {editFormData?.company_address.map((address, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 border p-4 mb-4 rounded-md"
                >
                  {/* <div>
                    <label className="font-poppins text-bgData">
                      PIN Code: {index + 1}
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={(e) => handleEditAddressChange(index, e)}
                      placeholder="PIN Code"
                      className="w-full border border-gray-400 rounded px-3 py-2"
                    />
                  </div> */}
                  <AutoCompleteInput
                    label={`PIN Code: ${index + 1}`}
                    name="pincode"
                    value={address.pincode}
                    onChange={(e) => handleEditAddressChange(index, e)}
                    placeholder="PIN Code"
                    options={
                      allPincodes?.data?.map((item) => item.pincode) || []
                    }
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

                  <div>
                    <label className="font-poppins text-bgData">
                      Location: {index + 1}
                    </label>
                    <select
                      name="location"
                      value={address.location}
                      onChange={(e) => handleEditAddressChange(index, e)}
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
                      onChange={(e) => handleEditAddressChange(index, e)}
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
                      onChange={(e) => handleEditAddressChange(index, e)}
                      placeholder="City"
                      readOnly
                      className="w-full border border-gray-400 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-poppins text-bgData">
                      Address Type: {index + 1}
                    </label>
                    <select
                      name="address_type"
                      value={address.address_type}
                      onChange={(e) => handleEditAddressChange(index, e)}
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
                      onChange={(e) => handleEditAddressChange(index, e)}
                      placeholder="Detailed Address"
                      className="w-full border border-gray-400 rounded px-3 py-2"
                      value={address.full_address}
                    />
                  </div>

                  <div className="md:col-span-5 flex justify-end items-start">
                    <button
                      type="button"
                      onClick={() => removeEditAddress(index)}
                      className="text-white bg-red-500 px-2 py-1 rounded"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={addEditAddress}
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
              className="bg-bgDataNew text-textdata whitespace-nowrap text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleEditSubmit}
            >
              Update Customer
            </button>
            <button
              className="mt-4 bg-gray-500 text-textdata whitespace-nowrap text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setEditCustomerModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
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
                  placeholder="associate name"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {BAformErrors.email && (
                  <p className="text-red-500 text-sm">{BAformErrors.email}</p>
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
    </>
  );
};

export default EditUserModal;
