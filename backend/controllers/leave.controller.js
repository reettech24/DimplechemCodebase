// const { op } = require("sequelize");
const { Op } = require("sequelize");
const { LeaveData, Leave, User, LeaveDocument } = require("../models");

// GET API to fetch all leave data
const getAllLeaveData = async (req, res) => {
  try {
    const leaveData = await LeaveData.findAll();
    res.status(200).json({ success: true, data: leaveData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateMultipleLeaves = async (req, res) => {
  try {
    const updates = req.body.leaves;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data format" });
    }
    await Promise.all(
      updates.map(async (leave) => {
        const { id, ...updateFields } = leave;
        await LeaveData.update(updateFields, { where: { id } });
      })
    );

    res
      .status(200)
      .json({ success: true, message: "Leaves updated successfully" });
  } catch (error) {
    console.error("Error updating leave data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createLeave = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const {
      leave_type,
      from_date,
      to_date,
      reason,
      leave_duration,
      reason_unplanned_leave,
    } = req.body;

    const applied_date = req.body.applied_date || new Date();

    const newLeave = await Leave.create({
      employee_id,
      leave_type,
      applied_date,
      from_date,
      to_date,
      reason,
      leave_duration,
      reason_unplanned_leave,
    });
    if (req.files?.documents) {
      const documentRecords = req.files.documents.map((file) => ({
        leave_id: newLeave.id,
        documents: file.path.replace(/\\/g, "/"), // normalize path
      }));
      await LeaveDocument.bulkCreate(documentRecords);
    }

    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      data: newLeave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const { employee_id, status, search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    const whereClause = {};
    if (employee_id) whereClause.employee_id = employee_id;
    if (status) whereClause.status = status;
    // Add search filter (checks in Leave table and related User fields)
    if (search) {
      whereClause[Op.or] = [
        { leave_reason: { [Op.like]: `%${search}%` } }, // Example field
        // { status: { [Op.like]: `%${search}%` } },
        { "$employee.fullname$": { [Op.like]: `%${search}%` } },
        { "$employee.email$": { [Op.like]: `%${search}%` } },
        { "$approvedByUser.fullname$": { [Op.like]: `%${search}%` } },
        { "$approvedByUser.email$": { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Leave.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname", "email"],
        },
        {
          model: User,
          as: "approvedByUser",
          attributes: ["id", "fullname", "email"],
        },
        {
          model: LeaveDocument,
          as: "documents",
          attributes: ["id", "documents"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: rows,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approvedRejecteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }
    // Extract status from body and validate it
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved' or 'rejected'.",
      });
    }

    // Update only the allowed fields
    leave.status = status;
    leave.approved_by = req.user.id;

    await leave.save(); // This ensures changes are persisted

    res.json({
      success: true,
      message: `Leave ${status} successfully`,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname", "email"],
        },
        {
          model: User,
          as: "approvedByUser",
          attributes: ["id", "fullname", "email"],
        },
      ],
    });

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }
    // Check if status is not pending
    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Approved or rejected leaves cannot be deleted",
      });
    }

    await leave.destroy();
    res.json({ success: true, message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// const getMyLeaves = async (req, res) => {
//   try {
//     const { status, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     const whereClause = { employee_id: req.user.id };

//     if (status) {
//       whereClause.status = status; // Filter by approved/pending/rejected
//     }

//     const myLeaves = await Leave.findAll({
//       where: { employee_id: req.user.id },
//       order: [["createdAt", "DESC"]], // latest first
//     });

//     res.json({
//       success: true,
//       data: myLeaves,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const getMyLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    const whereClause = { employee_id: req.user.id };

    if (status) {
      whereClause.status = status; // e.g. "approved", "pending", "rejected"
    }

    const { rows, count } = await Leave.findAndCountAll({
      where: whereClause,
      include:[
         {
          model: LeaveDocument,
          as: "documents",
          attributes: ["id", "documents"],
        },
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname", "email"],
        },
      ],

      order: [["createdAt", "DESC"]], // latest first
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: rows,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllLeaveData,
  updateMultipleLeaves,
  createLeave,
  getAllLeaves,
  approvedRejecteLeave,
  getLeaveById,
  deleteLeave,
  getMyLeaves,
};
