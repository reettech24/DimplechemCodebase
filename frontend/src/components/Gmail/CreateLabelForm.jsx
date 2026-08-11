import React, { useState,useEffect  } from "react";

const CreateLabelForm = ({ createLabel,labels = [] }) => {
  const [labelName, setLabelName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredLabels, setFilteredLabels] = useState(labels);
  const [searchQuery, setSearchQuery] = useState("");


   // Update filtered labels when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = labels.filter((label) =>
        label.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLabels(filtered);
    } else {
      setFilteredLabels(labels);
    }
  }, [searchQuery, labels]);



   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!labelName.trim()) {
      return alert("Please enter a label name.");
    }
    setLoading(true);
    setError("");  // Reset error

    try {
      await createLabel(labelName);
      setLabelName("");
      alert("Label created successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to create label. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   
   const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  return (
     <div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
        <input
          type="text"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
          placeholder="New Label Name"
          className="border border-gray-400 p-2 rounded w-full text-black"
        />
        <button
          type="submit"
          className={`bg-[#fd6c00bf] mt-2 text-white px-4 py-2 flex items-center justify-center rounded hover:bg-bgDataNew ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {/* Filter Existing Labels */}
      {/* <div className="mt-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Labels"
          className="border p-2 rounded w-full mb-2"
        />
        {searchQuery && (
        <div className="space-y-2">
          {filteredLabels.length > 0 ? (
            filteredLabels.map((label) => (
              <div
                key={label.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-200"
                onClick={() => alert(`Filter by: ${label.name}`)} // Replace with real action
              >
                📁 {label.name}
              </div>
            ))
          ) : (
            <div className="text-gray-600">No labels found</div>
          )}
        </div>
        )}

      </div> */}

      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default CreateLabelForm;
