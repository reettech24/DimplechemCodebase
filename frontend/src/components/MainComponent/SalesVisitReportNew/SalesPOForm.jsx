import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../MarketingManagement/MarketingManageData.css";
import "../../../layout/MainCssFile.css";
import { iconsImgs } from "../../../utils/images";
import DepartmentTable from "./DepartmentTable";
import Pagination from "./Pagination";
import AddRoleModal from "./AddRoleModal";
import ContentTop from "../../ContentTop/ContentTop";
import AllEmpSARReport from "./AllEmpSARReport";
import SarReportOfUser from "./SarReportOfUser";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { finalizeDeals, salesActivityReport } from "../../../redux/leadSlice";

const SalePOForm = () => {
  const dispatch = useDispatch();
  const { salesActivityData, totalPages, departmentloading, departmenterror } =
    useSelector((state) => state.lead);

  console.log("salesActivityData", salesActivityData);

  const [selectedSAR, setSelectedSAR] = useState({});
  const [allselectedSAR, allsetSelectedSAR] = useState([]);
  const [sarReportOpen, setsarReportOpen] = useState(false);
  const [allEmpSARReport, setAllEmpSARReport] = useState(false);

  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const leadPerPage = 20;

  useEffect(() => {
    dispatch(
      // finalizeDeals({
      //   page: currentPage,
      //   limit: leadPerPage,
      //   search: searchTerm,
      // })
      salesActivityReport({
        page: currentPage,
        limit: leadPerPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExportData = () => {
    const data = salesActivityData?.data.map((deal, index) => ({
      "Sr. No.": index + 1,
      "Employee Name": deal.assignedPerson?.fullname || "-",
      "Company Name": deal.customer?.company_name || "-",
      "Date of Visits": deal.assign_date
        ? new Date(deal.assign_date).toLocaleDateString()
        : "-",
      "No. of Visits": deal.communications?.[0]?.followup_summary
        ? (deal.communications[0].followup_summary.match(/^\d+\./gm) || [])
            .length
        : "-",
      "CheckIn location": deal.communications?.[0]?.start_location || "-",
      "CheckOut Location": deal.communications?.[0]?.end_location || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
      { wch: 18 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Visit Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Sales_Visit_Report.xlsx");
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Sales Visit Report
            </h1>
          </div>
          <div className="flex items-center flex-row gap-[8px] md:gap-[5px]">
            <div className="">
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={handleExportData}
              >
                Export Data
              </button>
            </div>
            {/* <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={() => {
                  allsetSelectedSAR(finalizeDealsData?.data);
                  setAllEmpSARReport(true);
                }}
              >
                All Employee SAR
              </button>
            </div> */}
          </div>
        </div>
        <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*------- Table Data Start -------*/}
            <DepartmentTable
              setEditUserModalOpen={setEditUserModalOpen}
              finalizeDealsData={salesActivityData?.data || []}
              setViewModalOpen={setViewModalOpen}
              setSelectedSAR={setSelectedSAR}
              setsarReportOpen={setsarReportOpen}
            />
            {/*------- Table Data End -------*/}
          </div>

          {sarReportOpen && (
            <SarReportOfUser
              setsarReportOpen={setsarReportOpen}
              selectedSAR={selectedSAR}
            />
          )}

          {allEmpSARReport && (
            <AllEmpSARReport
              setAllEmpSARReport={setAllEmpSARReport}
              allselectedSAR={allselectedSAR}
            />
          )}
        </div>
        {/* Pagination Controls with Number */}
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default SalePOForm;
