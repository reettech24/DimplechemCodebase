const { Op, Sequelize, fn, col } = require("sequelize");
const { LeadAssignedHistory, Lead, User } = require("../models");

const createLeadAssignedHistory = async (req, res) => {
  try {
    const { lead_ids, new_assigned_person_id } = req.body;

    // Validate inputs
    if (
      !Array.isArray(lead_ids) ||
      lead_ids.length === 0 ||
      !new_assigned_person_id
    ) {
      return res.status(400).json({
        success: false,
        message: "lead_ids (array) and new_assigned_person_id are required",
      });
    }

    // Check if the user exists
    const userExists = await User.findByPk(new_assigned_person_id);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Assigned person (user) not found",
      });
    }

    const createdHistories = [];

    for (const lead_id of lead_ids) {
      // Check if each lead exists
      const leadExists = await Lead.findByPk(lead_id);
      if (!leadExists) continue;

      const newEntry = await LeadAssignedHistory.create({
        lead_id,
        new_assigned_person_id,
      });

      await Lead.update(
        { assigned_person_id: new_assigned_person_id },
        { where: { id: lead_id}}
      );

      createdHistories.push(newEntry);
    }

    return res.json({
      success: true,
      message: `lead assigned successfully`,
      data: createdHistories,
    });
  } catch (err) {
    console.error("Error creating lead assignment history:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createLeadAssignedHistory,
};
