import React, { useEffect } from "react";

const ViewProductModal = ({ setViewModalOpen, selectedProduct }) => {
  // Close on ESC press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setViewModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setViewModalOpen]);

  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg overflow-hidden">
        <div className="bg-bgDataNew px-6 text-center py-4 text-white text-xl font-semibold">
          Product Details
        </div>

        <div className="p-6 overflow-x-auto custom-scrollbar">
          <table className="w-full border border-gray-300 text-sm text-left">
            <tbody>
              <TableRow label="Product Name" value={selectedProduct?.product_name} />
              <TableRow label="Category" value={selectedProduct?.category?.category_name} />
              <TableRow label="HSN Code" value={selectedProduct?.HSN_code} />
              <TableRow label="Stock" value={selectedProduct?.stock} />
              <TableRow label="Unit" value={selectedProduct?.unit} />
              <TableRow label="Rate" value={selectedProduct?.rate} />
              <TableRow label="Consumption per Sq. Mtr." value={selectedProduct?.area_mtr2} />
              <TableRow label="Description" value={selectedProduct?.product_description} />
              <TableRow
                label="Status"
                value={selectedProduct?.status === 1 ? "Active" : "Inactive"}
              />
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setViewModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ label, value }) => (
  <tr className="border-b border-gray-200">
    <td className="py-2 px-4 font-bold text-gray-600 w-1/3">{label}</td>
    <td className="py-2 px-2 text-gray-800">:</td>
    <td className="py-2 px-4 text-gray-800">{value ?? null}</td>
  </tr>
);

export default ViewProductModal;
