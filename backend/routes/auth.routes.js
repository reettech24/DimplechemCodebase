const express = require("express");
const path = require("path");

const {
  register,
  login,
  listEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getCurrentUser,
  getAllEmployees,
  exportEmployeesToExcel,
  getDepartmentWise,
  exportEmployeesDepartment,
  getExitedEmployees,
  exportExitedEmployees,
  getEmployeesLocation,
  exportEmployeesLocation,
  exportEmployeesListToExcel,
  uploadSecureDoc,
  verifySecureDocument,
  downloadSecureDoc,
  getSecureDocument
} = require("../controllers/auth.controller");

const {
  listRoles,
  addRole,
  removeRole,
  updateRole,
} = require("../controllers/role.controller");
const {
  listDepartments,
  addDepartment,
  updateDepartment,
  removeDepartment,
} = require("../controllers/department.controller");
const {
  addCustomer,
  listCustomers,
  updateCustomer,
  removeCustomer,
  getCustomerAddresses,
  exportCustomersToExcel,
  customerInfo,
  customerHistory,
  getBuisnessAssociates,
  updateBusinessAssociate,
  listBusinessAssociates,
  exportBusinessAssociates,
  createBusinessAssociate,
  EditBusinessAssociate,
  deleteBusinessAssociate,
} = require("../controllers/customer.controller");
const {
  addLead,
  getLeadList,
  updateLead,
  removeLead,
  getTodaysAssignedLeadsCount,
  getTodayLeads,
  getLeadById,
  getAllUsersTodaysLeads,
  exportTodaysLeadsToExcel,
  getAllLeads,
  exportLeadsToExcel,
  getTodayAssignedLeads,
  updateDealFinalised,
  getFinalisedDeals,
  addDealData,
  getDealData,
  countTotalLeads,
  getleadaftermeeting,
  getleadFromMarketing,
  getTodayLeadsCount,
  getTodayLeadsCountofUser,
  addProductsToLead,
  getLeadListofAll,
  deleteProductFromLead,
  exportLeadsAfterMeetingToExcel,
  getAllPOAReports,
  getEmployeeListFromLeads,
  getPOAReportById,
  getPOAReportofAll,
  getPOAReportForSalesByCustId,
  getPendingPoaFollowupCount,
  getTotalsaleBySalePerson,
  getTotalSaleByAllEmployees,
  getAllPendingPoaFollowupCount
} = require("../controllers/lead.controller");
const {
  createLeadCommunication,
  getLeadCommunicationsByLeadId,
  getWonLeadCommunications,
  exportWonLeadCommunications,
  visitsOfYear,
  getUserTotalVisits,
  endMeeting,
  getTodayMeetingLocation,
  getMonthlyLeadCount,
  getLeadStatusCount,
  getSalesAnalytics,
  getLeadAnalysis,
  getMeetingCheckinCheckoutReport,
  exportMeetingCheckinCheckoutReport,
  getDealCountByLead,
  exportMeetingStatusReport,
  getNoOfClientExpected
} = require("../controllers/leadCommunicationController");

const {
  getAllLeaveData,
  updateMultipleLeaves,
  createLeave,
  getAllLeaves,
  approvedRejecteLeave,
  getMyLeaves,
  deleteLeave
} = require("../controllers/leave.controller");
const {
  checkIn,
  checkOut,
  getCheckinCheckoutReport,
  exportCheckinCheckoutReport,
  getDailyWorkingHours,
  getCurrentAttendanceStatus,
} = require("../controllers/chekinCheckout.controller");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  getProductsByCategoryId,
  exportProductsToExcel,
} = require("../controllers/product.controller");

const {
  createCostWorking,
  getCostWorking,
  updateCostWorking,
  exportCostWorkingListToExcel,
  getNextEstimateNo,
  exportCostWorkingByIdToExcel,
  exportCostWorkingByIdToPDFWithHTML,
  
} = require("../controllers/costWorking.controller");

const {
  createPlan,
  getPlanOfActions,
  updateSalesPerson,
  planOfActionForaDay,
} = require("../controllers/planofaction.controller");

const {
  createLeadAssignedHistory,
} = require("../controllers/leadAssignedHistoryController");

const { listCategories } = require("../controllers/category.controller");
const { getLeadProducts } = require("../controllers/dealDataController");
const {
  getAllPincodes,
  getAreaByPincode,
  getCityByAreaname,
} = require("../controllers/mytable.controller");
const {
  addAnnualBusinessPlan,
  getAnnualBusinessPlanList,
  updateAnnualBusinessPlan,
  getAnnualBusinessPlanSummary,
  getAnnualBusinessPlanByEmpId,
  getProductsByBusinessPlanId,
  exportAnnualBusinessPlanSummary,
} = require("../controllers/businessPlanController");

const {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  getTaskById,
  getTasksByUser,
} = require("../controllers/task.controller");

const {
  addOutTour,
  getOutTours,
  getOutTourById,
  deleteOutTour,
  updateOutTour,
  exportOutToursToExcel,
  exportOutTourExpensessByIdToPDFWithHTML
} = require("../controllers/outTourController");

const {
  addLocalExpense,
  updateLocalExpense,
  getLocalExpenses,
  getLocalExpenseById,
  deleteLocalExpense,
  exportLocalExpensesToExcel,
  exportLocalExpensessByIdToPDFWithHTML
} = require("../controllers/localExpenseController");
const {
  createMarketing,
  getAllMarketing,
  getMarketingById,
  updateMarketing,
  deleteMarketing,
  exportMarketingToExcel
} = require("../controllers/marketingController");   
const {
 getModules,
 getActions,
 createUserRights,
 updateUserRights,
 getUserRights
} = require("../controllers/permission.controller");


const authMiddleware = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

// User Registration Route
router.post("/register", register);

// User Login Route
router.post("/login", login);
router.get("/currentLoginuser", authMiddleware, getCurrentUser);

//role routes
router.get("/roleList", authMiddleware, listRoles);
router.post("/addRole", authMiddleware, addRole);
router.put("/updateRole/:id", authMiddleware, updateRole); // Pass `id` in the URL
router.delete("/removeRole/:id", authMiddleware, removeRole); // Pass `id` in the URL

//department routes
router.get("/departmentList", authMiddleware, listDepartments);
router.post("/departmentAdd", authMiddleware, addDepartment);
router.put("/departmentUpdate/:id", authMiddleware, updateDepartment); // Pass `id` in the URL
router.delete("/departmentRemove/:id", authMiddleware, removeDepartment); // Pass `id` in the URL

//employee routes
router.get("/employeeList", authMiddleware, listEmployees);
router.post("/employeeAdd", authMiddleware, upload, addEmployee);
router.put("/employeeUpdate/:id", authMiddleware, upload, updateEmployee);
router.delete("/employeeDelete/:id", authMiddleware, deleteEmployee);

//customer routes
router.get("/customerList", authMiddleware, listCustomers);
router.post("/addCustomer", authMiddleware, addCustomer);
router.put("/updateCustomer/:id", authMiddleware, updateCustomer);
router.delete("/removeCustomer/:id", authMiddleware, removeCustomer);
router.get("/leads/addresses/:id", authMiddleware, getCustomerAddresses);

//lead routes
router.post("/leadAdd", authMiddleware, addLead);
router.get("/leadList", authMiddleware, getLeadList);
router.put("/leadUpdate/:id", authMiddleware, updateLead);
router.put("/leadRemove/:id", authMiddleware, removeLead);

//sales lead routes
router.get(
  "/todaysAssignedLeadsCount",
  authMiddleware,
  getTodaysAssignedLeadsCount
);
router.get("/todaysLead", authMiddleware, getTodayLeads);
router.get("/getLeadById/:id", authMiddleware, getLeadById);
router.get("/users-todays-leads", authMiddleware, getAllUsersTodaysLeads);
router.get("/export-todays-leads", authMiddleware, exportTodaysLeadsToExcel);
router.get("/all-leads", authMiddleware, getAllLeads);
router.get("/export-leads", authMiddleware, exportLeadsToExcel);

//lead communication
router.post("/lead-communication", authMiddleware, createLeadCommunication);
router.get(
  "/lead-communications-list/:customer_id",
  authMiddleware,
  getLeadCommunicationsByLeadId
);
router.get(
  "/won-lead-communications",
  authMiddleware,
  getWonLeadCommunications
);
router.get("/export-won-Lead", authMiddleware, exportWonLeadCommunications);

//employee reports

router.get("/allEmployeeData", authMiddleware, getAllEmployees);
router.get("/export-employee", authMiddleware, exportEmployeesToExcel);
router.get("/employee-department", authMiddleware, getDepartmentWise);
router.get(
  "/export-employee-department",
  authMiddleware,
  exportEmployeesDepartment
);
router.get("/employee-location", authMiddleware, getEmployeesLocation);
router.get(
  "/export-employee-location",
  authMiddleware,
  exportEmployeesLocation
);

router.get("/leave", authMiddleware, getAllLeaveData);
router.post("/update-leave", authMiddleware, updateMultipleLeaves);
router.post("/apply-leave", authMiddleware,upload, createLeave);
router.get("/leave-requests", authMiddleware, getAllLeaves);
router.put("/approve-reject-leave/:id", authMiddleware, approvedRejecteLeave);
router.get("/my-leave", authMiddleware, getMyLeaves);
router.delete("/delete-leave/:id", authMiddleware, deleteLeave);


//checkin checkout routes
router.post("/checkin", authMiddleware, checkIn);
router.post("/checkout", authMiddleware, checkOut);
router.get(
  "/checkin-checkout-report",
  authMiddleware,
  getCheckinCheckoutReport
);
router.get(
  "/export-checkin-checkout",
  authMiddleware,
  exportCheckinCheckoutReport
);
router.get("/calculate-workhours", authMiddleware, getDailyWorkingHours);

//router.get("/todayleads-count", authMiddleware, getTodayAssignedLeads);

//product routes
router.get("/allProducts", authMiddleware, getAllProducts);
router.post("/addProduct", authMiddleware, createProduct);
router.put("/updateProduct/:id", authMiddleware, updateProduct);
router.put("/deleteProduct/:id", authMiddleware, toggleProductStatus);
router.post("/addCostWorking", authMiddleware, createCostWorking);
router.get("/getcostingwork", authMiddleware, getCostWorking);
//router.get("/getcostingwork/:cr_id",authMiddleware, getCostWorking);
router.put("/cost-working/update/:id", authMiddleware, updateCostWorking);
router.put("/deal-finalised/:id", authMiddleware, updateDealFinalised);
router.get("/finalised-deal", authMiddleware, getFinalisedDeals);
// Plan of Action routes
router.post("/create-planofaction", authMiddleware, createPlan);
router.get("/getplanofaction", authMiddleware, getPlanOfActions);
router.put("/update-planofaction/:id", authMiddleware, updateSalesPerson);
router.get(
  "/export-employee-details",
  authMiddleware,
  exportEmployeesListToExcel
);
router.get("/export-customers", authMiddleware, exportCustomersToExcel);
router.get("/customer-history/:id", authMiddleware, customerHistory);
router.get("/customer-info/:id", authMiddleware, customerInfo);

router.post(
  "/add-lead-assigned-history",
  authMiddleware,
  createLeadAssignedHistory
);
router.get("/poa-for-day", authMiddleware, planOfActionForaDay);
router.post("/addDeal", authMiddleware, addDealData);
router.get("/get-Deal-data", authMiddleware, getDealData);
router.get("/total-lead-count", authMiddleware, countTotalLeads);
router.get("/total-months-visits", authMiddleware, visitsOfYear);
router.get("/total-users-visits", authMiddleware, getUserTotalVisits);
// router.get("/buisness-asssociates/:id", authMiddleware, getBuisnessAssociates);
router.get("/buisness-asssociates", authMiddleware, getBuisnessAssociates);
router.get("/categories", authMiddleware, listCategories);
router.put(
  "/update-asssociates/:customer_id",
  authMiddleware,
  updateBusinessAssociate
);

router.post("/end-meeting", authMiddleware, endMeeting);
router.get("/get-lead-afterMeeting", authMiddleware, getleadaftermeeting);
router.get("/get-lead-from-marketing", authMiddleware, getleadFromMarketing);
router.get("/get-today-lead-count", authMiddleware, getTodayLeadsCount);
router.get("/get-user-lead-counter", authMiddleware, getTodayLeadsCountofUser);
router.get("/get-lead-products/:customer_id", authMiddleware, getLeadProducts);
router.post("/add-products-to-lead", authMiddleware, addProductsToLead);
router.get("/get-todays-location", authMiddleware, getTodayMeetingLocation);
router.get(
  "/get-product-category/:categoryId",
  authMiddleware,
  getProductsByCategoryId
);
router.get("/leadListofall", authMiddleware, getLeadListofAll);
router.get("/pincodes", authMiddleware, getAllPincodes);
router.get("/pincode/:pincode", authMiddleware, getAreaByPincode);
router.get("/pincodes/:areaname", authMiddleware, getCityByAreaname);
router.post("/delete-product-from-lead", authMiddleware, deleteProductFromLead);

router.get("/products-export", authMiddleware, exportProductsToExcel);
router.get("/costworking/export", authMiddleware, exportCostWorkingListToExcel);
router.get(
  "/export-after-meeting",
  authMiddleware,
  exportLeadsAfterMeetingToExcel
);

router.post("/submit-annual-plan", authMiddleware, addAnnualBusinessPlan);
//router.get('/business-plan/:id',authMiddleware, getAnnualBusinessPlanDetails);
router.get("/business-plan", authMiddleware, getAnnualBusinessPlanList);
router.put(
  "/update-business-plan/:id",
  authMiddleware,
  updateAnnualBusinessPlan
);
router.get("/getAllPOAReport", authMiddleware, getAllPOAReports);
router.get("/getPoaEmployeeList", authMiddleware, getEmployeeListFromLeads);
router.get("/getPOAReportById/:emp_id", authMiddleware, getPOAReportById);
router.get("/getPOAReportofAll", authMiddleware, getPOAReportofAll);

router.get(
  "/getAnnualBusinessPlan",
  authMiddleware,
  getAnnualBusinessPlanSummary
);
router.get(
  "/getAnnualBusinessPlanById/:id",
  authMiddleware,
  getAnnualBusinessPlanByEmpId
);
router.get(
  "/getProductsByBusinessPlanId/:id",
  authMiddleware,
  getProductsByBusinessPlanId
);

router.get(
  "/export-buisness-plan-summary",
  authMiddleware,
  exportAnnualBusinessPlanSummary
);
router.get("/customer-info/:id", authMiddleware, customerInfo);
router.get("/listBusinessAssociates", authMiddleware, listBusinessAssociates);
router.get(
  "/exportBusinessAssociates",
  authMiddleware,
  exportBusinessAssociates
);
router.post("/add-business-associate", authMiddleware, createBusinessAssociate);
router.put("/business-associates/:id", authMiddleware, EditBusinessAssociate);
router.delete(
  "/business-associates/:id",
  authMiddleware,
  deleteBusinessAssociate
);
router.get(
  "/getPOAReportForSalesByCustId/:cust_id",
  authMiddleware,
  getPOAReportForSalesByCustId
);
router.get("/attendance-status", authMiddleware, getCurrentAttendanceStatus);
router.post("/create-task", authMiddleware, createTask);
router.get("/tasks", authMiddleware, listTasks);
router.put("/update-tasks/:id", authMiddleware, updateTask);
router.delete("/delete-task/:id", authMiddleware, deleteTask);
router.get("/task/:id", authMiddleware, getTaskById);
router.get("/tasks/my-tasks", authMiddleware, getTasksByUser);

// Create OutTour
router.post("/out-tours", authMiddleware, addOutTour);

// Get all OutTours
router.get("/out-tours", authMiddleware, getOutTours);

// Get OutTour by ID
router.get("/out-tours/:id", authMiddleware, getOutTourById);

// Delete OutTour
router.delete("/out-tours/:id", authMiddleware, deleteOutTour);

router.put("/out-tours/:id", authMiddleware, updateOutTour);
router.get("/out-tours-export", authMiddleware, exportOutToursToExcel);

router.post("/local-expenses", authMiddleware, addLocalExpense);
router.put("/local-expenses/:id", authMiddleware, updateLocalExpense);
router.get("/local-expenses", authMiddleware, getLocalExpenses);
router.get("/local-expenses/:id", authMiddleware, getLocalExpenseById);
router.delete("/local-expenses/:id", authMiddleware, deleteLocalExpense);
router.get(
  "/local-expenses-export",
  authMiddleware,
  exportLocalExpensesToExcel
);
router.post("/upload-secure-doc", authMiddleware, upload, uploadSecureDoc);
router.post("/verify-secure-doc", authMiddleware, verifySecureDocument);
router.get("/secure/:filename", authMiddleware, downloadSecureDoc);
router.get("/getSecureDocument", authMiddleware, getSecureDocument);
router.get("/getMonthlyLeadCount", authMiddleware, getMonthlyLeadCount);
router.get("/getLeadStatusCount", authMiddleware, getLeadStatusCount);
router.get("/getSalesAnalytics", authMiddleware, getSalesAnalytics);
router.get("/getLeadAnalysis", authMiddleware, getLeadAnalysis);

//Marketing Module routes.

router.post("/add-marketing", authMiddleware, createMarketing);
router.get("/get-all-marketing", authMiddleware, getAllMarketing);
router.get("/get-marketing/:id", authMiddleware, getMarketingById);
router.put("/update-marketing/:id", authMiddleware, updateMarketing);
router.delete("/delete-marketing/:id", authMiddleware, deleteMarketing);
router.get(
  "/meeting-checkin-checkout-report",
  authMiddleware,
  getMeetingCheckinCheckoutReport
);
router.get(
  "/export-meeting-checkin-checkout-report",
  authMiddleware,
  exportMeetingCheckinCheckoutReport
);

router.get("/export-Meeting-Status-Report", authMiddleware , exportMeetingStatusReport);
router.get("/getNoOfClientExpected", authMiddleware , getNoOfClientExpected);

router.get("/getDealCountByLead", authMiddleware, getDealCountByLead);
router.get('/modules', authMiddleware , getModules);
router.get('/get-actions', authMiddleware , getActions);
router.post('/create-rights', authMiddleware , createUserRights);
router.put('/update-rights', authMiddleware , updateUserRights);
router.get('/getUserRights/:user_id', authMiddleware ,getUserRights);

router.get("/getPendingPoaFollowupCount", authMiddleware, getPendingPoaFollowupCount);
router.get('/getTotalsaleBySalePerson', authMiddleware, getTotalsaleBySalePerson);
router.get('/getTotalSaleByAllEmployees', authMiddleware, getTotalSaleByAllEmployees);
router.get('/getAllPendingPoaFollowupCount', authMiddleware, getAllPendingPoaFollowupCount)
router.get("/next-estimate-no", authMiddleware, getNextEstimateNo);
router.get('/costworking-export-excel/:id', authMiddleware, exportCostWorkingByIdToExcel);
//router.get('/exportCostWorkingByIdToPDF/:id', authMiddleware, exportCostWorkingByIdToPDF);
router.get('/exportCostWorkingByIdToPDFWithHTML/:id', authMiddleware, exportCostWorkingByIdToPDFWithHTML);
router.get('/exportLocalExpensessByIdToPDFWithHTML/:id', authMiddleware, exportLocalExpensessByIdToPDFWithHTML);
router.get('/exportOutTourExpensessByIdToPDFWithHTML/:id', authMiddleware, exportOutTourExpensessByIdToPDFWithHTML)

router.get('/exportMarketingToExcel', authMiddleware,exportMarketingToExcel);


module.exports = router;
