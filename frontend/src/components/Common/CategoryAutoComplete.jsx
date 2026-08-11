import React, { useState, useEffect,useRef  } from "react";

const CategoryAutoComplete = ({
  allCategories,
  formData,
  setFormData,
  formErrors,
  editMode = false,
  editFormData,
  setEditFormData,
  editFormErrors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
   const wrapperRef = useRef(null);

  useEffect(() => {
    // When opening in edit mode, set initial category name in input if category_id exists
    if (editMode && editFormData.category_id) {
      const selectedCategory = allCategories?.data?.find(
        (c) => c.id === editFormData.category_id
      );
      if (selectedCategory) {
        setSearchTerm(selectedCategory.category_name);
      }
    }
    if (!editMode && formData.category_id) {
      const selectedCategory = allCategories?.data?.find(
        (c) => c.id === formData.category_id
      );
      if (selectedCategory) {
        setSearchTerm(selectedCategory.category_name);
      }
    }
  }, [allCategories, formData?.category_id, editFormData?.category_id, editMode]);

  const handleSelect = (category) => {
    if (editMode) {
      setEditFormData({ ...editFormData, category_id: category.id });
    } else {
      setFormData({ ...formData, category_id: category.id });
    }
    setSearchTerm(category.category_name);
    setShowSuggestions(false);
  };

  const filteredCategories = allCategories?.data?.filter((cat) =>
    cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


    // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
        Select Category :
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
          if (e.target.value === "") {
            if (editMode) {
              setEditFormData({ ...editFormData, category_id: "" });
            } else {
              setFormData({ ...formData, category_id: "" });
            }
          }
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search Category"
        className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-[9px]"
      />

      {showSuggestions && filteredCategories?.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-[#473b33] rounded-[5px] max-h-40 overflow-y-auto shadow-md">
          {filteredCategories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleSelect(category)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {category.category_name}
            </li>
          ))}
        </ul>
      )}

      {/* Error messages */}
      {editMode && editFormErrors?.category_id && (
        <p className="text-red-500 text-sm">{editFormErrors.category_id}</p>
      )}
      {!editMode && formErrors?.category_id && (
        <p className="text-red-500 text-sm">{formErrors.category_id}</p>
      )}
    </div>
  );
};

export default CategoryAutoComplete;
