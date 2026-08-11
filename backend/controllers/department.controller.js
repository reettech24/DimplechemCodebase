const { Op } = require("sequelize");
const { Department } = require("../models");

// ✅ List all departments
// const listDepartments = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, search = "" } = req.query;
        
//         const pageNumber = parseInt(page, 10);
//         const pageSize = parseInt(limit, 10);
//         const offset = (pageNumber - 1) * pageSize;
        
//         const whereCondition = search
//             ? { department_name: { [Op.like]: `%${search}%` } }
//             : {};

//         const { count, rows } = await Department.findAndCountAll({
//             where: whereCondition,
//             limit: pageSize,
//             offset,
//             order: [["department_name", "ASC"]],
//         });

//         res.status(200).json({
//             success: true,
//             data: rows,
//             currentPage: pageNumber,
//             totalPages: Math.ceil(count / pageSize),
//             totalItems: count,
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


const listDepartments = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", all } = req.query;
  
      // Convert page & limit to integers
      const pageNumber = parseInt(page, 10) || 1;
      const pageSize = parseInt(limit, 10) || 10;
      const offset = (pageNumber - 1) * pageSize;
  
      // Search filter (checks `department_name`)
      const whereCondition = search
        ? {
            [Op.or]: [{ department_name: { [Op.like]: `%${search}%` } }],
          }
        : {};
  
      // Common query options
      const queryOptions = {
        where: whereCondition,
        order: [["department_name", "DESC"]], // Sorting by department name
        attributes: { exclude: [] }, // Fetch all fields
      };
  
      // Fetch all departments if 'all' is set to true
      if (all === "true") {
        const departments = await Department.findAll(queryOptions);
        return res.status(200).json({ success: true, data: departments });
      }
  
      // Fetch paginated & filtered departments
      const { count, rows } = await Department.findAndCountAll({
        ...queryOptions,
        limit: pageSize,
        offset,
      });
  
      res.status(200).json({
        success: true,
        data: rows,
        currentPage: pageNumber,
        totalPages: Math.ceil(count / pageSize),
        totalItems: count,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
  

// ✅ Add a new department
const addDepartment = async (req, res) => {
    try {
        const { department_name, department_description,status } = req.body;
        if (!department_name) {
            return res.status(400).json({ success: false, message: "Department name is required." });
        }

        const existingDepartment = await Department.findOne({ where: { department_name } });
        if (existingDepartment) {
            return res.status(400).json({ success: false, message: "Department already exists." });
        }

        const newDepartment = await Department.create({ department_name, department_description,status });
        res.status(201).json({ success: true, message: "Department added successfully", data: newDepartment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update an existing department
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { department_name, department_description , status} = req.body;

        if (!id) return res.status(400).json({ success: false, message: "Department ID is required." });

        const department = await Department.findByPk(id);
        if (!department) return res.status(404).json({ success: false, message: "Department not found." });

        await department.update({ department_name, department_description,status });
        res.status(200).json({ success: true, message: "Department updated successfully", data: department });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Remove a department
const removeDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ success: false, message: "Department ID is required." });

        const department = await Department.findByPk(id);
        if (!department) return res.status(404).json({ success: false, message: "Department not found." });

        await department.destroy();
        res.status(200).json({ success: true, message: "Department removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { listDepartments, addDepartment, updateDepartment, removeDepartment };
