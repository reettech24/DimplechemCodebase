import { useState, useRef, useEffect  } from "react";

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const selectRef = useRef(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setShowOptions(false);
    setSearchTerm("");
  };
   // close dropdown on outside click
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative"  ref={selectRef}>
      <input
        type="text"
        value={searchTerm || options.find((opt) => opt.value === value)?.label || ""}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        placeholder={placeholder}
        className="block w-full border border-[#473b33] px-3 py-2 rounded-[5px]"
      />

      {showOptions && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
