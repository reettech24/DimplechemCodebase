const { MarketingMaster, User } = require("../models");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");

const createMarketing = async (req, res) => {
  try {
    const {
      activity_planned,
      activity_date,
      complete_date,
      total_spent,
      lead_generated,
      assigned_to,
    } = req.body;

    const newRecord = await MarketingMaster.create({
      activity_planned,
      activity_date,
      complete_date,
      total_spent,
      lead_generated,
      assigned_to,
    });

    res.status(201).json({
      success: true,
      message: "Marketing activity added Sucessfully.",
      data: newRecord,
    });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create marketing activity.",
    });
  }
};

const getAllMarketing = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (page - 1) * limit;

    // Dynamic search filter (case-insensitive for text columns)
    const searchFilter = search
      ? {
          [Op.or]: [
            { activity_planned: { [Op.like]: `%${search}%` } },
            { lead_generated: { [Op.like]: `%${search}%` } },
            { "$assignedUser.fullname$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {};
      
    const userInclude = {
      model: User,
      as: "assignedUser",
      attributes: ["id", "fullname", "email"],
    };

    // Get total count (must include relation for $ syntax to work)
    const totalCount = await MarketingMaster.count({
      where: searchFilter,
      include: [userInclude],
      distinct: true, // prevents overcount from join duplicates
    });

    // Get total count for pagination
    // const totalCount = await MarketingMaster.count({ where: searchFilter });

    // Fetch paginated results
    const records = await MarketingMaster.findAll({
      where: searchFilter,
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ["id", "fullname", "email"],
        },
      ],
      order: [["activity_date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Fetch All Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch marketing activities.",
    });
  }
};

const getMarketingById = async (req, res) => {
  try {
    const record = await MarketingMaster.findByPk(req.params.id, {
      include: {
        model: User,
        as: "assignedUser",
        attributes: ["id", "fullname", "email"],
      },
    });

    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found." });

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error("Fetch One Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch record." });
  }
};

const updateMarketing = async (req, res) => {
  try {
    const updated = await MarketingMaster.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0] === 0)
      return res.status(404).json({
        success: false,
        message: "Record not found or no changes made.",
      });

    const updatedRecord = await MarketingMaster.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      message: "Marketing activity Updated Sucessfully.",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update record." });
  }
};

const deleteMarketing = async (req, res) => {
  try {
    const deleted = await MarketingMaster.destroy({
      where: { id: req.params.id },
    });

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Record not found." });

    res
      .status(200)
      .json({ success: true, message: "Record deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete record." });
  }
};

const exportMarketingToExcel = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const whereCondition = search
      ? {
          [Op.or]: [
            { activity_planned: { [Op.like]: `%${search}%` } },
            { lead_generated: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const records = await MarketingMaster.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ["fullname"],
        },
      ],
      order: [["activity_date", "DESC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Marketing Activities");

    // Header Columns
    worksheet.columns = [
      { header: "Id", key: "id", width: 15 },
      { header: "Activity Planned", key: "activity_planned", width: 30 },
      { header: "Activity Date", key: "activity_date", width: 20 },
      { header: "Completion Date", key: "complete_date", width: 20 },
      { header: "Total Spent", key: "total_spent", width: 15 },
      { header: "Lead Generated", key: "lead_generated", width: 20 },
      { header: "Assigned To", key: "assigned_to", width: 25 },
    ];

    // Row Data
    records.forEach((item) => {
      worksheet.addRow({
        id: item.code || item.id, // adjust if `code` like MKT001 exists
        activity_planned: item.activity_planned,
        activity_date: item.activity_date,
        complete_date: item.complete_date,
        total_spent: item.total_spent,
        lead_generated: item.lead_generated,
        assigned_to: item.assignedUser?.fullname || "-",
      });
    });

    // File Naming and Saving
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];

    const filePath = path.join(
      __dirname,
      `../exports/Marketing_Report_${timestamp}.xlsx`
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await workbook.xlsx.writeFile(filePath);

    return res.download(filePath, "Marketing_Report.xlsx", (err) => {
      if (err) {
        console.error("Download error:", err);
        return res
          .status(500)
          .json({ success: false, message: "File download failed." });
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("File deletion error:", unlinkErr);
        } else {
          console.log("Marketing report deleted:", filePath);
        }
      });
    });
  } catch (error) {
    console.error("Export Marketing Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to export marketing data." });
  }
};

module.exports = {
  createMarketing,
  getAllMarketing,
  getMarketingById,
  updateMarketing,
  deleteMarketing,
  exportMarketingToExcel,
};
