import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { fetchAllProducts } from "../../../redux/productSlice";
import ProductMultiSelect from "./ProductMultiSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { getProductByLeadId } from "../../../redux/leadSlice";

const DealCreationForm = ({
  dealCreationOpenForm,
  setDealCreationOpenForm,
  selectedLead,
  dealData,
  setDealData,
  handleDealInputChange,
  handleProductInputChange,
  handleSubmitDeal,
  addDealFlashMessage,
  addDealFlashMsgType,
  dealFormErrors,
  setDealFormErrors,
  leadProductData,
  setLeadProductData,
  handleSubmitAddProduct,
  totalAdvanceAmount,
  totalDealAmount,
  handleRemoveProduct,
}) => {
  const dispatch = useDispatch();
  const { allProducts, totalPages, productLoading, productError } = useSelector(
    (state) => state.product
  );
  //console.log("dealData",dealData);
  // const { pductByleadId } = useSelector((state) => state.lead);

  //console.log("pductByleadId", pductByleadId?.data);

  useEffect(() => {
    // dispatch(getProductByLeadId({ lead_id: selectedLead?.id }));
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // const [dealData, setDealData] = useState({
  //   products:
  //   pductByleadId?.data?.map((prod) => ({
  //       product_id: prod.id,
  //       product_name: prod.product_name,
  //       date: "",
  //       area: "",
  //       quantity: "",
  //       rate: "",
  //       amount: "",
  //     })) || [],
  //   advance_amount: "",
  //   deal_amount: "",
  // });

  // const handleProductInputChange = (index, field, value) => {
  //   const updatedProducts = [...dealData.products];
  //   updatedProducts[index][field] = value;

  //   setDealData({
  //     ...dealData,
  //     products: updatedProducts,
  //   });
  // };

  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[900px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add Deal
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {addDealFlashMessage && addDealFlashMsgType === "success" && (
              <SuccessMessage message={addDealFlashMessage} />
            )}
            {addDealFlashMessage && addDealFlashMsgType === "error" && (
              <ErrorMessage message={addDealFlashMessage} />
            )}
          </div>
          <div className="mt-5 md:mt-6 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <label className="font-poppins font-medium text-[16px] text-bgData">
              Select and Add Product:
            </label>
            <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[200px]  gap-4">
              <div className="flex-[6]">
                <ProductMultiSelect
                  allProducts={allProducts}
                  leadData={leadProductData}
                  setLeadData={setLeadProductData}
                />
              </div>

              <div className="flex-[4]">
                <button
                  className="w-full bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
                  onClick={handleSubmitAddProduct}
                >
                  Add Product
                </button>
              </div>
            </div>

            {/* Scrollable Products List */}
            <div className="max-h-[350px] overflow-y-auto border border-gray-400 p-2 rounded-md space-y-3 mt-4">
              {dealData?.deals?.map((product, index) => (
                <div
                  key={product.product_id}
                  className="border p-2 rounded bg-white"
                >
                  <h3 className="text-sm font-medium mb-2">
                    <span className="font-semibold">{index + 1}. </span>
                    {product.product_name}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div>
                      <label className="text-xs block mb-1">Date</label>
                      <input
                        type="date"
                        value={product.date}
                        onChange={(e) =>
                          handleProductInputChange(
                            index,
                            "date",
                            e.target.value
                          )
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="block w-full text-xs rounded border px-2 py-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1">Area</label>
                      <input
                        type="number"
                        value={product.area}
                        onChange={(e) =>
                          handleProductInputChange(
                            index,
                            "area",
                            e.target.value
                          )
                        }
                         min="0"
                        className="block w-full text-xs rounded border px-2 py-1"
                        placeholder="Area"
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1">Qty</label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleProductInputChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                         min="0"
                        className="block w-full text-xs rounded border px-2 py-1"
                        placeholder="Qty"
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1">Rate</label>
                      <input
                        type="number"
                        value={product.rate}
                        onChange={(e) =>
                          handleProductInputChange(
                            index,
                            "rate",
                            e.target.value
                          )
                        }
                         min="0"
                        className="block w-full text-xs rounded border px-2 py-1"
                        placeholder="Rate"
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1">Amount</label>
                      <input
                        type="number"
                        value={product.amount}
                        onChange={(e) =>
                          handleProductInputChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                         min="0"
                        className="block w-full text-xs rounded border px-2 py-1"
                        placeholder="Amount"
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">
                        Advance Amount
                      </label>
                      <input
                        type="number"
                        value={product.advance_amount}
                        onChange={(e) =>
                          handleProductInputChange(
                            index,
                            "advance_amount",
                            e.target.value
                          )
                        }
                         min="0"
                        className="block w-full text-xs rounded border px-2 py-1"
                        placeholder="Advance Amount"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-fit h-fit mt-4"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Advance and Deal Amount */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-24 mt-4">
              <div>
                <label className="text-sm block mb-1">Advance Amt</label>
                <input
                  type="number"
                  value={totalAdvanceAmount}
                  disabled
                  // onChange={(e) =>
                  //   setDealData({ ...dealData, total_advance_amount: e.target.value })
                  // }
                   min="0"
                  className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
                  //placeholder="Advance Amount"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">Deal Amt</label>
                <input
                  type="number"
                  value={totalDealAmount}
                  disabled
                  // onChange={(e) =>
                  //   setDealData({ ...dealData, deal_amount: e.target.value })
                  // }
                   min="0"
                  className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
                  //placeholder="Deal Amount"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleSubmitDeal}
            >
              Add Deal
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setDealCreationOpenForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealCreationForm;
