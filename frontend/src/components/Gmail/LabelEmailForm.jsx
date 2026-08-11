import React, { useState } from "react";

const LabelEmailForm = ({ labels, onAssignLabel }) => {
  const [email, setEmail] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  const handleAssign = () => {
    if (email && selectedLabel) {
      onAssignLabel(email, selectedLabel);
      setEmail("");
      setSelectedLabel("");
    }
  };

  return (
    <div className=" mb-4 flex space-x-2">
      <input
        type="email"
        placeholder="Enter Gmail address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 p-2 border border-gray-500 rounded text-black"
      />
        <select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
          className="p-2 border border-gray-500 rounded text-gray-800"
        >
        <option value="">Select Label</option>
        {labels
          .filter(label => label.type === 'user') // 👈 filter only custom labels
          .map(label => (
            <option key={label.id} value={label.id} >
              {label.name}
            </option>
          ))}
        </select>


      <button
        onClick={handleAssign}
        className="p-2 bg-bgDataNew text-white rounded"
      >
        Assign
      </button>
    </div>
  );
};

export default LabelEmailForm;
