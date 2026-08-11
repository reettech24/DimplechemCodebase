import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const InvoiceTemplate = ({ invoiceData }) => { 
  const calculateTotal = () =>
    invoiceData.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );

  const calculateTax = (subtotal) => subtotal * invoiceData.taxRate;

  const subtotal = calculateTotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const pdfRef = useRef();

  const generateInvoicePDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice ${invoiceData.clientName}.pdf`);  
  };

  return (
    <div>
      <div
        className="bg-white h-[750px] flex flex-col justify-center shadow-lg p-6 rounded-lg"
        ref={pdfRef}
      >
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
          <div>
            <p className="text-sm text-gray-600">
              Invoice #: {invoiceData.invoiceNumber}
            </p>
            <p className="text-sm text-gray-600">Date: {invoiceData.date}</p>
            <p className="text-sm text-gray-600">
              Due Date: {invoiceData.dueDate}
            </p>
          </div>
        </header>

        {/* Client Information */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Bill To:</h2>
          <p className="text-sm text-gray-600">{invoiceData.clientName}</p>
          <p className="text-sm text-gray-600">{invoiceData.clientAddress}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Seller Company Details:</h2>
          <p className="text-sm text-gray-600">Company Name: Idice System</p>
          <p className="text-sm text-gray-600">Company Address: Near IT Park</p>
          <p className="text-sm text-gray-600">Contact Person: 9545254123</p>
          <p className="text-sm text-gray-600">Phone/ Email: idice@gmail.com</p>
          <p className="text-sm text-gray-600">Company Tax Id: 3423</p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Product Details:</h2>
          <p className="text-sm text-gray-600">Product Code: 12</p>
          <p className="text-sm text-gray-600">Quantity: 2</p>
          <p className="text-sm text-gray-600">SubTotal Amount: 20000</p>
          <p className="text-sm text-gray-600">Tax: 20%</p>
          <p className="text-sm text-gray-600">Discount: 20%</p>
          <p className="text-sm text-gray-600">Shipping Charges: 10%</p>
          <p className="text-sm text-gray-600">Grand Total: 5000</p>
        </section>

        {/* Invoice Items */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-black">
                <th className="py-2 text-start">Description</th>
                <th className="py-2 text-start">Quantity</th>
                <th className="py-2 text-start">Unit Price</th>
                <th className="py-2 text-start">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b text-sm text-gray-800">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <section className="text-right">
          <div className="flex justify-between items-center mt-2">
            <span className="text-md text-gray-600">Subtotal:</span>
            <span className="text-sm text-gray-800">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-md text-gray-600">Tax (10%):</span>
            <span className="text-sm text-gray-800">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-4 font-semibold">
            <span className="text-lg text-gray-800">Total:</span>
            <span className="text-lg text-gray-800">${total.toFixed(2)}</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          Thank you for your business!
        </footer>
      </div>
      <div className="flex items-end justify-center gap-2">
        {/* <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
          Edit
        </button>
        <button className="bg-red-700 text-white px-3 py-2 rounded mt-2 hover:bg-red-900">
          Delete
        </button>
        <button className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
          Share
        </button> */}
        <button
          className="mt-4 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700"
          onClick={generateInvoicePDF}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
