
const { Op } = require("sequelize");
const { Role } = require("../models");

// ✅ List all roles
const listRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", all } = req.query;

    // Search filter
    const whereCondition = search
      ? { role_name: { [Op.like]: `%${search}%` } }
      : {};

    // Check if all roles should be fetched
    if (all === "true") {
      const roles = await Role.findAll({
        where: whereCondition,
        order: [["role_name", "DESC"]], // Sort by role name
      });
      return res.status(200).json({ success: true, data: roles });
    }

    // Convert page & limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    // Fetch paginated & filtered roles
    const { count, rows } = await Role.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      order: [["role_name", "DESC"]],
    });

    res.status(200).json({
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

  

// ✅ Add a new role
const addRole = async (req, res) => {
    try {
      const { role_name, role_description } = req.body;
      if (!role_name) {
        return res.status(400).json({ success: false, message: "Role name is required." });
      }
  
      // ✅ Check if role already exists
      const existingRole = await Role.findOne({ where: { role_name } });
      if (existingRole) {
        return res.status(400).json({ success: false, message: "Role already exists." });
      }
  
      // ✅ Create a new role if it doesn't exist
      const newRole = await Role.create({ role_name, role_description });
      res.status(201).json({ success: true, message: "Role added successfully", data: newRole });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// ✅ Update an existing role
const updateRole = async (req, res) => {
    try {
       console.log(req.params, req.body);
      const { id } = req.params;  // Get `id` from URL
      const { role_name, role_description } = req.body;
  
      if (!id) return res.status(400).json({ success: false, message: "Role ID is required." });
  
      const role = await Role.findByPk(id);
      if (!role) return res.status(404).json({ success: false, message: "Role not found." });
  
      await role.update({ role_name, role_description });
      res.status(200).json({ success: true, message: "Role updated successfully", data: role });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// ✅ Remove a role
const removeRole = async (req, res) => {
    try {
      const { id } = req.params;  // Get `id` from URL
  
      if (!id) return res.status(400).json({ success: false, message: "Role ID is required." });
  
      const role = await Role.findByPk(id);
      if (!role) return res.status(404).json({ success: false, message: "Role not found." });
  
      await role.destroy();
      res.status(200).json({ success: true, message: "Role removed successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

module.exports = { listRoles, addRole, updateRole, removeRole };
