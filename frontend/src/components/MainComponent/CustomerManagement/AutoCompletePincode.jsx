import React, { useState } from "react";

const AutoCompleteInput = ({
  label,
  value,
  onChange,
  placeholder,
  options = [],
  name,
  onSelect,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(e);

    const filtered = options.filter((item) =>
      item.toString().startsWith(inputValue)
    );

    setSuggestions(filtered);
  };

  const handleSelect = (selectedValue) => {
    const event = { target: { name, value: selectedValue } };
    onChange(event);
    onSelect && onSelect(selectedValue);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      {label && (
        <label className="font-poppins text-bgData block mb-1">{label}</label>
      )}
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full border border-gray-400 rounded px-3 py-2"
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-40 overflow-y-auto shadow-lg">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
