import React, { useEffect, useState, useContext } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./App.css";
import Sidebar from "./layout/Sidebar/Sidebar";
import Content from "./layout/Content/Content";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
} from "react-router-dom";
import UserManage from "./layout/UserManagement/UserManage";
import CustomerRequire from "./layout/CustomerRequirement/CustomerRequire";
import LeadGenerate from "./layout/LeadGeneration/LeadGenerate";
import DocumentManage from "./layout/DocumentManagement/DocumentManage";
import Demo from "./Demo";
import SettingPage from "./layout/Setting/SettingPage";
import QuotationManage from "./layout/QuotationManagement/QuotationManage";
import QuotationData from "./layout/QuotationDetail/QuotationData";
import AgreementSign from "./layout/AgreementSigning/AgreementSign";
import AuditManage from "./layout/AuditManagement/AuditManage";
import RoleManage from "./layout/MainlayoutComponent/RoleManagement/RoleManage";
import DepartmentManage from "./layout/MainlayoutComponent/DepartmentManagement/DepartmentManage";
import EmployeeManage from "./layout/MainlayoutComponent/EmployeeManagement/EmployeeManage";
import MarketingManage from "./layout/MainlayoutComponent/MarketingManagement/MarketingManage";
import SalesPersonAssign from "./components/MainComponent/MarketingManagement/SalesPersonAssignment/SalesPersonAssign";
import SalesPersonFollowUp from "./components/MainComponent/MarketingManagement/SalesFolllowUpForm/SalesPersonFollowUp";
import SalePOForm from "./components/MainComponent/MarketingManagement/SalesPOForm/SalesPOForm";
import LoginPage from "./mainPages/LoginPage";
import Attandance from "./components/MainComponent/HRManagement/AttendanceManagement/Attandance";
import LeaveManage from "./components/MainComponent/HRManagement/LeaveManagement/LeaveManage";
import RecruiterHiring from "./components/MainComponent/HRManagement/RecruitmentHiring/RecruiterHiring";
import PerformaceandAppraises from "./components/MainComponent/HRManagement/PerformaceandAppraises/Performance";
import SalaryManage from "./components/MainComponent/HRManagement/SalaryManagement/SalaryManage";
import DocumentCompletion from "./components/MainComponent/HRManagement/DocumentCompletion/DocumentCompletion";
import CustomerManageData from "./components/MainComponent/CustomerManagement/CustomerManageData";
import ProductManageData from "./components/MainComponent/ProductManagement/ProductManageData";
import CostWorking from "./components/MainComponent/CostWorking/CostWorkingManageData";

import SalesProgressMange from "./components/MainComponent/SalesProgressLeadManageData/SalesProgressMange";
import SalesViewLeadData from "./components/MainComponent/SalesProgressLeadManageData/SalesViewLeadData";
import PrivateRoute from "./PrivateRoute";
import { LeadFollowList } from "./components/MainComponent/MarketingManagement/LeadFollowList";
import LeadReportManageData from "./components/MainComponent/LeadReportManagement/ReportManageData";
import EmpReportManageData from "./components/MainComponent/EmployeeReportManagement/EmpReportManageData";

import TodaysLeadReport from "./components/MainComponent/LeadReportManagement/TodaysLeadReport";
import LeadByStatusReport from "./components/MainComponent/LeadReportManagement/LeadByStatusReport";
import LeadBySourceReport from "./components/MainComponent/LeadReportManagement/LeadBySourceReport";
import LeadByOwnershipReport from "./components/MainComponent/LeadReportManagement/LeadByOwnershipReport";
import AttendanceSheetData from "./components/MainComponent/HRManagement/AttendanceSheet/AttendanceSheetData";
import MarketingManageData from "./components/MainComponent/MarketingManagement/MarketingManageData";
import LeadByIndustryReport from "./components/MainComponent/LeadReportManagement/LeadByIndustryReport";
import ConvertedLeadReport from "./components/MainComponent/LeadReportManagement/ConvertedLeadReport";
import LeadviaSourceData from "./components/MainComponent/MarketingManagement/LeadViaSource/LeadviaSourceData";
import BudgetAnalysisData from "./components/MainComponent/MarketingManagement/BudgetAnalysis/BudgetAnalysisData";
import FlyersData from "./components/MainComponent/MarketingManagement/FlyersPage/FlyersData";
import NewsAdsData from "./components/MainComponent/MarketingManagement/NewsPaperAds/NewsAdsData";
import EmpByMonthAndYearReport from "./components/MainComponent/EmployeeReportManagement/EmpByMonthAndYearReport";
import EmpByDepartmentReport from "./components/MainComponent/EmployeeReportManagement/EmpByDepartmentReport";
import EmployeeLocationWiseReport from "./components/MainComponent/EmployeeReportManagement/EmployeeLocationWiseReport";
import EmpCheckInCheckoutReport from "./components/MainComponent/EmployeeReportManagement/EmpCheckInCheckoutReport";
import MeetingReportManageData from "./components/MainComponent/MeetingCInCoutReport/AttendanceSheetData";
import POAReport from "./components/MainComponent/POAReport/SalesPersonFollowUp";
import SalesVisitReport from "./components/MainComponent/SalesVisitReport/SalesPOForm";
import SalesVisitReportNew from "./components/MainComponent/SalesVisitReportNew/SalesPOForm";
import CustomerHistoryCard from "./components/MainComponent/CustomerHistoryCard/CustomerManageData";
import CustomerInfoForm from "./components/MainComponent/CustomerInfoForm/CustomerManageData";
import { SidebarContext } from "./context/sidebarContext";
import Calender from "./components/calender/Calender";
import Gmail from "./components/Gmail/gmail";
import CustomerLeadList from "./components/MainComponent/MarketingManagement/SalesFolllowUpForm/CustomerManageData";
import AnnualBuisnessReport from "./components/MainComponent/AnnualBuisnessPlan/AnnualBuisnessReport";
import AdminAnnualBuisnessPlan from "./components/MainComponent/AdminAnnualBuisnessPlan/AdminAnnualBuisnessPlan";
import BusinessAssociateReport from "./components/MainComponent/BussinesAssociateReport/BusinessAssociateList";
import TaskScheduleManageData from "./components/MainComponent/TaskSheduleManagement/TaskScheduleManageData";
import OutTourExpenses from "./components/MainComponent/OutTourExpensesData/OutTourExpenses";
import LocalOutTourExpenses from "./components/MainComponent/LocalExpensesData/LocalOutTourExpenses";
import SecureViewDocument from "./components/Gmail/SecureViewDocument";
import AdminSentEmailReport from "./components/MainComponent/AdminSentEmailReport/EmailSentReportData";
import NewMarketingManageData from "./components/MainComponent/NewMarketingManagement/NewMarketingManageData";
import BussinesAssociateCustomerReport from "./components/MainComponent/BussinesAssociateCustomerReport/BusinessAssociateList";
import MassEmail from "./components/MainComponent/MassEmailing/MassEmail";
import SalesLeaveManage from "./components/MainComponent/SalesLeaveManagement/SalesLeaveManage";
import AdminLeaveManage from "./components/MainComponent/AdminLeaveManagement/AdminLeaveManage";
import MarketingLeads from "./components/MainComponent/NewMarketingManagement/MarketingManagement/MarketingManageData";
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "55383078377-kpkl3r1n0qo8937ltrskk3ane2cvmoge.apps.googleusercontent.com",
    googleMapsApiKey: `${API_KEY}`, // replace with your actual API key
    libraries: ["places"],
  });

  const location = useLocation(); // ✅ Get current route
  // const hideSidebarRoutes = ["/"]; // ✅ Sidebar will be hidden on Login Page
  // const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);
  // const { isSidebarOpen } = useContext(SidebarContext);

  // List of routes to hide sidebar
  const hideSidebarRoutes = ["/", "/secure-view/:token"];

  // Check if current route matches any hide pattern
  const shouldShowSidebar = !hideSidebarRoutes.some((pattern) =>
    matchPath(pattern, location.pathname)
  );

  const { isSidebarOpen } = useContext(SidebarContext);

  return (
    <div className="app">
      {shouldShowSidebar && <Sidebar />} {/* ✅ Sidebar hidden on "/" */}
      <div
        className={`${
          location.pathname === "/" || "/secure-view/:token"
            ? "contentData"
            : isSidebarOpen
            ? "contentData"
            : "content"
        }`}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/secure-view/:token" element={<SecureViewDocument />} />
          {/* Protect private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Content />} />
            <Route
              path="/marketing-management/lead-management"
              element={<MarketingManage />}
            />
            <Route path="/lead-management" element={<MarketingManage />} />
            <Route
              path="/sale-management/leads/lead-management"
              element={<MarketingManage />}
            />
            {/* <Route path="/sale-management/lead-management/:id" element={<MarketingManage />} /> */}
            <Route
              path="/sale-management/leads/assignment"
              element={<SalesPersonAssign />}
            />
            <Route
              path="/sale-management/plan-of-action-for-day"
              element={<SalesPersonFollowUp />}
            />
            <Route
              path="/plan-of-action-for-day/:poaType"
              element={<SalesPersonFollowUp />}
            />
            <Route
              path="/sale-management/leads/po-form"
              element={<SalePOForm />}
            />
            <Route path="/employee-management" element={<EmployeeManage />} />
            <Route path="/hr/attandance" element={<Attandance />} />
            <Route path="/hr/leave" element={<LeaveManage />} />
            <Route path="/hr/recruitment" element={<RecruiterHiring />} />
            <Route
              path="/hr/performance"
              element={<PerformaceandAppraises />}
            />
            <Route path="/hr/employee-details" element={<EmployeeManage />} />
            <Route
              path="/hr/attandance-sheet"
              element={<AttendanceSheetData />}
            />
            <Route path="/hr/salary" element={<SalaryManage />} />
            <Route path="/hr/document" element={<DocumentCompletion />} />
            <Route path="/role-management" element={<RoleManage />} />
            <Route
              path="/report-management/lead-report"
              element={<LeadReportManageData />}
            />
            <Route
              path="/report-management/employee-report"
              element={<EmpReportManageData />}
            />
            <Route
              path="/report-management/meeting-report"
              element={<MeetingReportManageData />}
            />

            <Route
              path="/report-management/email-sent-report"
              element={<AdminSentEmailReport />}
            />
            <Route
              path="/report-management/business-associate-customer-report"
              element={<BussinesAssociateCustomerReport />}
            />
            <Route path="/todayleadreport" element={<TodaysLeadReport />} />
            <Route path="/statusleadreport" element={<LeadByStatusReport />} />
            <Route path="/sourceleadreport" element={<LeadBySourceReport />} />
            <Route
              path="/ownershipleadreport"
              element={<LeadByOwnershipReport />}
            />
            <Route
              path="/industryleadreport"
              element={<LeadByIndustryReport />}
            />
            <Route
              path="/taskshedule-management"
              element={<TaskScheduleManageData />}
            />
            <Route
              path="/my-task/taskshedule-management"
              element={<TaskScheduleManageData />}
            />
            <Route path="/outtour-expenses" element={<OutTourExpenses />} />
            <Route path="/local-expenses" element={<LocalOutTourExpenses />} />
            <Route
              path="/convertedleadreport"
              element={<ConvertedLeadReport />}
            />

            <Route
              path="/empmonthreport"
              element={<EmpByMonthAndYearReport />}
            />
            <Route
              path="/empdepartmentreport"
              element={<EmpByDepartmentReport />}
            />
            <Route
              path="/emplocationreport"
              element={<EmployeeLocationWiseReport />}
            />
            <Route
              path="/empcheckincheckoutreport"
              element={<EmpCheckInCheckoutReport />}
            />

            <Route
              path="/department-management"
              element={<DepartmentManage />}
            />
            <Route
              path="/customer-management"
              element={<CustomerManageData />}
            />
            <Route path="/product-management" element={<ProductManageData />} />
            <Route path="/cost-management" element={<CostWorking />} />

            <Route
              path="/marketing-management/graph-management"
              element={<NewMarketingManageData />}
            />
            <Route
              path="/marketing-management/lead-via-source"
              element={<LeadviaSourceData />}
            />
             <Route
              path="/marketing-leads/graph-management"
              element={<MarketingLeads/>}
            />
            <Route
              path="/marketing-management/budget-analysis"
              element={<BudgetAnalysisData />}
            />
            <Route
              path="/marketing-management/other-like/newspaper-ad"
              element={<NewsAdsData />}
            />
            <Route
              path="/marketing-management/other-like/flyers"
              element={<FlyersData />}
            />

            <Route path="/user-management" element={<UserManage />} />
            <Route path="/document-management" element={<DocumentManage />} />
            <Route path="/customer-requirement" element={<CustomerRequire />} />
            <Route
              path="/lead-sales"
              element={<SalesProgressMange isLoaded={isLoaded} />}
            />
            <Route path="/mass-emailing" element={<MassEmail />} />
            <Route
              path="/lead-sales/lead/:leadId"
              element={<SalesViewLeadData />}
            />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/audit-management" element={<AuditManage />} />
            <Route path="/quotation-creation" element={<QuotationManage />} />
            <Route
              path="/quotation-creation/quotation-details/agreement-signing"
              element={<AgreementSign />}
            />
            <Route
              path="/quotation-creation/quotation-details"
              element={<QuotationData />}
            />
            <Route
              path="/customer-requirement/lead-generate"
              element={<LeadGenerate />}
            />
            <Route path="/demo" element={<Demo />} />
            <Route
              path="/lead-followups/:leadId"
              element={<LeadFollowList />}
            />
            <Route
              path="/report-management/plan-of-action-for-day"
              element={<POAReport />}
            />
            <Route
              path="/report-management/sales-activity-report"
              element={<SalesVisitReport />}
            />
            <Route
              path="/report-management/sales-visit-activity-report"
              element={<SalesVisitReportNew />}
            />
            <Route
              path="/report-management/customer-history-card"
              element={<CustomerHistoryCard />}
            />
            <Route
              path="/report-management/customer-info-form"
              element={<CustomerInfoForm />}
            />

            <Route
              path="/report-management/admin-annual-buisness-plan"
              element={<AdminAnnualBuisnessPlan />}
            />

            <Route
              path="/report-management/business-associate-report"
              element={<BusinessAssociateReport />}
            />

            <Route
              path="/annual-buisness-plan"
              element={<AnnualBuisnessReport />}
            />

            <Route path="/employee-leave" element={<SalesLeaveManage />} />
            <Route path="/leave" element={<AdminLeaveManage />} />

            <Route path="/calender" element={<Calender />} />
            <Route path="/gmailtest" element={<Gmail />} />

            <Route
              path="/sale-management/customer-lead-list"
              element={<CustomerLeadList />}
            />

            {/* Add more protected routes here */}
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
