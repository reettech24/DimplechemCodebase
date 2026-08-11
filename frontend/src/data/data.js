import { iconsImgs } from "../utils/images";
import { personsImgs } from "../utils/images";

export const navigationLinks = [
  { id: 1, title: "DashBoard", image: iconsImgs.home, path: "/dashboard",allowedRoles: [1, 2] },
  {
    id: 9,
    title: "sales DashBoard",
    image: iconsImgs.assignment,
    path: "/lead-sales",
    allowedRoles: [3],
  },
  // {
  //   id: 2,
  //   title: "Department Management",
  //   image: iconsImgs.department,
  //   path: "/department-management",
  // },
  // {
  //   id: 3,
  //   title: "Role Management",
  //   image: iconsImgs.role,
  //   path: "/role-management",
  // },
  {
    id: 2,
    title: "Employee Master",
    image: iconsImgs.employee,
    path: "/employee-management",
    allowedRoles: [1, 2]
  },
  // {
  //   id: 3,
  //   title: "Lead Management",
  //   image: iconsImgs.lead,
  //   path: "/lead-management",
  // },
  {
    id: 4,
    title: "Customer Master",
    image: iconsImgs.department,
    path: "/customer-management",
    allowedRoles: [1, 2, 3],
    // submenu: [
    //   {
    //     id: 4.1,
    //     title: "Customer Management",
    //     image: iconsImgs.lead,
    //     path: "/customer-management",
    //   },
    //   // {
    //   //   id: 4.2,
    //   //   title: "Lead Management",
    //   //   image: iconsImgs.lead,
    //   //   path: "/lead-management",
    //   // },
    // ],
  },
  {
    id: 5,
    title: "Sales Management",
    image: iconsImgs.assignment,
    path: "/sale-management",
    allowedRoles: [1, 3],
    submenu: [
      {
        id: 5.1,
        title: "Visit Plan (POA)",
        image: iconsImgs.followupform,
        path: "/sale-management/plan-of-action-for-day",
        allowedRoles: [3],
      },
      {
        id: 5.2,
        title: "Leads Management",
        image: iconsImgs.lead,
        path: "/sale-management/leads",
        allowedRoles: [1, 3],
        submenu: [
          // {
          //   id: "5.2.1",
          //   title: "Customer leads",
          //   image: iconsImgs.followupform,
          //   path: "/sale-management/customer-lead-list",
          //   allowedRoles: [1,3],
          // },
          {
            id: "5.2.1",
            title: "Sales Lead",
            image: iconsImgs.assignment,
            //path: "/sale-management/leads/assignment",
            path: "/sale-management/leads/lead-management",
            allowedRoles: [1,3],
            //allowedRoles: [],
          },
          {
            id: "5.2.1",
            title: "Finalize Deal",
            image: iconsImgs.poform,
            path: "/sale-management/leads/po-form",
            allowedRoles: [1, 3],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Marketing Management",
    image: iconsImgs.marketing,
    path: "/marketing-management",
    allowedRoles: [1],
    submenu: [
      {
        id: 6.1,
        title: "Marketing Management",
        image: iconsImgs.followupform,
        path: "/marketing-management/graph-management",
        allowedRoles: [1],
      },
       {
        id: 6.2,
        title: "Marketing Leads",
        image: iconsImgs.followupform,
        path: "/marketing-leads/graph-management",
        allowedRoles: [1],
      },
      // {
      //   id: 6.2,
      //   title: "Leads via Sources",
      //   image: iconsImgs.followupform,
      //   path: "/marketing-management/lead-via-source",
      //   allowedRoles: [1],
      // },
      // {
      //   id: 6.3,
      //   title: "Budget Analysis",
      //   image: iconsImgs.followupform,
      //   path: "/marketing-management/budget-analysis",
      // },
      // {
      //   id: 6.4,
      //   title: "Other Marketing",
      //   image: iconsImgs.followupform,
      //   path: "/marketing-management/other-like",
      //   submenu: [
      //     {
      //       id: "6.4.1",
      //       title: "Newspaper Ad",
      //       image: iconsImgs.followupform,
      //       path: "/marketing-management/other-like/newspaper-ad",
      //     },
      //     {
      //       id: "6.4.2",
      //       title: "Flyers",
      //       image: iconsImgs.followupform,
      //       path: "/marketing-management/other-like/flyers",
      //     },
      //   ]
      // },
    ],
  },
  {
    id: 7,
    title: "HR Management",
    image: iconsImgs.hr,
    path: "/hr",
    allowedRoles: [1, 2],
    submenu: [
      {
        id: 7.1,
        title: "Employee Details",
        image: iconsImgs.employee,
        path: "/hr/employee-details",
        allowedRoles: [1, 2],
      },
      {
        id: 7.2,
        title: "Attendance Sheet",
        image: iconsImgs.assignment,
        path: "/hr/attandance-sheet",
        allowedRoles: [1, 2],
      },
      // {
      //   id: 7.2,
      //   title: "leave Management",
      //   image: iconsImgs.assignment,
      //   path: "/hr/leave",
      // },
      // {
      //   id: 7.1,
      //   title: "Attendance Management",
      //   image: iconsImgs.assignment,
      //   path: "/hr/attandance",
      // },
      // {
      //   id: 7.2,
      //   title: "Leave Mangement",
      //   image: iconsImgs.assignment,
      //   path: "/hr/leave",
      // },
      // {
      //   id: 7.3,
      //   title: "Salary Management",
      //   image: iconsImgs.assignment,
      //   path: "/hr/salary",
      // },
      // {
      //   id: 7.4,
      //   title: "Recruitment and Hiring",
      //   image: iconsImgs.assignment,
      //   path: "/hr/recruitment",
      // },
      // {
      //   id: 7.6,
      //   title: "Candidate Application",
      //   image: iconsImgs.assignment,
      //   path: "/hr/candidate",
      // },
      // {
      //   id: 7.7,
      //   title: "Interview Scheduling",
      //   image: iconsImgs.assignment,
      //   path: "/hr/interview",
      // },
      // {
      //   id: 7.5,
      //   title: "Performance & Appraises",
      //   image: iconsImgs.assignment,
      //   path: "/hr/performance",
      // },
      // {
      //   id: 7.9,
      //   title: "Promotion & Increment",
      //   image: iconsImgs.assignment,
      //   path: "/hr/promotion",
      // },
      // {
      //   id: 7.6,
      //   title: "Documents & Compliance",
      //   image: iconsImgs.assignment,
      //   path: "/hr/document",
      // },
      // {
      //   id: 4.1,
      //   title: "Exit & Offboarding",
      //   image: iconsImgs.assignment,
      //   path: "/hr/exit",
      // },
      // { id: 3.3, title: 'Sales Follow-Up Form', image: iconsImgs.followupform, path: '/marketing-management/follow-up-form' },
      // { id: 3.4, title: 'Sales PO Form', image: iconsImgs.poform, path: '/marketing-management/po-form' }
    ],
  },

  // {
  //   id: 6,
  //   title: "User Management",
  //   image: iconsImgs.user_add,
  //   path: "/user-management",
  // },
  // {
  //   id: 7,
  //   title: "Customer Requirement",
  //   image: iconsImgs.customer_requirement,
  //   path: "/customer-requirement",
  // },
  {
    id: 8,
    title: "Report Management",
    image: iconsImgs.dmanage,
    path: "/report-management",
    allowedRoles: [1],
    submenu: [
      // {
      //   id: 8.1,
      //   title: "Sales Report",
      //   image: iconsImgs.followupform,
      //   path: "/report-management/lead-report",
      //   allowedRoles: [1],
      // },
      // {
      //   id: 8.1,
      //   title: "Employee Report",
      //   image: iconsImgs.followupform,
      //   path: "/report-management/employee-report",
      //   allowedRoles: [1],
      // },
       {
        id: 8.2,
        title: "Meeting Report",
        image: iconsImgs.followupform,
        path: "/report-management/meeting-report",
        allowedRoles: [1],
      },
      {
        id: 8.3,
        title: "POA Report",
        image: iconsImgs.followupform,
        path: "/report-management/plan-of-action-for-day",
        allowedRoles: [1],
      },
      {
        id: 8.4,
        title: "Sales Activity Report",
        image: iconsImgs.followupform,
        path: "/report-management/sales-activity-report",
        allowedRoles: [1],
      },
       {
        id: 8.11,
        title: "Sales Visit Report",
        image: iconsImgs.followupform,
        path: "/report-management/sales-visit-activity-report",
        allowedRoles: [1],
      },
      {
        id: 8.5,
        title: "Customer History Card",
        image: iconsImgs.followupform,
        path: "/report-management/customer-history-card",
        allowedRoles: [1],
      },
      {
        id: 8.6,
        title: "Customer Info Form",
        image: iconsImgs.followupform,
        path: "/report-management/customer-info-form",
        allowedRoles: [1],
      },
      {
        id: 8.7,
        title: "Annual Buissness Plan",
        image: iconsImgs.followupform,
        path: "/report-management/admin-annual-buisness-plan",
        allowedRoles: [1],
      },
      {
        id: 8.8,
        title: "Business Associate Report",
        image: iconsImgs.followupform,
        path: "/report-management/business-associate-report",
        allowedRoles: [1],
      },
      {
        id: 8.9,
        title: "Email Sent Report",
        image: iconsImgs.followupform,
        path: "/report-management/email-sent-report",
        allowedRoles: [1],
      },
       {
        id: 8.10,
        title: "Business Associate Customer Report",
        image: iconsImgs.followupform,
        path: "/report-management/business-associate-customer-report",
        allowedRoles: [1],
      },
    ],
  },

  
  // {
  //   id: 9,
  //   title: "Document Management",
  //   image: iconsImgs.dmanage,
  //   path: "/document-management",
  // },
  // {
  //   id: 10,
  //   title: "Quotation Management",
  //   image: iconsImgs.quotation,
  //   path: "/quotation-creation",
  // },
  // {
  //   id: 11,
  //   title: "Audit Management",
  //   image: iconsImgs.quotation,
  //   path: "/audit-management",
  // },

  // { id: 3, title: 'Budget', image: iconsImgs.budget, path: '/budget'},
  // { id: 4, title: 'Transactions', image: iconsImgs.plane, path: '/transactions' },
  // { id: 4, title: 'Subscriptions', image: iconsImgs.wallet, path: '/subscriptions' },
  // { id: 5, title: 'Loans', image: iconsImgs.bills, path: '/loans' },
  // { id: 6, title: 'Reports', image: iconsImgs.report, path: '/reports' },
  // { id: 7, title: 'Savings', image: iconsImgs.wallet, path: '/savings' },
  // { id: 8, title: 'Financial Advice', image: iconsImgs.wealth, path: '/advice' },
  // { id: 9, title: 'Account', image: iconsImgs.user, path: '/account' },
  {
    id: 10,
    title: "Product Master",
    image: iconsImgs.department,
    path: "/product-management",
    allowedRoles: [1]
  },
  {
    id: 11,
    title: "TaskShedule Management",
    image: iconsImgs.department,
    path: "/taskshedule-management",
    allowedRoles: [1]
  },

   {
    id: 12,
    title: "My Task Management",
    image: iconsImgs.department,
    path: "my-task/taskshedule-management",
    allowedRoles: []
  },
   {
    id: 18,
    title: "Out-tour Approval Form",
    image: iconsImgs.department,
    path: "/outtour-expenses",
    allowedRoles: [1,3]
  },
   {
    id: 19,
    title: "Tour & Travel Expenses Statement",
    image: iconsImgs.department,
    path: "/local-expenses",
    allowedRoles: [1,3]
  },
  { id: 19, title: "Leave Management", image: iconsImgs.Calender, path: "/employee-leave" ,allowedRoles: [3]},
  { id: 20, title: "Leave Management", image: iconsImgs.Calender, path: "/leave" ,allowedRoles: [1]},
  {
    id: 12,
    title: "Costworking Management",
    image: iconsImgs.department,
    path: "/cost-management",
    allowedRoles: [1,3]
  },
  {
    id: 19,
    title: "Mass Emailing",
    image: iconsImgs.employee,
    path: "/mass-emailing",
    allowedRoles: [1, 2, 3]
  },
  {
    id: 13,
    title: "Today POA",
    image: iconsImgs.department,
    path: "/plan-of-action-for-day/:poaType",
    allowedRoles: []
  },
  { id: 14, title: "Annual Buisness Plan", image: iconsImgs.Calender, path: "/annual-buisness-plan" ,allowedRoles: [3]},
  { id: 15, title: "Calender", image: iconsImgs.Calender, path: "/calender" ,allowedRoles: [3]},
  { id: 16, title: "Gmail", image: iconsImgs.Mail, path: "/gmailtest" ,allowedRoles: [3]},
  { id: 17, title: "Settings", image: iconsImgs.gears, path: "/settings" ,allowedRoles: []},
  { id: 18, title: "doc", image: iconsImgs.gears, path: "/secure-view/:token" ,allowedRoles: []},
  
];

//------------ Own Data --------------//
export const settingsList = [
  { id: 1, title: "Edit Profile", image: iconsImgs.Profile_Icon },
  { id: 2, title: "Notifications", image: iconsImgs.notification },
  { id: 3, title: "Privacy Policy", image: iconsImgs.privacy_policy },
  { id: 4, title: "Password and Security", image: iconsImgs.security },
  { id: 5, title: "Log Out", image: iconsImgs.Logout },
];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

// export const countryOptions = [
//   { value: "india", label: "India" },
//   { value: "usa", label: "USA" },
// ];

// export const stateOptions = {
//   india: [
//     { value: "madhya-pradesh", label: "Madhya Pradesh" },
//     { value: "uttar-pradesh", label: "Uttar Pradesh" },
//     { value: "andra-pradesh", label: "Andhra Pradesh" },
//   ],
//   usa: [
//     { value: "new-york", label: "New York" },
//     { value: "california", label: "California" },
//   ],
// };

// export const cityOptions = {
//   india: {
//     "madhya-pradesh": [
//       { value: "indore", label: "Indore" },
//       { value: "bhopal", label: "Bhopal" },
//     ],
//     "uttar-pradesh": [
//       { value: "lucknow", label: "Lucknow" },
//       { value: "kanpur", label: "Kanpur" },
//     ],
//     "andra-pradesh": [
//       { value: "visakhapatnam", label: "Visakhapatnam" },
//       { value: "vijayawada", label: "Vijayawada" },
//     ],
//   },
//   usa: {
//     "new-york": [
//       { value: "manhattan", label: "Manhattan" },
//       { value: "brooklyn", label: "Brooklyn" },
//     ],
//     california: [
//       { value: "los-angeles", label: "Los Angeles" },
//       { value: "san-francisco", label: "San Francisco" },
//     ],
//   },
// };

export const countryOptions = [
  { value: "india", label: "India" },
  { value: "usa", label: "USA" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "uk", label: "United Kingdom" },
];

export const stateOptions = {
  india: [
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "andra-pradesh", label: "Andhra Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "karnataka", label: "Karnataka" },
  ],
  usa: [
    { value: "new-york", label: "New York" },
    { value: "california", label: "California" },
    { value: "texas", label: "Texas" },
    { value: "florida", label: "Florida" },
    { value: "illinois", label: "Illinois" },
  ],
  canada: [
    { value: "ontario", label: "Ontario" },
    { value: "quebec", label: "Quebec" },
    { value: "british-columbia", label: "British Columbia" },
    { value: "alberta", label: "Alberta" },
    { value: "nova-scotia", label: "Nova Scotia" },
  ],
  australia: [
    { value: "new-south-wales", label: "New South Wales" },
    { value: "queensland", label: "Queensland" },
    { value: "victoria", label: "Victoria" },
    { value: "western-australia", label: "Western Australia" },
    { value: "south-australia", label: "South Australia" },
  ],
  uk: [
    { value: "england", label: "England" },
    { value: "scotland", label: "Scotland" },
    { value: "wales", label: "Wales" },
    { value: "northern-ireland", label: "Northern Ireland" },
    { value: "cornwall", label: "Cornwall" },
  ],
};

export const cityOptions = {
  india: {
    "madhya-pradesh": [
      { value: "indore", label: "Indore" },
      { value: "bhopal", label: "Bhopal" },
      { value: "gwalior", label: "Gwalior" },
      { value: "ujjain", label: "Ujjain" },
      { value: "jabalpur", label: "Jabalpur" },
    ],
    "uttar-pradesh": [
      { value: "lucknow", label: "Lucknow" },
      { value: "kanpur", label: "Kanpur" },
      { value: "agra", label: "Agra" },
      { value: "varanasi", label: "Varanasi" },
      { value: "allahabad", label: "Allahabad" },
    ],
    "andra-pradesh": [
      { value: "visakhapatnam", label: "Visakhapatnam" },
      { value: "vijayawada", label: "Vijayawada" },
      { value: "tirupati", label: "Tirupati" },
      { value: "kakinada", label: "Kakinada" },
      { value: "nellore", label: "Nellore" },
    ],
    maharashtra: [
      { value: "mumbai", label: "Mumbai" },
      { value: "pune", label: "Pune" },
      { value: "nagpur", label: "Nagpur" },
      { value: "nashik", label: "Nashik" },
      { value: "aurangabad", label: "Aurangabad" },
    ],
    karnataka: [
      { value: "bengaluru", label: "Bengaluru" },
      { value: "mangalore", label: "Mangalore" },
      { value: "mysore", label: "Mysore" },
      { value: "hubli", label: "Hubli" },
      { value: "belgaum", label: "Belgaum" },
    ],
  },
  usa: {
    "new-york": [
      { value: "manhattan", label: "Manhattan" },
      { value: "brooklyn", label: "Brooklyn" },
      { value: "queens", label: "Queens" },
      { value: "bronx", label: "Bronx" },
      { value: "staten-island", label: "Staten Island" },
    ],
    california: [
      { value: "los-angeles", label: "Los Angeles" },
      { value: "san-francisco", label: "San Francisco" },
      { value: "san-diego", label: "San Diego" },
      { value: "sacramento", label: "Sacramento" },
      { value: "fresno", label: "Fresno" },
    ],
    texas: [
      { value: "houston", label: "Houston" },
      { value: "dallas", label: "Dallas" },
      { value: "austin", label: "Austin" },
      { value: "san-antonio", label: "San Antonio" },
      { value: "fort-worth", label: "Fort Worth" },
    ],
    florida: [
      { value: "miami", label: "Miami" },
      { value: "orlando", label: "Orlando" },
      { value: "tampa", label: "Tampa" },
      { value: "jacksonville", label: "Jacksonville" },
      { value: "st-petersburg", label: "St. Petersburg" },
    ],
    illinois: [
      { value: "chicago", label: "Chicago" },
      { value: "aurora", label: "Aurora" },
      { value: "naperville", label: "Naperville" },
      { value: "peoria", label: "Peoria" },
      { value: "champaign", label: "Champaign" },
    ],
  },
  canada: {
    ontario: [
      { value: "toronto", label: "Toronto" },
      { value: "ottawa", label: "Ottawa" },
      { value: "hamilton", label: "Hamilton" },
      { value: "kitchener", label: "Kitchener" },
      { value: "windsor", label: "Windsor" },
    ],
    quebec: [
      { value: "montreal", label: "Montreal" },
      { value: "quebec-city", label: "Quebec City" },
      { value: "gatineau", label: "Gatineau" },
      { value: "laval", label: "Laval" },
      { value: "longueuil", label: "Longueuil" },
    ],
    "british-columbia": [
      { value: "vancouver", label: "Vancouver" },
      { value: "victoria", label: "Victoria" },
      { value: "kelowna", label: "Kelowna" },
      { value: "surrey", label: "Surrey" },
      { value: "richmond", label: "Richmond" },
    ],
    alberta: [
      { value: "calgary", label: "Calgary" },
      { value: "edmonton", label: "Edmonton" },
      { value: "red-deer", label: "Red Deer" },
      { value: "fort-mcmurray", label: "Fort McMurray" },
      { value: "lethbridge", label: "Lethbridge" },
    ],
    "nova-scotia": [
      { value: "halifax", label: "Halifax" },
      { value: "sydney", label: "Sydney" },
      { value: "dartmouth", label: "Dartmouth" },
      { value: "new-glasgow", label: "New Glasgow" },
      { value: "truro", label: "Truro" },
    ],
  },
  australia: {
    "new-south-wales": [
      { value: "sydney", label: "Sydney" },
      { value: "newcastle", label: "Newcastle" },
      { value: "wollongong", label: "Wollongong" },
      { value: "coffs-harbour", label: "Coffs Harbour" },
      { value: "tamworth", label: "Tamworth" },
    ],
    queensland: [
      { value: "brisbane", label: "Brisbane" },
      { value: "gold-coast", label: "Gold Coast" },
      { value: "sunshine-coast", label: "Sunshine Coast" },
      { value: "townsville", label: "Townsville" },
      { value: "cairns", label: "Cairns" },
    ],
    victoria: [
      { value: "melbourne", label: "Melbourne" },
      { value: "geelong", label: "Geelong" },
      { value: "ballarat", label: "Ballarat" },
      { value: "bendigo", label: "Bendigo" },
      { value: "shepparton", label: "Shepparton" },
    ],
    "western-australia": [
      { value: "perth", label: "Perth" },
      { value: "mandurah", label: "Mandurah" },
      { value: "bunbury", label: "Bunbury" },
      { value: "geraldton", label: "Geraldton" },
      { value: "albany", label: "Albany" },
    ],
    "south-australia": [
      { value: "adelaide", label: "Adelaide" },
      { value: "mount-gambier", label: "Mount Gambier" },
      { value: "whyalla", label: "Whyalla" },
      { value: "port-lincoln", label: "Port Lincoln" },
      { value: "port-augusta", label: "Port Augusta" },
    ],
  },
  uk: {
    england: [
      { value: "london", label: "London" },
      { value: "manchester", label: "Manchester" },
      { value: "birmingham", label: "Birmingham" },
      { value: "liverpool", label: "Liverpool" },
      { value: "bristol", label: "Bristol" },
    ],
    scotland: [
      { value: "edinburgh", label: "Edinburgh" },
      { value: "glasgow", label: "Glasgow" },
      { value: "aberdeen", label: "Aberdeen" },
      { value: "dundee", label: "Dundee" },
      { value: "perth", label: "Perth" },
    ],
    wales: [
      { value: "cardiff", label: "Cardiff" },
      { value: "swansea", label: "Swansea" },
      { value: "newport", label: "Newport" },
      { value: "bangor", label: "Bangor" },
      { value: "brecon", label: "Brecon" },
    ],
    "northern-ireland": [
      { value: "belfast", label: "Belfast" },
      { value: "derry", label: "Derry" },
      { value: "lisburn", label: "Lisburn" },
      { value: "newtownabbey", label: "Newtownabbey" },
      { value: "antrim", label: "Antrim" },
    ],
    cornwall: [
      { value: "truro", label: "Truro" },
      { value: "falmouth", label: "Falmouth" },
      { value: "st-ives", label: "St Ives" },
      { value: "penzance", label: "Penzance" },
      { value: "newquay", label: "Newquay" },
    ],
  },
};

export const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    role: "Manager",
    department: "HR",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Inactive",
    role: "Developer",
    department: "IT",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Active",
    role: "Designer",
    department: "Marketing",
  },
];

export const eventData = [
  { name: "Apple", value: 400 },
  { name: "Banana", value: 300 },
  { name: "Cherry", value: 200 },
  { name: "Mango", value: 100 },
];

export const invoices = [
  {
    invoiceNumber: "INV-123456",
    date: "January 17, 2025",
    dueDate: "February 17, 2025",
    clientName: "John Doe",
    clientAddress: "123 Main Street, New York, NY 10001",
    items: [
      { description: "Website Design", quantity: 1, unitPrice: 500 },
      { description: "Hosting (1 year)", quantity: 1, unitPrice: 100 },
      { description: "Domain Registration", quantity: 1, unitPrice: 20 },
    ],
    taxRate: 0.1,
  },
  {
    invoiceNumber: "INV-654321",
    date: "January 18, 2025",
    dueDate: "February 18, 2025",
    clientName: "Jane Smith",
    clientAddress: "456 Elm Street, Los Angeles, CA 90001",
    items: [
      { description: "Graphic Design", quantity: 2, unitPrice: 300 },
      { description: "Logo Design", quantity: 1, unitPrice: 200 },
    ],
    taxRate: 0.1,
  },
];

export const reports = [
  {
    title: "Annual Report 2024",
    reportNumber: "RPT-001",
    date: "January 17, 2025",
    summary:
      "This report provides an overview of the annual performance and highlights key metrics and achievements.",
    details: [
      { section: "Introduction", description: "Overview of the report." },
      {
        section: "Financials",
        description: "Summary of financial performance.",
      },
      { section: "Future Plans", description: "Upcoming projects and goals." },
    ],
    preparedBy: "John Doe",
  },
  {
    title: "Quarterly Report Q4 2024",
    reportNumber: "RPT-002",
    date: "January 15, 2025",
    summary:
      "The quarterly report outlines the performance metrics and progress of the last quarter.",
    details: [
      { section: "Revenue", description: "Total revenue generated in Q4." },
      { section: "Expenses", description: "Overview of expenditures." },
      {
        section: "Growth",
        description: "Comparison with the previous quarter.",
      },
    ],
    preparedBy: "Jane Smith",
  },
];

export const proposals = [
  {
    id: "PRP-001",
    title: "Website Redesign Proposal",
    date: "January 17, 2025",
    overview:
      "This proposal outlines the plan to redesign the company website to enhance user experience and accessibility.",
    keyPoints: [
      "Modern UI/UX design",
      "Mobile responsiveness",
      "SEO optimization",
    ],
    preparedBy: "Alice Johnson",
  },
  {
    id: "PRP-002",
    title: "Marketing Campaign Proposal",
    date: "January 16, 2025",
    overview:
      "A comprehensive plan for a targeted marketing campaign to increase brand awareness and reach new customers.",
    keyPoints: [
      "Social media advertising",
      "Email marketing strategy",
      "Performance analytics and reporting",
    ],
    preparedBy: "Bob Smith",
  },
];

export const agreements = [
  {
    id: "AGR-001",
    title: "Service Agreement",
    date: "January 17, 2025",
    partyA: "ABC Corp",
    partyB: "XYZ Ltd",
    terms: [
      "ABC Corp will provide services as outlined in Appendix A.",
      "XYZ Ltd will make payments as per the agreed schedule.",
      "Confidentiality must be maintained by both parties.",
    ],
    preparedBy: "John Doe",
  },
  {
    id: "AGR-002",
    title: "Non-Disclosure Agreement",
    date: "January 16, 2025",
    partyA: "Tech Innovations",
    partyB: "Startup Solutions",
    terms: [
      "All shared information will remain confidential.",
      "The NDA will be valid for 2 years from the date of signing.",
      "Breaches will result in legal actions as specified.",
    ],
    preparedBy: "Jane Smith",
  },
];

//------------ Own Data --------------//

export const transactions = [
  {
    id: 11,
    name: "Asis Kumar",
    image: personsImgs.person_one,
    date: "23/12/04",
    amount: 22000,
  },
  {
    id: 12,
    name: "Priya Sharma",
    image: personsImgs.person_three,
    date: "23/07/21",
    amount: 20000,
  },
  {
    id: 13,
    name: "Seema Rajpoot",
    image: personsImgs.person_two,
    date: "23/08/25",
    amount: 30000,
  },
];

export const reportData = [
  {
    id: 14,
    month: "Jan",
    value1: 45,
    value2: null,
  },
  {
    id: 15,
    month: "Feb",
    value1: 45,
    value2: 60,
  },
  {
    id: 16,
    month: "Mar",
    value1: 45,
    value2: null,
  },
  {
    id: 17,
    month: "Apr",
    value1: 45,
    value2: null,
  },
  {
    id: 18,
    month: "May",
    value1: 45,
    value2: null,
  },
];

export const budget = [
  {
    id: 19,
    title: "Subscriptions",
    type: "Automated",
    amount: 22000,
  },
  {
    id: 20,
    title: "Agreement Budget",
    type: "Automated",
    amount: 16000,
  },
  {
    id: 21,
    title: "Foodstuff",
    type: "Automated",
    amount: 20000,
  },
  {
    id: 22,
    title: "Subscriptions",
    type: null,
    amount: 10000,
  },
  // {
  //     id: 23,
  //     title: "Subscriptions",
  //     type: null,
  //     amount: 40000
  // }
];

export const subscriptions = [
  {
    id: 24,
    title: "Amit Kumar",
    due_date: "23/12/04",
    amount: 25,
  },
  {
    id: 25,
    title: "Sheetal Sharma",
    due_date: "23/12/10",
    amount: 50,
  },
  {
    id: 26,
    title: "Rohit Pal",
    due_date: "23/12/22",
    amount: 60,
  },
];

export const savings = [
  {
    id: 27,
    image: personsImgs.person_one,
    saving_amount: 250000,
    title: "Amit Kashayap",
    date_taken: "23/12/22",
    amount_left: 0,
  },
];
