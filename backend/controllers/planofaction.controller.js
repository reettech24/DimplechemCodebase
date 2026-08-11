const { Lead,EmployeeRole, Customer, User, sequelize, CheckinCheckout, CostWorking, Product, CostWorkingProduct,LeadAssignedHistory,dealData,LeadCommunication,CustomerContactPerson } = require("../models");

const { Op } = require("sequelize");
const moment = require("moment");

const createPlan = async (req, res) => {
  try {
    const {
      customer_id,
      location,
      contact_persion_name,
      sales_persion_id,
      meeting_date,
      meeting_type,
      meeting_summary,
      product_sale,
      total_material_qty,
      approx_business,
      project_name,
    } = req.body;

    const plan = await PlanOfAction.create({
      customer_id,
      location,
      contact_persion_name,
      sales_persion_id,
      meeting_date,
      meeting_type,
      meeting_summary,
      product_sale,
      total_material_qty,
      approx_business,
      project_name,
    });

    res.status(201).json({message:'Record added successfully', success: true, data: plan });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ success: false, message: "Server Error"});
  }
};
  
const getPlanOfActions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", all } = req.query;
    const offset = (page - 1) * limit;

    // Build WHERE condition
    const whereCondition = search
      ? {
          [Op.or]: [
            { contact_persion_name: { [Op.like]: `%${search}%` } },
            { project_name: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Common includes
    const includeRelations = [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "company_name"],
      },
      {
        model: User,
        as: "salesPerson",
        attributes: ["id", "fullname", "email"],
      },
    ];

    // If "all" is true, return all records without pagination
    if (all === "true") {
      const customers = await PlanOfAction.findAll({
        where: whereCondition,
        include: includeRelations,
        order: [["meeting_date", "DESC"]],
      });
      return res.status(200).json({message:"Data Fetched successfully", success: true, data: customers });
    }

    // Else paginated response
    const { count, rows } = await PlanOfAction.findAndCountAll({
      where: whereCondition,
      include: includeRelations,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["meeting_date", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message:"Data Fetched successfully",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching PlanOfAction list:", error);
    res.status(500).json({ success: false, message: "Server Error"});
  }
};

const updateSalesPerson = async (req, res) => {
  try {
    const { id } = req.params; 
    const { sales_persion_id } = req.body;
    console.log(id, sales_persion_id);

    if (!sales_persion_id) {
      return res.status(400).json({
        success: false,
        message: "sales_persion_id is required",
      });
    }

    const plan = await PlanOfAction.findByPk(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan of Action not found",
      });
    }
    //console.log(plan.sales_persion_id == sales_persion_id);
    // Check if it's already assigned
  if (plan.sales_persion_id == sales_persion_id) {
      return res.status(400).json({
        success: false,
        message: "This sales person is already assigned to this plan",
      });
    }

    plan.sales_persion_id = sales_persion_id;
    await plan.save();

    res.status(200).json({
      success: true,
      message: "Sales person updated successfully",
      data: plan,
    });
  } catch (error) {
    console.error("Error updating sales person:", error);
    res.status(500).json({ success: false, message: "Server Error"});
  }
};

// const planOfActionForaDay = async (req, res) => {
//   try {
//     const today = moment().format("YYYY-MM-DD");

//     // Include Customer and SalesPerson
//     const includeRelations = [
//       {
//         model: Customer,
//         as: "customer",
//         attributes: ["id", "company_name"],
//       },
//       {
//         model: User,
//         as: "salesPerson",
//         attributes: ["id", "fullname", "email"],
//       },
//     ];

//     const meetings = await PlanOfAction.findAll({
//       where: {
//         meeting_date: today,
//         sales_persion_id: {
//           [Op.ne]: null
//         }
//       },
//       include: includeRelations,
//     });

//     const grouped = {};

//     meetings.forEach(meeting => {
//       const sp = meeting.salesPerson;
//       if (sp) {
//         if (!grouped[sp.id]) {
//           grouped[sp.id] = {
//             id: sp.id,
//             fullname: sp.fullname,
//             email: sp.email,
//             total_meetings: 0,
//             meetings: []
//           };
//         }

//         grouped[sp.id].total_meetings++;

//         grouped[sp.id].meetings.push({
//           ...meeting.dataValues,
//         });
//       }
//     });

//     const result = Object.values(grouped);

//     return res.status(200).json({
//       success: true,
//       message: "Plan of Action for today",
//       data: result
//     });

//   } catch (error) {
//     console.error("Error fetching today's meeting details:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message
//     });
//   }
// };

const planOfActionForaDay = async (req, res) => {
  try {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const leads = await Lead.findAll({
      where: {
        [Op.or]: [
          { assign_date: { [Op.between]: [todayStart, todayEnd] } },
          { next_followup: { [Op.between]: [todayStart, todayEnd] } },
        ],
        assigned_person_id: { [Op.ne]: null },
      },
      attributes: [
        "id",
        "lead_source",
        "lead_status",
        "assign_date",
        "next_followup",
        "assigned_person_id",
        "createdAt",
      ],
      include: [
        {
          model: Customer,
          as: "customer",
        },
        {
          model: User,
          as: "leadOwner",
          attributes: ["fullname"],
        },
        {
          model: User,
          as: "assignedPerson",
          attributes: ["id", "fullname", "email"],
          include: [
            {
              model: EmployeeRole,
              as: "employeeRole",
              where: { role_id: 3 },
              attributes: [],
              required: true,
            },
          ],
        },
        {
          model: LeadAssignedHistory,
          as: "assignmentHistory",
          include: [
            {
              model: User,
              as: "assignedPerson",
              attributes: ["fullname"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Group leads under each salesperson with count
    const groupedLeads = {};

    leads.forEach((lead) => {
      const sp = lead.assignedPerson;
      if (sp) {
        if (!groupedLeads[sp.id]) {
          groupedLeads[sp.id] = {
            id: sp.id,
            fullname: sp.fullname,
            email: sp.email,
            total_meetings: 0,
            leads: [],
          };
        }

        groupedLeads[sp.id].total_meetings++;
        groupedLeads[sp.id].leads.push(lead);
      }
    });

    const result = Object.values(groupedLeads);

    res.status(200).json({
      success: true,
      message: "Salesperson-wise lead list retrieved successfully",
      data: result,
    });

  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving leads",
      error: error.message,
    });
  }
};




module.exports = {
    createPlan, getPlanOfActions, updateSalesPerson,planOfActionForaDay
  };