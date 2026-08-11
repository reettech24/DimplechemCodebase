import { useState,useEffect } from "react";

function CategoryAutocomplete({ allCategories, handleProductChange, index,product }) {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);


  // Set initial value when product.technology_used is present (edit mode)
  useEffect(() => {
    if (product?.technology_used && allCategories?.data?.length > 0) {
      const existingCategory = allCategories?.data.find(
        (cat) => cat?.id == product?.technology_used
      );
      if (existingCategory) {
        setSearch(existingCategory?.category_name);
      }
    }
  }, [product?.technology_used, allCategories]);

  const filteredCategories = allCategories?.data?.filter((cat,index) =>
    cat.category_name.toLowerCase().startsWith(search.toLowerCase())
  );

  const handleSelect = (cat) => {
    //console.log("Clicked category:", cat);
    handleProductChange(
      { target: { name: "technology_used", value: cat.id } },
      index,'technology_used', cat.id
    );
    setSearch(cat.category_name);
    setShowSuggestions(false);
  };
  

  return (
    <div className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowSuggestions(true);
        }}
        //onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Technology Used"
        className="block w-full rounded-[5px] border px-3 py-2"
      />

      {showSuggestions && (
        <ul className="absolute z-10 w-full border bg-white max-h-40 overflow-y-auto rounded shadow">
          {filteredCategories?.map((cat) => (
            <li
              key={cat.id}
              onClick={()=>handleSelect(cat)}
              className="cursor-pointer px-3 py-2 hover:bg-gray-200"
            >
              {cat.category_name}
            </li>
          ))}
          {filteredCategories?.length === 0 && (
            <li className="px-3 py-2 text-gray-500">No category found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default CategoryAutocomplete;
