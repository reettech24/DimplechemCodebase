const { Op, fn, col, literal,Sequelize } = require("sequelize");
const moment = require("moment");
const {
  LeadCommunication,
  Customer,
  Lead,
  User,
  dealData,
  AnnualBusinessPlan,
} = require("../models"); // Import the model
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

// Insert a new lead communication record
// const createLeadCommunication = async (req, res) => {
//   try {
//     const {
//       customer_id,
//       lead_owner_id,
//       client_name,
//       lead_text,
//       lead_status,
//       lead_date,
//       lead_id,
//       start_meeting_time,
//       end_meeting_time,
//       next_meeting_time,
//     } = req.body;

//     // Ensure user is authenticated
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // Assign logged-in user ID to sales_persion_id
//     const sales_persion_id = req.user.id;

//     // Validate required fields
//     if (
//       !customer_id ||
//       !lead_owner_id ||
//       !client_name ||
//       !lead_text ||
//       !lead_status ||
//       !lead_date ||
//       !lead_id
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Insert record
//     const newLead = await LeadCommunication.create({
//       customer_id,
//       lead_owner_id,
//       sales_persion_id, // Automatically set from logged-in user
//       client_name,
//       lead_text,
//       lead_status,
//       lead_date,
//       lead_id,
//       start_meeting_time,
//       end_meeting_time,
//       start_meeting_time,
//       next_meeting_time,
//     });

//     res
//       .status(201)
//       .json({
//         success: true,
//         message: "Lead communication created successfully",
//         data: newLead,
//       });
//   } catch (error) {
//     console.error("Error inserting lead communication:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const createLeadCommunication = async (req, res) => {
  try {
    const {
      customer_id,
      lead_date,
      lead_id,
      start_meeting_time,
      start_location,
      lead_text,
      lead_status,
      client_name,
      latitude,
      longitude,
      type,
    } = req.body;

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Assign logged-in user ID to sales_persion_id
    const sales_persion_id = req.user.id;

    // Validate required fields
    if (!customer_id || !lead_date || !lead_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const latestLead = await LeadCommunication.findOne({
      where: {
        lead_id,
      },
      order: [["createdAt", "DESC"]],
    });

    // const updatedLeadText = `${latestLead.lead_text || ""}\n${lead_text}`;
    // const updatedLeadStatus = `${
    //   latestLead.lead_status || ""
    // } -> ${lead_status}`;

    if (!latestLead) {
      return res
        .status(404)
        .json({ message: "No lead communication record found to update" });
    }

    // Update the found record
    await latestLead.update({
      customer_id,
      sales_persion_id, // Automatically set from logged-in user
      lead_date,
      lead_id,
      start_meeting_time,
      start_location,
      // lead_text: updatedLeadText,
      // lead_status: updatedLeadStatus,
      client_name,
      latitude,
      longitude,
      type,
    });

    //update next followu date in lead table
    const Leaddate = await Lead.findOne({
      where: {
        id: latestLead?.lead_id,
      },
    });

    await Leaddate.update({
      next_followup: lead_date,
    });

    // Insert record
    // const newLead = await LeadCommunication.create({
    //   customer_id,
    //   sales_persion_id, // Automatically set from logged-in user
    //   lead_date,
    //   lead_id,
    //   start_meeting_time,
    //   start_location,
    //   lead_text,
    //   lead_status,
    //   client_name,
    //   latitude,
    //   longitude,
    //   type,
    // });

    res.status(201).json({
      success: true,
      message: "Meeting Started successfully",
      data: latestLead,
    });
  } catch (error) {
    console.error("Error inserting lead communication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const endMeeting = async (req, res) => {
  try {
    const {
      followup_summary,
      lead_status,
      lead_type,
      lead_date, // schedule for next meeting
      next_meeting_date,
      end_meeting_time,
      end_location,
      lead_id,
      final_meeting = false,
      meeting_done = true,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const sales_persion_id = req.user.id;

    if (!end_meeting_time || !end_location) {
      return res
        .status(400)
        .json({ message: "end_meeting_time and end_location are required" });
    }

    // Fetch the latest lead communication
    const latestLead = await LeadCommunication.findOne({
      where: { lead_id },
      order: [["createdAt", "DESC"]],
    });

    if (!latestLead) {
      return res
        .status(404)
        .json({ message: "No lead communication record found to update" });
    }

    const { start_meeting_time } = latestLead;

    if (!start_meeting_time) {
      return res.status(400).json({
        message: "start_meeting_time is missing in communication record",
      });
    }

    // Calculate time difference between start and end
    const start = new Date(`1970-01-01T${start_meeting_time}`);
    const end = new Date(`1970-01-01T${end_meeting_time}`);
    let diffMs = end - start;
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

    const newSeconds = Math.floor(diffMs / 1000);

    // Convert old total_hrs_spent (if any) to seconds
    let previousSeconds = 0;
    if (latestLead.total_hrs_spent) {
      const [h, m, s] = latestLead.total_hrs_spent.split(":").map(Number);
      previousSeconds = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
    }

    // Add previous + new
    const totalSeconds = previousSeconds + newSeconds;

    // Convert back to HH:mm:ss
    const totalHours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const totalMinutes = String(
      Math.floor((totalSeconds % 3600) / 60)
    ).padStart(2, "0");
    const totalSec = String(totalSeconds % 60).padStart(2, "0");

    const total_hrs_spent = `${totalHours}:${totalMinutes}:${totalSec}`;

    // Combine old and new lead text
    const oldText = latestLead.followup_summary
      ? latestLead.followup_summary.trim()
      : "";
    const lines = oldText ? oldText.split("\n") : [];
    const nextNumber = lines.length + 1;
    const newText = `${nextNumber}. ${followup_summary}`;
    const updatedLeadText = oldText ? `${oldText}\n${newText}` : newText;

    const leadDateValue = lead_date ? new Date(lead_date) : new Date();
    const updatedLeadStatus = `${
      latestLead.lead_status || ""
    } -> ${lead_status}`;

    // Update the lead communication
    await latestLead.update({
      // lead_text: updatedLeadText,
      followup_summary: updatedLeadText,
      // followup_summary,
      lead_status: updatedLeadStatus,
      lead_type,
      lead_date: leadDateValue,
      next_meeting_date,
      end_meeting_time,
      end_location,
      final_meeting: final_meeting === true || final_meeting === "true",
      meeting_done: meeting_done === true || meeting_done === "true",
      total_hrs_spent,
    });

    // Update next_followup in leads table
    await Lead.update(
      { next_followup: lead_date },
      { where: { id: latestLead.lead_id } }
    );

    res.json({
      success: true,
      message: "Meeting ended and lead communication updated successfully",
      data: latestLead,
    });
  } catch (error) {
    console.error("Error ending meeting:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const endMeeting = async (req, res) => {
//   try {
//     const {
//       lead_text,
//       lead_status,
//       lead_type,
//       lead_date, // schedule for next meeting
//       next_meeting_date,
//       end_meeting_time,
//       end_location,
//       lead_id,
//       final_meeting = false,
//       meeting_done = true,
//     } = req.body;

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const sales_persion_id = req.user.id;

//     if (!end_meeting_time || !end_location) {
//       return res
//         .status(400)
//         .json({ message: "end_meeting_time and end_location are required" });
//     }

//     // Fetch the latest lead communication
//     const latestLead = await LeadCommunication.findOne({
//       where: { lead_id },
//       order: [["createdAt", "DESC"]],
//     });

//     if (!latestLead) {
//       return res
//         .status(404)
//         .json({ message: "No lead communication record found to update" });
//     }

//     const { start_meeting_time } = latestLead;

//     if (!start_meeting_time) {
//       return res.status(400).json({
//         message: "start_meeting_time is missing in communication record",
//       });
//     }

//     // Calculate time difference between start and end
//     const start = new Date(`1970-01-01T${start_meeting_time}`);
//     const end = new Date(`1970-01-01T${end_meeting_time}`);
//     let diffMs = end - start;
//     if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

//     const newSeconds = Math.floor(diffMs / 1000);

//     // Convert old total_hrs_spent (if any) to seconds
//     let previousSeconds = 0;
//     if (latestLead.total_hrs_spent) {
//       const [h, m, s] = latestLead.total_hrs_spent.split(":").map(Number);
//       previousSeconds = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
//     }

//     // Add previous + new
//     const totalSeconds = previousSeconds + newSeconds;

//     // Convert back to HH:mm:ss
//     const totalHours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
//     const totalMinutes = String(
//       Math.floor((totalSeconds % 3600) / 60)
//     ).padStart(2, "0");
//     const totalSec = String(totalSeconds % 60).padStart(2, "0");

//     const total_hrs_spent = `${totalHours}:${totalMinutes}:${totalSec}`;

//     // Combine old and new lead text
//     const oldText = latestLead.lead_text ? latestLead.lead_text.trim() : "";
//     const lines = oldText ? oldText.split("\n") : [];
//     const nextNumber = lines.length + 1;
//     const newText = `${nextNumber}. ${lead_text}`;
//     const updatedLeadText = oldText ? `${oldText}\n${newText}` : newText;

//     const leadDateValue = lead_date ? new Date(lead_date) : new Date();
//     const updatedLeadStatus = `${latestLead.lead_status || ""} -> ${lead_status}`;

//     // Update the lead communication
//     await latestLead.update({
//       lead_text: updatedLeadText,
//       lead_status: updatedLeadStatus,
//       lead_type,
//       lead_date: leadDateValue,
//       next_meeting_date,
//       end_meeting_time,
//       end_location,
//       final_meeting: final_meeting === true || final_meeting === "true",
//       meeting_done: meeting_done === true || meeting_done === "true",
//       total_hrs_spent,
//     });

//     // Update next_followup in leads table
//     await Lead.update(
//       { next_followup: lead_date },
//       { where: { id: latestLead.lead_id } }
//     );

//     res.json({
//       success: true,
//       message: "Meeting ended and lead communication updated successfully",
//       data: latestLead,
//     });
//   } catch (error) {
//     console.error("Error ending meeting:", error);
//     res.status(500).json({ message: "Internal Server Error"});
//   }
// };

// const getLeadCommunicationsByLeadId = async (req, res) => {
//   try {
//     const { lead_id } = req.params;
//     const {
//       page = 1,
//       limit = 5,
//       search = "",
//       lead_status,
//       lead_date,
//     } = req.query;

//     // Validate lead_id
//     if (!lead_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "lead_id is required" });
//     }

//     // Base filter
//     let whereCondition = { lead_id };

//     // Unified Search (Across multiple fields)
//     if (search) {
//       whereCondition[Op.or] = [
//         { client_name: { [Op.like]: `%${search}%` } },
//         { lead_text: { [Op.like]: `%${search}%` } },
//         { lead_status: { [Op.like]: `%${search}%` } }, // Searching inside lead_status
//         { "$Customer.company_name$": { [Op.like]: `%${search}%` } }, // Search in related Customer table
//       ];
//     }

//     // Direct Filtering by lead_status
//     if (lead_status) {
//       whereCondition.lead_status = { [Op.like]: `%${lead_status}%` }; // Case-insensitive search
//     }

//     // Proper lead_date filtering
//     if (lead_date) {
//       const startDate = new Date(lead_date);
//       const endDate = new Date(startDate);
//       endDate.setHours(23, 59, 59, 999); // Include the whole day

//       whereCondition.lead_date = { [Op.between]: [startDate, endDate] };
//     }

//     // Convert page & limit to integers for pagination
//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);
//     const offset = (pageNumber - 1) * pageSize;

//     // Fetch paginated lead communications
//     const { count, rows } = await LeadCommunication.findAndCountAll({
//       where: whereCondition,
//       limit: pageSize,
//       offset,
//       attributes: [
//         "id",
//         "customer_id",
//         "lead_owner_id",
//         "sales_persion_id",
//         "lead_id",
//         "client_name",
//         "lead_text",
//         "lead_status",
//         "lead_date",
//         "next_meeting_time",
//         "createdAt",
//         "start_meeting_time",
//         "end_meeting_time",
//       ],
//       include: [
//         {
//           model: Customer,
//           attributes: ["company_name"], // Fetch only company_name
//         },
//       ],
//       order: [["id", "ASC"]], // Order by id in descending order
//     });

//     res.status(200).json({
//       success: true,
//       data: rows,
//       currentPage: pageNumber,
//       totalPages: Math.ceil(count / pageSize),
//       totalItems: count,
//     });
//   } catch (error) {
//     console.error("Error fetching lead communications:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const getLeadCommunicationsByLeadId = async (req, res) => {
//   try {
//     const { lead_id } = req.params;
//     const {
//       page = 1,
//       limit = 5,
//       search = "",
//       lead_status,
//       lead_date,
//     } = req.query;

//     if (!lead_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "lead_id is required" });
//     }

//     let whereCondition = { lead_id };

//     if (search) {
//       whereCondition[Op.or] = [
//         { client_name: { [Op.like]: `%${search}%` } },
//         { lead_text: { [Op.like]: `%${search}%` } },
//         { lead_status: { [Op.like]: `%${search}%` } },
//         { "$Customer.company_name$": { [Op.like]: `%${search}%` } },
//       ];
//     }

//     if (lead_status) {
//       whereCondition.lead_status = { [Op.like]: `%${lead_status}%` };
//     }

//     if (lead_date) {
//       const startDate = new Date(lead_date);
//       const endDate = new Date(startDate);
//       endDate.setHours(23, 59, 59, 999);
//       whereCondition.lead_date = { [Op.between]: [startDate, endDate] };
//     }

//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);
//     const offset = (pageNumber - 1) * pageSize;

//     const { count, rows } = await LeadCommunication.findAndCountAll({
//       where: whereCondition,
//       limit: pageSize,
//       offset,
//       attributes: [
//         "id",
//         "customer_id",
//         "lead_owner_id",
//         "sales_persion_id",
//         "lead_id",
//         "client_name",
//         "lead_text",
//         "lead_status",
//         "lead_date",
//         "createdAt",
//         "start_meeting_time",
//         "end_meeting_time",
//       ],
//       include: [
//         {
//           model: Customer,
//           attributes: ["company_name"],
//         },
//       ],
//       order: [["id", "DESC"]],
//     });

//     // 🔄 Merge records with same lead_id, sales_persion_id, customer_id, and lead_date
//     const mergedMap = new Map();
//     rows.forEach(item => {
//       const key = `${item.lead_id}-${item.sales_persion_id}-${item.customer_id}-${item.lead_date.toISOString().split('T')[0]}`;
//       if (!mergedMap.has(key)) {
//         mergedMap.set(key, {
//           ...item.toJSON(),
//           start_meeting_time: item.start_meeting_time || null,
//           end_meeting_time: item.end_meeting_time || null,
//         });
//       } else {
//         const existing = mergedMap.get(key);
//         if (item.start_meeting_time) existing.start_meeting_time = item.start_meeting_time;
//         if (item.end_meeting_time) existing.end_meeting_time = item.end_meeting_time;
//       }
//     });

//     const mergedData = Array.from(mergedMap.values());

//     res.status(200).json({
//       success: true,
//       data: mergedData,
//       currentPage: pageNumber,
//       totalPages: Math.ceil(mergedData.length / pageSize),
//       totalItems: mergedData.length,
//     });
//   } catch (error) {
//     console.error("Error fetching lead communications:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error"});
//   }
// };

const getLeadCommunicationsByLeadId = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const {
      page = 1,
      limit = 5,
      search = "",
      lead_status,
      lead_date,
    } = req.query;

    if (!customer_id) {
      return res
        .status(400)
        .json({ success: false, message: "customer_id is required" });
    }

    // 1️⃣ Get all Lead ids for given customer_id
    const leads = await Lead.findAll({
      where: { customer_id },
      attributes: ["id"],
    });

    const leadIds = leads.map((lead) => lead.id);

    if (leadIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
      });
    }

    // 2️⃣ Now build whereCondition for LeadCommunication
    let whereCondition = { lead_id: { [Op.in]: leadIds } };

    if (search) {
      whereCondition[Op.or] = [
        { client_name: { [Op.like]: `%${search}%` } },
        { lead_text: { [Op.like]: `%${search}%` } },
        { lead_status: { [Op.like]: `%${search}%` } },
        { "$Customer.company_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    if (lead_status) {
      whereCondition.lead_status = { [Op.like]: `%${lead_status}%` };
    }

    if (lead_date) {
      const startDate = new Date(lead_date);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      whereCondition.lead_date = { [Op.between]: [startDate, endDate] };
    }

    // 3️⃣ Pagination setup
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    // 4️⃣ Fetch LeadCommunications
    const { count, rows } = await LeadCommunication.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      attributes: [
        "id",
        "customer_id",
        "lead_owner_id",
        "sales_persion_id",
        "lead_id",
        "client_name",
        "lead_text",
        "followup_summary",
        "lead_status",
        "lead_date",
        "createdAt",
        "start_meeting_time",
        "end_meeting_time",
      ],
      include: [
        {
          model: Customer,
          attributes: ["company_name"],
        },
        {
          model: Lead,
          as: "leads",
          attributes: ["meeting_type"],
        },
        {
          model: User,
          as: "salesPerson",
          attributes: ["id", "username", "fullname"],
        },
      ],
      order: [["id", "DESC"]],
    });

    // 5️⃣ Merge records by (lead_id, sales_persion_id, customer_id, lead_date)
    const mergedMap = new Map();
    rows.forEach((item) => {
      // const key = `${item?.lead_id}-${item?.sales_persion_id}-${
      //   item?.customer_id
      // }-${item?.lead_date?.toISOString().split("T")[0]}`;
      let leadDate = "";
      if (item?.lead_date) {
        const dateObj = new Date(item.lead_date);
        if (!isNaN(dateObj)) {
          leadDate = dateObj.toISOString().split("T")[0];
        }
      }

      const key = `${item?.lead_id}-${item?.sales_persion_id}-${item?.customer_id}-${leadDate}`;

      if (!mergedMap.has(key)) {
        mergedMap.set(key, {
          ...item.toJSON(),
          start_meeting_time: item.start_meeting_time || null,
          end_meeting_time: item.end_meeting_time || null,
        });
      } else {
        const existing = mergedMap.get(key);
        if (item.start_meeting_time)
          existing.start_meeting_time = item.start_meeting_time;
        if (item.end_meeting_time)
          existing.end_meeting_time = item.end_meeting_time;
      }
    });

    const mergedData = Array.from(mergedMap.values());

    res.status(200).json({
      success: true,
      data: mergedData,
      currentPage: pageNumber,
      totalPages: Math.ceil(mergedData.length / pageSize),
      totalItems: mergedData.length,
    });
  } catch (error) {
    console.error("Error fetching lead communications by customer:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getWonLeadCommunications = async (req, res) => {
  try {
    const wonLeadCommunications = await LeadCommunication.findAll({
      //where: { lead_status: "won" },
      where: { final_meeting: 1 },
      include: [
        {
          model: Customer,
          attributes: ["id", "company_name", "email_id", "primary_contact"],
        }, // Include Customer details
        {
          model: User,
          as: "leadOwner",
          attributes: ["id", "username", "email", "fullname"],
        }, // Include Lead Owner details
        {
          model: User,
          as: "salesPerson",
          attributes: ["id", "username", "email", "fullname"],
        }, // Include Sales Person details
      ],
    });

    res.status(200).json({
      success: true,
      data: wonLeadCommunications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching won lead communications",
      error: error.message,
    });
  }
};

const exportWonLeadCommunications = async (req, res) => {
  try {
    const wonLeadCommunications = await LeadCommunication.findAll({
      //where: { lead_status: "won" },
      where: { final_meeting: 1 },
      include: [
        {
          model: Customer,
          attributes: ["id", "company_name", "email_id", "primary_contact"],
        },
        {
          model: User,
          as: "leadOwner",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "salesPerson",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Won Lead Communications");

    worksheet.columns = [
      { header: "Lead ID", key: "id", width: 10 },
      { header: "Customer Name", key: "company_name", width: 30 },
      { header: "Customer Email", key: "customer_email", width: 25 },
      { header: "Customer Phone", key: "primary_contact", width: 25 },
      // { header: "Lead Owner", key: "lead_owner", width: 20 },
      // { header: "Lead Owner Email", key: "lead_owner_email", width: 25 },
      { header: "Sales Person", key: "sales_person", width: 20 },
      { header: "Status", key: "lead_status", width: 15 },
    ];

    wonLeadCommunications.forEach((lead) => {
      worksheet.addRow({
        id: lead.id,
        company_name: lead.Customer?.company_name ?? null,
        customer_email: lead.Customer?.email_id ?? null,
        primary_contact: lead.Customer?.primary_contact ?? null,
        // lead_owner: lead.leadOwner?.username ?? null,
        // lead_owner_email: lead.leadOwner?.email ?? null,
        sales_person: lead.salesPerson?.username ?? null,
        lead_status: lead.final_meeting == true ? "Done" : "Not Done",
      });
    });

    const exportPath = path.join(__dirname, "../exports");
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      exportPath,
      `Won_Lead_Communications_${timestamp}.xlsx`
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, `Won_Lead_Communications_${timestamp}.xlsx`);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error exporting won lead communications",
      error: error.message,
    });
  }
};

// const visistsOfMonth = async (req, res) => {
//   try {
//     const today = new Date();
//     const month = today.getMonth(); // 0-indexed
//     const year = today.getFullYear();

//     const startDate = new Date(year, month, 1);
//     const endDate = new Date(year, month + 1, 0); // Last day of current month

//     const totalVisits = await LeadCommunication.count({
//       where: {
//         lead_date: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Total visits of the current month fetched successfully",
//       totalVisits,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching total visits of the month",
//       error: error.message,
//     });
//   }
// };

const visitsOfYear = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();

    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st

    const totalVisits = await LeadCommunication.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        end_meeting_time: {
          [Op.not]: null, // ✅ end_meeting_time is not null
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Total visits of the current year fetched successfully",
      totalVisits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching total visits of the year",
      error: error.message,
    });
  }
};
const getUserTotalVisits = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Logged-in user ID:", userId);

    const totalVisits = await LeadCommunication.count({
      where: {
        end_meeting_time: {
          [Op.not]: null,
        },
        sales_persion_id: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Total visits for logged-in user fetched successfully",
      totalVisits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching total visits",
      error: error.message,
    });
  }
};

const getTodayMeetingLocation = async (req, res) => {
  try {
    // Get the logged-in user's ID from authentication middleware
    const salesPersionId = req.user?.id;

    if (!salesPersionId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user logged in.",
      });
    }

    // Define the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch today's communications for the logged-in sales person
    const communications = await LeadCommunication.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
        sales_persion_id: salesPersionId,
      },
      order: [["createdAt", "DESC"]],
    });

    // Format the response for frontend consumption
    const locations = communications.map((comm) => ({
      id: comm.id,
      lat: parseFloat(comm.latitude),
      lng: parseFloat(comm.longitude),
      type: comm.type,
      address: comm.start_location ?? comm.end_location ?? null,
    }));

    res.status(200).json({
      success: true,
      message:
        "Today's meeting locations for current user fetched successfully.",
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching today's lead communications:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getMonthlyLeadCount = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const stats = await LeadCommunication.findAll({
      attributes: [
        [fn("MONTH", col("lead_date")), "monthNumber"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        // lead_source: "Marketing",
        lead_date: {
          [Op.between]: [
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`),
          ],
        },
      },
      group: [fn("MONTH", col("lead_date"))],
      order: [[literal("monthNumber"), "ASC"]],
      raw: true,
    });

    // const monthNames = [
    //  "Jan", "Feb", "Mar", "Apr", "May", "Jun","july", "Aug", "Sep", "Oct", "Nov", "Desc"
    // ];

    const quarters = {
      "Jan-Mar": 0,
      "Apr-Jun": 0,
      "Jul-Sep": 0,
      "Oct-Dec": 0,
    };

    // Map month numbers to month names and fill missing months with 0
    // const result = Array.from({ length: 12 }, (_, i) => {
    //   const match = stats.find((stat) => stat.monthNumber === i + 1);
    //   return {
    //     month: monthNames[i],
    //     count: match ? parseInt(match.count) : 0,
    //   };
    // });
    stats.forEach((stat) => {
      const month = parseInt(stat.monthNumber);
      const count = parseInt(stat.count);

      if (month >= 1 && month <= 3) quarters["Jan-Mar"] += count;
      else if (month >= 4 && month <= 6) quarters["Apr-Jun"] += count;
      else if (month >= 7 && month <= 9) quarters["Jul-Sep"] += count;
      else if (month >= 10 && month <= 12) quarters["Oct-Dec"] += count;
    });

    // Format the result as an array
    const result = Object.entries(quarters).map(([quarter, count]) => ({
      quarter,
      count,
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// const getLeadStatusCount = async (req, res) => {
//   try {
//     const currentYear = new Date().getFullYear();
//     const knownStatuses = ["Hot", "Warm", "Cold", "Order Confirmed", "Lost"];

//     const stats = await LeadCommunication.findAll({
//       attributes: ["lead_type", [fn("COUNT", fn("DISTINCT", col("customer_id"))), "count"]],
//       where: {
//         lead_date: {
//           [Op.between]: [
//             new Date(`${currentYear}-01-01`),
//             new Date(`${currentYear}-12-31`),
//           ],
//         },
//       },
//       group: ["lead_type"],
//       raw: true,
//     });

//     // Format and fill missing statuses with count 0
//     const result = knownStatuses.map((status) => {
//       const found = stats.find((item) => item.lead_type === status);
//       return {
//         status,
//         count: found ? parseInt(found.count) : 0,
//       };
//     });

//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     console.error("Error in getLeadStatusCount:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

const getLeadStatusCount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user.id;
    const userRole = req.user?.userrole;

    const knownStatuses = ["Hot", "Warm", "Cold", "Order Confirmed", "Lost"];

    // Step 1: Get latest lead IDs per customer
    const latestLeadIds = await Lead.findAll({
      attributes: [[Sequelize.fn("MAX", Sequelize.col("id")), "latest_id"]],
      where: {
        ...(userRole !== 1),
        active_status: "active",
      },
      group: ["customer_id"],
      raw: true,
    });

    const leadIds = latestLeadIds.map((item) => item.latest_id);

    if (leadIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No leads found",
        data: knownStatuses.map((type) => ({ lead_type: type, count: 0 })),
      });
    }

    // Step 2: Query lead_type counts from LeadCommunication where end_meeting_time is not null
    const communicationCounts = await LeadCommunication.findAll({
      attributes: [
        "lead_type",
        [Sequelize.fn("COUNT", Sequelize.col("lead_type")), "count"],
      ],
      where: {
        lead_id: { [Op.in]: leadIds },
        lead_type: { [Op.in]: knownStatuses },
        end_meeting_time: { [Op.ne]: null },
      },
      group: ["lead_type"],
      raw: true,
    });

    // Step 3: Fill missing statuses with 0
    const countMap = Object.fromEntries(knownStatuses.map((type) => [type, 0]));

    communicationCounts.forEach((item) => {
      countMap[item.lead_type] = parseInt(item.count);
    });

    const result = knownStatuses.map((type) => ({
      lead_type: type,
      count: countMap[type],
    }));

    res.status(200).json({
      success: true,
      message: "Lead type counts after meeting retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching lead type counts:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving lead type counts",
      error: error.message,
    });
  }
};



const getSalesAnalytics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Get sum of business_potential for for_month in [3, 6, 9, 12]
    const rawData = await AnnualBusinessPlan.findAll({
      attributes: [
        "for_month",
        [fn("SUM", col("buisness_potential")), "total_potential"],
      ],
      where: {
        for_month: {
          [Op.in]: [3, 6, 9, 12],
        },
      },
      createdAt: {
        [Op.between]: [
          new Date(`${currentYear}-01-01`),
          new Date(`${currentYear}-12-31`),
        ],
      },
      group: ["for_month"],
      raw: true,
    });

    // Map results into a fixed array of 4 values
    const monthMap = { 3: 0, 6: 1, 9: 2, 12: 3 };
    const expected = [0, 0, 0, 0]; // For Mar, Jun, Sep, Dec

    rawData.forEach((item) => {
      const index = monthMap[item.for_month];
      expected[index] = parseFloat(item.total_potential);
    });

    // Get achieved data from DealData grouped by month
    const dealdata = await dealData.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("SUM", col("amount")), "total_amount"],
      ],
      where: {
        createdAt: {
          [Op.between]: [
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`),
          ],
        },
      },
      group: [fn("MONTH", col("createdAt"))],
      raw: true,
    });

    const achieved = [0, 0, 0, 0]; // Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec

    dealdata.forEach((item) => {
      const month = parseInt(item.month);
      const amount = parseFloat(item.total_amount);

      if (month >= 1 && month <= 3) achieved[0] += amount;
      else if (month >= 4 && month <= 6) achieved[1] += amount;
      else if (month >= 7 && month <= 9) achieved[2] += amount;
      else if (month >= 10 && month <= 12) achieved[3] += amount;
    });

    const toLakh = (num) =>
      num && !isNaN(num) ? parseFloat((num / 100000).toFixed(2)) : 0;

    // Convert both arrays
    const expectedInLakhs = expected.map(toLakh);
    const achievedInLakhs = achieved.map(toLakh);

    res.status(200).json({
      success: true,
      data: {
        labels: ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"],
        expected: expectedInLakhs,
        achieved: achievedInLakhs,
      },
    });
  } catch (error) {
    console.error("Error in getAnnualBusinessPlanSummary:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getLeadAnalysis = async (req, res) => {
  try {
    const currentYear = moment().year();

    // Get all records for the current year from Lead
    const allLeads = await Lead.findAll({
      attributes: [
        [fn("MONTH", col("assign_date")), "month"],
        [fn("COUNT", col("id")), "count"],
        [
          literal(
            `CASE 
              WHEN lead_source = 'Marketing' THEN 'MKTG' 
              WHEN lead_source = 'Sales' THEN 'SALES'
              ELSE 'UNKNOWN' 
            END`
          ),
          "role",
        ],
      ],
      where: {
        assign_date: {
          [Op.between]: [
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`),
          ],
        },
      },
      group: [fn("MONTH", col("assign_date")), "role"],
      raw: true,
    });

    const categories = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
    const mktgData = [0, 0, 0, 0];
    const salesData = [0, 0, 0, 0];

    const getQuarterIndex = (month) => {
      if (month >= 1 && month <= 3) return 0;
      if (month >= 4 && month <= 6) return 1;
      if (month >= 7 && month <= 9) return 2;
      return 3;
    };

    allLeads.forEach((entry) => {
      const month = parseInt(entry.month);
      const count = parseInt(entry.count);
      const role = entry.role;
      const qIndex = getQuarterIndex(month);

      if (role === "MKTG") {
        mktgData[qIndex] += count;
      } else if (role === "SALES") {
        salesData[qIndex] += count;
      }
    });

    res.status(200).json({
      success: true,
      categories,
      series: [
        { name: "MKTG", data: mktgData },
        { name: "SALES", data: salesData },
      ],
    });
  } catch (error) {
    console.error("Error in getLeadsByRoleAndMonth:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getLeadAnalysis1 = async (req, res) => {
  try {
    const currentYear = moment().year();

    // Get all records for the current year
    const allLeads = await LeadCommunication.findAll({
      attributes: [
        [fn("MONTH", col("lead_date")), "month"],
        [fn("COUNT", col("id")), "count"],
        [
          literal(
            `CASE WHEN lead_owner_id IS NOT NULL THEN 'MKTG' ELSE 'SALES' END`
          ),
          "role",
        ],
      ],
      // where: fn("YEAR", col("lead_date")),
      where: {
        lead_date: {
          [Op.between]: [
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`),
          ],
        },
      },
      group: [fn("MONTH", col("lead_date")), "role"],
      raw: true,
    });

    // Prepare monthly data
    // const months = moment.months(); // Jan to Dec
    // const mktgData = [];
    // const salesData = [];
    const categories = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
    const mktgData = [0, 0, 0, 0];
    const salesData = [0, 0, 0, 0];

    // for (let i = 0; i < 12; i++) {
    //   const monthIndex = i + 1;

    //   const mktgEntry = allLeads.find(
    //     (entry) => entry.month === monthIndex && entry.role === "MKTG"
    //   );
    //   const salesEntry = allLeads.find(
    //     (entry) => entry.month === monthIndex && entry.role === "SALES"
    //   );

    //   mktgData.push(mktgEntry ? parseInt(mktgEntry.count) : 0);
    //   salesData.push(salesEntry ? parseInt(salesEntry.count) : 0);
    // }
    // Helper: map month to quarter index
    const getQuarterIndex = (month) => {
      if (month >= 1 && month <= 3) return 0;
      if (month >= 4 && month <= 6) return 1;
      if (month >= 7 && month <= 9) return 2;
      return 3;
    };

    // Fill quarterly data
    allLeads.forEach((entry) => {
      const month = parseInt(entry.month);
      const count = parseInt(entry.count);
      const role = entry.role;
      const qIndex = getQuarterIndex(month);

      if (role === "MKTG") {
        mktgData[qIndex] += count;
      } else if (role === "SALES") {
        salesData[qIndex] += count;
      }
    });

    res.status(200).json({
      success: true,
      categories,
      series: [
        { name: "MKTG", data: mktgData },
        { name: "SALES", data: salesData },
      ],
    });
  } catch (error) {
    console.error("Error in getLeadsByRoleAndMonth:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getMeetingCheckinCheckoutReport = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    let whereCondition = {
      start_meeting_time: { [Op.ne]: null },
    };

    if (search) {
      whereCondition[Op.or] = [
        { "$salesPerson.fullname$": { [Op.like]: `%${search}%` } },
        { "$Customer.company_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await LeadCommunication.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "customer_id",
        "lead_owner_id",
        "sales_persion_id",
        "lead_id",
        "client_name",
        "lead_text",
        "followup_summary",
        "lead_status",
        "lead_date",
        "createdAt",
        "start_meeting_time",
        "end_meeting_time",
        "total_hrs_spent",
        "start_location",
        "end_location",
      ],
      include: [
        {
          model: Customer,
          attributes: ["id", "company_name", "email_id"],
        },
        {
          model: User,
          as: "salesPerson",
          attributes: ["id", "username", "fullname", "email"],
        },
        {
          model: Lead,
          as: "leads",
          attributes: ["id", "assigned_person_id", "customer_id", "createdAt"],
          include: [
            {
              model: User,
              as: "assignedPerson",
              attributes: ["fullname"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: rows,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
    });
  } catch (error) {
    console.error("Error fetching lead communications:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const exportMeetingCheckinCheckoutReport = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    let whereCondition = {
      start_meeting_time: { [Op.ne]: null },
    };

    if (search) {
      whereCondition[Op.or] = [
        { "$salesPerson.fullname$": { [Op.like]: `%${search}%` } },
        { "$Customer.company_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const data = await LeadCommunication.findAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "customer_id",
        "lead_owner_id",
        "sales_persion_id",
        "lead_id",
        "client_name",
        "lead_text",
        "followup_summary",
        "lead_status",
        "lead_date",
        "createdAt",
        "start_meeting_time",
        "end_meeting_time",
        "total_hrs_spent",
        "start_location",
        "end_location",
      ],
      include: [
        {
          model: Customer,
          attributes: ["id", "company_name", "email_id"],
          required: true,
        },
        {
          model: User,
          as: "salesPerson",
          attributes: ["id", "username", "fullname", "email"],
          required: true,
        },
        {
          model: Lead,
          as: "leads",
          attributes: ["id", "assigned_person_id", "customer_id", "createdAt"],
          // include: [
          //   {
          //     model: User,
          //     as: "assignedPerson",
          //     attributes: ["fullname"]
          //   }
          // ]
        },
      ],
      raw: true,
      nest: true,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Checkin-Checkout Report");

    // Define headers
    worksheet.columns = [
      // { header: "Client Name", key: "client_name", width: 20 },
      { header: "Company", key: "company_name", width: 25 },
      { header: "Lead Date", key: "lead_date", width: 15 },
      { header: "Sales Person", key: "fullname", width: 20 },
      { header: "Start Meeting", key: "start_meeting_time", width: 20 },
      { header: "End Meeting", key: "end_meeting_time", width: 20 },
      { header: "Start Location", key: "start_location", width: 30 },
      { header: "End Location", key: "end_location", width: 30 },
      // { header: "Created At", key: "createdAt", width: 20 },
    ];

    // Add rows
    data.forEach((item) => {
      worksheet.addRow({
        company_name: item.Customer?.company_name ?? null,
        lead_date: item.lead_date
          ? new Date(item.lead_date).toISOString().split("T")[0]
          : "",
        fullname: item.salesPerson?.fullname ?? null,
        start_meeting_time: item.start_meeting_time || "",
        end_meeting_time: item.end_meeting_time || "",
        start_location: item.start_location || "",
        end_location: item.end_location || "",
      });
    });

    // Set content type and headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=meeting_checkin_checkout.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, message: "Failed to export data." });
  }
};

const exportMeetingStatusReport = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    let whereCondition = {
      start_meeting_time: { [Op.ne]: null },
    };

    if (search) {
      whereCondition[Op.or] = [
        { "$salesPerson.fullname$": { [Op.like]: `%${search}%` } },
        { "$Customer.company_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const data = await LeadCommunication.findAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
      attributes: [
        "id",
        "customer_id",
        "lead_owner_id",
        "sales_persion_id",
        "lead_id",
        "client_name",
        "lead_text",
        "followup_summary",
        "lead_status",
        "lead_date",
      ],
      include: [
        {
          model: Customer,
          attributes: ["id", "company_name", "email_id"],
          required: true,
        },
        {
          model: User,
          as: "salesPerson",
          attributes: ["id", "username", "fullname", "email"],
          required: true,
        },
        {
          model: Lead,
          as: "leads",
          attributes: ["id", "assigned_person_id", "customer_id", "createdAt"],
        },
      ],
      raw: true,
      nest: true,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Checkin-Checkout Report");

    // Define headers
    worksheet.columns = [
      { header: "Name", key: "fullname", width: 20 },
      { header: "Customer", key: "company_name", width: 25 },
      { header: "Date", key: "lead_date", width: 15 },
      { header: "Meeting Status", key: "lead_status", width: 20 },
    ];

    // Add rows
    data.forEach((item) => {
      worksheet.addRow({
        fullname: item.salesPerson?.fullname ?? null,
        company_name: item.Customer?.company_name ?? null,
        lead_date: item.lead_date
          ? new Date(item.lead_date).toISOString().split("T")[0]
          : "",
        lead_status: item.lead_status?.split("->").pop()?.trim() ?? null,
      });
    });

    // Set content type and headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=meeting_checkin_checkout.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ success: false, message: "Failed to export data." });
  }
};

const getDealCountByLead = async (req, res) => {
  try {
    const result = await dealData.findAll({
      attributes: [[fn("COUNT", fn("DISTINCT", col("lead_id"))), "count"]],
      where: {
        amount: { [Op.ne]: null }, // Only where amount is not null
      },
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in getDealCountByLead:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getNoOfClientExpected = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Sum of buisness_potential for current year
    const result = await AnnualBusinessPlan.findOne({
      attributes: [
        [fn("COUNT", fn("DISTINCT", col("customer_id"))), "total_potential"],
      ],
      where: {
        createdAt: {
          [Op.between]: [
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`),
          ],
        },
      },
      raw: true,
    });

    const total = result?.total_potential
      ? parseFloat(result.total_potential)
      : 0;

    res.status(200).json({
      success: true,
      total_potential: total,
    });
  } catch (error) {
    console.error("Error in getNoOfClientExpected:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createLeadCommunication,
  getLeadCommunicationsByLeadId,
  getWonLeadCommunications,
  exportWonLeadCommunications,
  visitsOfYear,
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
  getNoOfClientExpected,
  getUserTotalVisits,
};
