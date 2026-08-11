const bcrypt = require("bcryptjs");
const { Op, fn, col, literal } = require("sequelize");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");
const frontendUrl = process.env.FRONTEND_URL;
const backendUrl = process.env.BACKEND_URL;

const {
  User,
  EmployeeRole,
  Role,
  Department,
  JobDetail,
  BankDetail,
  Document,
  SecureDocument,
  sequelize,
  Customer,
} = require("../models");
const { generateToken } = require("../config/jwt");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: EmployeeRole,
          as: "employeeRole",
          attributes: ["role_id"], // Only fetch role_id
        },
      ],
    });
    if (!user) {
      return res.json({ success: false, message: "Invalid username." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({ success: true, message: "Login successful", token, user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//userList
exports.listEmployees = async (req, res) => {
  try {
    console.log("req.query", req.query);
    const { page = 1, limit = 6, search = "", all, roleId } = req.query;

    // Convert page & limit to integers
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * pageSize;

    // Search filter (checks `fullname`, `email`, and `phone`)
    const whereCondition = search
      ? {
          [Op.or]: [
            { '$User.fullname$': { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
            {status: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // 🔹 Apply role filter dynamically
    if (roleId) {
      whereCondition["$employeeRole.role_id$"] = roleId;
    }

    // Common query options
    const queryOptions = {
      where: whereCondition,
      order: [["id", "DESC"]], // Sorting by ID (latest first)
      include: [
        {
          model: EmployeeRole,
          as: "employeeRole",
          include: [{ model: Role, as: "role", attributes: ["role_name"] }],
        },
        {
          model: JobDetail,
          as: "jobDetail",
          include: [
            // {
            //   model: Department,
            //   as: "department",
            //   attributes: ["department_name"],
            // },
            {
              model: User, // Fetch reporting manager
              as: "reportingManager",
              attributes: ["id", "fullname"], // Only fetch name & ID
            },
          ],
        },
        {
          model: Document,
          as: "documents",
          attributes: ["id", "documents"], 
        }
        // {
        //   model: BankDetail, // Fetch bank details
        //   as: "bankDetail",
        //   attributes: ["bank_name", "account_number", "ifsc_code", "branch_name", "account_type"], // Select necessary fields
        // },
      ],
      //attributes: ["id", "fullname", "email", "phone", "status", "emp_id"], // Select necessary fields
      attributes: { exclude: [] }, // Fetch all fields
    };

    // Fetch all employees if 'all' is set to true
    if (all === "true") {
      const users = await User.findAll(queryOptions);
      return res.status(200).json({ success: true, data: users });
    }

    // Fetch paginated & filtered employees
    const { count, rows } = await User.findAndCountAll({
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

exports.addEmployee = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      emergency_contact,
      date_of_birth,
      //gender,
      fullname,
      address,
      //status,
      role_id,
      //department_id,
      //job_title,
      employment_type,
      date_of_joining,
      //currently_working,
      //salary,
      work_location,
      reporting_manager_id,
      //offer_letter_date,
      //date_of_exit,
      // bank_name,
      // account_number,
      // ifsc_code,
      // branch_name,
      // account_type,
      aadhar_no,
      pan_no,
      // remarks,
      // digital_signature,
    } = req.body;

    // const profile_image = req.files?.profile_image?.[0]?.path
    //   ? req.files.profile_image[0].path.replace(/\\/g, "/")
    //   : null;

    // ✅ Insert user with related tables in one query
    const user = await User.create(
      {
        username,
        email,
        password: await bcrypt.hash(password, 10),
        phone,
        emergency_contact,
        date_of_birth,
        //gender,
        //profile_image,
        fullname,
        address,
        //status,
        aadhar_no,
        pan_no,
        //remarks,
        //digital_signature,
        employeeRole: { role_id }, // Relation
        jobDetail: {
          //department_id,
          //job_title,
          employment_type,
          date_of_joining,
          //currently_working,
          //salary,
          work_location,
          reporting_manager_id,
          //offer_letter_date,
          // date_of_exit,
        }, // Relation
        // bankDetail: {
        //   bank_name,
        //   account_number,
        //   ifsc_code,
        //   branch_name,
        //   account_type,
        // }, // Relation
      },
      {
        include: [
          { model: EmployeeRole, as: "employeeRole" }, // ✅ Use correct alias
          { model: JobDetail, as: "jobDetail" }, // ✅ Use correct alias
          //{ model: BankDetail, as: "bankDetail" }, // ✅ Use correct alias
        ],
      }
    );

    // ✅ Bulk insert documents separately if uploaded
    if (req.files?.documents) {
      const documentRecords = req.files.documents.map((file) => ({
        employee_id: user.id,
        documents: file.path.replace(/\\/g, "/"),
      }));
      await Document.bulkCreate(documentRecords);
    }

    return res
      .status(201)
      .json({ success: true, message: "Employee added successfully", user });
  } catch (error) {
    // ✅ Check if the error is a Sequelize Validation Error
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        status: "error",
        message: "Validation Error",
        errors: validationErrors,
      });
    }

    // ✅ Handle Unique Constraint Error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: "error",
        message: "Duplicate entry detected",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    //console.log("req.body", req.body);
    const { id } = req.params; // Employee ID to update

    const {
      //username,
      email,
      phone,
      emergency_contact,
      date_of_birth,
      //gender,
      fullname,
      address,
      //status,
      role_id,
      //department_id,
      //job_title,
      employment_type,
      date_of_joining,
      //currently_working,
      //salary,
      work_location,
      reporting_manager_id,
      //offer_letter_date,
      date_of_exit,
      // bank_name,
      // account_number,
      // ifsc_code,
      // branch_name,
      // account_type,
      aadhar_no,
      pan_no,
      // remarks,
      // digital_signature,
    } = req.body;

    // const profile_image = req.files?.profile_image?.[0]?.path
    //   ? req.files.profile_image[0].path.replace(/\\/g, "/")
    //   : null;

    // Check if user exists
    const user = await User.findByPk(id, {
      include: [
        { model: EmployeeRole, as: "employeeRole" },
        { model: JobDetail, as: "jobDetail" },
        //{ model: BankDetail, as: "bankDetail" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update user details
    await user.update({
      //username,
      email,
      phone,
      emergency_contact,
      date_of_birth,
      //gender,
      fullname,
      address,
      //status,
      aadhar_no,
      pan_no,
      //remarks,
      //digital_signature,
      //profile_image: profile_image || user.profile_image,
    });

    // Update related tables
    if (role_id) await user.employeeRole.update({ role_id });
    if (employment_type) {
      await user.jobDetail.update({
        //department_id,
        //job_title,
        employment_type,
        date_of_joining,
        //currently_working,
        //salary,
        work_location,
        reporting_manager_id,
        //offer_letter_date,
        date_of_exit,
      });
    }
    // if (bank_name || account_number || ifsc_code) {
    //   await user.bankDetail.update({
    //     bank_name,
    //     account_number,
    //     ifsc_code,
    //     branch_name,
    //     account_type,
    //   });
    // }

    // Update documents if uploaded
    if (req.files?.documents) {
      await Document.destroy({ where: { employee_id: id } }); // Delete old records
      const documentRecords = req.files.documents.map((file) => ({
        employee_id: id,
        documents: file.path.replace(/\\/g, "/"),
      }));
      await Document.bulkCreate(documentRecords);
    }

    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully", user });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required." });
    }

    // ✅ Check if the employee exists
    const employee = await User.findByPk(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found." });
    }

    // ✅ Delete related data only if it exists
    await Promise.all([
      Document.destroy({ where: { employee_id: id } }),
      BankDetail.destroy({ where: { employee_id: id } }),
      EmployeeRole.destroy({ where: { employee_id: id } }),
      JobDetail.destroy({ where: { employee_id: id } }),
    ]);

    // ✅ Handle JobDetail separately to prevent foreign key constraint issues
    await JobDetail.update(
      { reporting_manager_id: null },
      { where: { reporting_manager_id: id } }
    );

    // ✅ Finally, delete the Employee record
    await employee.destroy();

    return res.status(200).json({
      success: true,
      message: "Employee and related data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    // The user is already attached to `req.user` via authentication middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch user details (excluding password)
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: EmployeeRole,
          as: "employeeRole",
          attributes: ["role_id"], // only fetch role_id
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { month, year } = req.query;

    let whereCondition = {};

    if (year) {
      whereCondition["$jobDetail.date_of_joining$"] = {
        [Op.gte]: new Date(year, 0, 1),
        [Op.lte]: new Date(year, 11, 31),
      };
    }

    if (month && year) {
      whereCondition["$jobDetail.date_of_joining$"] = {
        [Op.gte]: new Date(year, month - 1, 1),
        [Op.lte]: new Date(year, month, 0),
      };
    }

    const employees = await User.findAll({
      where: whereCondition,
      include: [
        { model: EmployeeRole, as: "employeeRole" },
        { model: JobDetail, as: "jobDetail" },
        //{ model: BankDetail, as: "bankDetail" },
        { model: Document, as: "documents", attributes: ["id", "documents"] },
      ],
    });

    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportEmployeesToExcel = async (req, res) => {
  try {
    const { month, year } = req.query;

    let whereCondition = {};

    if (year) {
      whereCondition["$jobDetail.date_of_joining$"] = {
        [Op.gte]: new Date(year, 0, 1),
        [Op.lte]: new Date(year, 11, 31),
      };
    }

    if (month && year) {
      whereCondition["$jobDetail.date_of_joining$"] = {
        [Op.gte]: new Date(year, month - 1, 1),
        [Op.lte]: new Date(year, month, 0),
      };
    }

    const employees = await User.findAll({
      where: whereCondition,
      include: [
        { model: EmployeeRole, as: "employeeRole" },
        { model: JobDetail, as: "jobDetail" },
        { model: BankDetail, as: "bankDetail" },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees Report");

    worksheet.columns = [
      { header: "Employee ID", key: "emp_id", width: 15 },
      { header: "Full Name", key: "fullname", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Status", key: "status", width: 10 },
      { header: "Joining Date", key: "date_of_joining", width: 20 },
    ];

    employees.forEach((emp) => {
      worksheet.addRow({
        emp_id: emp.emp_id,
        fullname: emp.fullname,
        email: emp.email,
        phone: emp.phone,
        status: emp.status,
        date_of_joining: emp.jobDetail?.date_of_joining ?? null,
      });
    });

    // const filePath = path.join(__dirname, ../exports/Employees_Report.xlsx);
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      __dirname,
      `../exports/Employees_Report_${timestamp}.xlsx`
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, "Employees_Report.xlsx");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDepartmentWise = async (req, res) => {
  try {
    const { department_id, search = "" } = req.query;

    let whereCondition = {};

    if (department_id) {
      whereCondition.department_id = department_id;
    }

    let searchCondition = {};
    if (search) {
      searchCondition[Op.or] = [
        { "$employee.fullname$": { [Op.like]: `%${search}%` } },
        { "$employee.email$": { [Op.like]: `%${search}%` } },
        { "$employee.phone$": { [Op.like]: `%${search}%` } },
      ];
    }

    const employees = await JobDetail.findAll({
      where: { ...whereCondition, ...searchCondition },
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["fullname", "email", "phone"],
        },
        {
          model: Department,
          as: "department",
          attributes: ["department_name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportEmployeesDepartment = async (req, res) => {
  try {
    const { department_id } = req.query;

    let whereCondition = {};
    if (department_id) {
      whereCondition.department_id = department_id;
    }

    const employees = await JobDetail.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["fullname", "email", "phone"],
          include: [
            // { model: EmployeeRole, as: "employeeRole", attributes: ["role_name"] }, // ✅ Fix Role linking
          ],
        },
        {
          model: Department,
          as: "department",
          attributes: ["department_name"],
        },
        // { model: BankDetail, as: "bankDetail" },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees Report");

    worksheet.columns = [
      { header: "Employee Name", key: "fullname", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Department", key: "department", width: 20 },
      // { header: "Role", key: "role", width: 20 },
      { header: "Job Title", key: "job_title", width: 20 },
      { header: "Employment Type", key: "employment_type", width: 20 },
      { header: "Joining Date", key: "date_of_joining", width: 20 },
    ];

    employees.forEach((emp) => {
      worksheet.addRow({
        fullname: emp.employee?.fullname ?? null,
        email: emp.employee?.email ?? null,
        phone: emp.employee?.phone ?? null,
        department: emp.department?.department_name ?? null,
        // role: emp.employee?.employeeRole?.role_name ?? null,
        job_title: emp.job_title,
        employment_type: emp.employment_type,
        date_of_joining: emp.date_of_joining,
      });
    });
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      __dirname,
      `../exports/Employees_Report_${timestamp}.xlsx`
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, `Employees_Report_${timestamp}.xlsx`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEmployeesLocation = async (req, res) => {
  try {
    const { search } = req.query;

    let userWhereCondition = {};
    let jobDetailWhereCondition = {};

    // 🔍 Apply search filter (optional)
    if (search) {
      userWhereCondition = {
        [Op.or]: [
          { fullname: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // 📍 Apply location filter only if provided
    // if (location) {
    //   jobDetailWhereCondition.work_location = { [Op.like]: `%${location}%` };
    // }

    const employees = await User.findAll({
      where: userWhereCondition, // Apply search filter
      include: [
        {
          model: JobDetail,
          as: "jobDetail",
          where: search ? jobDetailWhereCondition : undefined, // Apply only if location is given
          //required: !!location, // If location is provided, it must match
        },
        {
          model: EmployeeRole,
          as: "employeeRole",
          required: false,
        },
        {
          model: BankDetail,
          as: "bankDetail",
          required: false,
        },
        {
          model: Document,
          as: "documents",
          required: false,
        },
      ],
    });

    return res.status(200).json({ employees });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.exportEmployeesLocation = async (req, res) => {
  try {
    const { search } = req.query;

    // Validate location filter
    let whereCondition = {};
    if (search) {
      whereCondition["$jobDetail.work_location$"] = {
        [Op.like]: `%${search}%`,
      };
    }

    // Fetch employees
    const employees = await User.findAll({
      where: whereCondition,
      include: [
        { model: EmployeeRole, as: "employeeRole" },
        { model: JobDetail, as: "jobDetail" },
        { model: BankDetail, as: "bankDetail" },
      ],
    });

    if (!employees.length) {
      return res
        .status(404)
        .json({ message: "No employees found for this location" });
    }

    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees Location Report");

    // Define Excel Columns
    worksheet.columns = [
      { header: "Employee ID", key: "emp_id", width: 15 },
      { header: "Full Name", key: "fullname", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Work Location", key: "work_location", width: 20 },
      //{ header: "Department", key: "department", width: 20 },
      { header: "Joining Date", key: "date_of_joining", width: 20 },
    ];

    // Insert Data Rows
    employees.forEach((emp) => {
      worksheet.addRow({
        emp_id: emp.emp_id,
        fullname: emp.fullname,
        email: emp.email,
        phone: emp.phone,
        work_location: emp.jobDetail?.work_location ?? null,
        //department: emp.jobDetail?.department_id ?? null,
        date_of_joining: emp.jobDetail?.date_of_joining ?? null,
      });
    });

    const exportDir = path.join(__dirname, "../exports");

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const fileName = `Employees_Location_Report_${timestamp}.xlsx`;
    const filePath = path.join(exportDir, fileName);

    // Remove existing file if already exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Save Excel file
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportEmployeesListToExcel = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", roleId, all } = req.query;

    // Convert page & limit to integers
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * pageSize;

    // Search filter (checks fullname, email, and phone)
    const whereCondition = search
      ? {
          [Op.or]: [
            { fullname: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // 🔹 Apply role filter dynamically
    if (roleId) {
      whereCondition["$employeeRole.role_id$"] = roleId;
    }

    // Common query options
    const queryOptions = {
      where: whereCondition,
      include: [
        {
          model: EmployeeRole,
          as: "employeeRole",
          include: [{ model: Role, as: "role", attributes: ["role_name"] }],
        },
        {
          model: JobDetail,
          as: "jobDetail",
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["department_name"],
            },
            {
              model: User, // Fetch reporting manager
              as: "reportingManager",
              attributes: ["id", "fullname"], // Only fetch name & ID
            },
          ],
        },
        {
          model: BankDetail, // Fetch bank details
          as: "bankDetail",
          attributes: [
            "bank_name",
            "account_number",
            "ifsc_code",
            "branch_name",
            "account_type",
          ], // Select necessary fields
        },
      ],
      attributes: { exclude: [] }, // Fetch all fields
      order: [["createdAt", "DESC"]],
    };

    // Fetch all employees if 'all' is set to true
    const employees =
      all === "true"
        ? await User.findAll(queryOptions)
        : await User.findAll({
            ...queryOptions,
            limit: pageSize,
            offset,
          });

    // Initialize Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees Data Report");

    // Dynamically create columns based on employee data
    worksheet.columns = [
      { header: "Employee ID", key: "emp_id", width: 15 },
      { header: "Full Name", key: "fullname", width: 25 },
      { header: "Date of Birth", key: "date_of_birth", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Status", key: "status", width: 10 },
      { header: "Date of Joining", key: "date_of_joining", width: 20 },
      { header: "Role", key: "role", width: 20 },
      // { header: "Department", key: "department", width: 20 },
      { header: "Aadhar No", key: "aadhar_no", width: 20 },
      { header: "PanCard No", key: "pan_no", width: 20 },
      { header: "Reporting Manager", key: "reporting_manager", width: 20 },
      // { header: "Bank Name", key: "bank_name", width: 20 },
      // { header: "Account Number", key: "account_number", width: 20 },
      // { header: "IFSC Code", key: "ifsc_code", width: 15 },
      { header: "Address", key: "address", width: 15 },
      // Add more columns as needed
    ];

    // Add rows for each employee
    employees.forEach((emp) => {
      worksheet.addRow({
        emp_id: emp.emp_id,
        date_of_birth: emp.date_of_birth,
        fullname: emp.fullname,
        email: emp.email,
        phone: emp.phone,
        status: emp.status,
        date_of_joining: emp.jobDetail?.date_of_joining ?? null,
        role: emp.employeeRole?.role?.role_name ?? null,
        aadhar_no: emp.aadhar_no,
        pan_no: emp.pan_no,
        // department: emp.jobDetail?.department?.department_name ?? null,
        reporting_manager: emp.jobDetail?.reportingManager?.fullname ?? null,
        // bank_name: emp.bankDetail?.bank_name ?? null,
        // account_number: emp.bankDetail?.account_number ?? null,
        // ifsc_code: emp.bankDetail?.ifsc_code ?? null,
        address: emp.address,
      });
    });

    // Generate file path with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      __dirname,
      `../exports/Employees_List_Report_${timestamp}.xlsx`
    );

    // Delete existing file if present
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Write workbook to file
    await workbook.xlsx.writeFile(filePath);

    // Send the file for download
    res.download(filePath, `Employees_List_Report_${timestamp}.xlsx`, (err) => {
      if (err) {
        console.error("Download error:", err);
        return;
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("File delete error:", unlinkErr);
        } else {
          console.log("File deleted:", filePath);
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//upload documnet with password protected
// exports.uploadSecureDoc = async (req, res) => {
//   //console.log("req.files", req.files);
//   const file = req.files['file'][0];
//   const randomPassword = Math.random().toString(36).slice(2, 10);
//   const zip = new AdmZip();
//   const filePath = path.join(__dirname, "..", req.file.path);

//   zip.addLocalFile(filePath, "", req.file.originalname);
//   const zipPath = path.join(__dirname, "..", "secure", `${uuidv4()}.zip`);
//   zip.writeZip(zipPath);
//   fs.unlinkSync(filePath);

//   const passwordHash = await bcrypt.hash(randomPassword, 10);
//   const token = uuidv4();

//   await SecureDocument.create({
//     filename: req.file.originalname,
//     zipPath,
//     passwordHash,
//     token,
//   });

//   res.json({
//     downloadLink: `http://localhost:5173/auth/secure-view/${token}`,
//     password: randomPassword,
//   });
// }

exports.uploadSecureDoc1 = async (req, res) => {
  try {
    const file = req.files?.["file"]?.[0] || null;
    const { to_email, subject, body } = req.body;
    const emp_id = req.user.id;

    if (!emp_id) {
      return res.status(403).json({ error: "Employee ID not found in token." });
    }

    // Find customer by email
    const customer = await Customer.findOne({
      where: { email_id: to_email },
    });
    const cust_id = customer ? customer.id : null;

    const token = uuidv4();
    const randomPassword = Math.random().toString(36).slice(2, 10);
    const passwordHash = await bcrypt.hash(randomPassword, 10);
    let zipPath = null;
    let filename = null;
    let downloadLink = "";

    if (file) {
      const zip = new AdmZip();
      const filePath = path.join(__dirname, "..", file.path);
      zip.addLocalFile(filePath, "", file.originalname);

      const generatedZipPath = path.join(
        __dirname,
        "..",
        "secure",
        `${uuidv4()}.zip`
      );
      zip.writeZip(generatedZipPath);
      fs.unlinkSync(filePath); // delete original uploaded file

      zipPath = generatedZipPath;
      filename = file.originalname;

      // Only generate download link if file is uploaded
      downloadLink = `${frontendUrl}/secure-view/${token}`;
    }

    await SecureDocument.create({
      filename,
      zipPath,
      passwordHash,
      token,
      emp_id,
      to_email,
      subject,
      body,
      cust_id,
      downloadLink,
    });

    res.json({
      downloadLink, // Will be empty string if no file uploaded
      password: file ? randomPassword : null, // Only show password if file uploaded
    });
  } catch (err) {
    console.error("Upload secure doc error:", err);
    res.status(500).json({ error: "Failed to process document" });
  }
};

exports.uploadSecureDoc = async (req, res) => {
  try {
    const file = req.files?.["file"]?.[0] || null;
    const { to_email, subject, body } = req.body;
    const emp_id = req.user.id;

    if (!emp_id) {
      return res.status(403).json({ error: "Employee ID not found in token." });
    }

    // Find customer by email
    const customer = await Customer.findOne({
      where: { email_id: to_email },
    });
    const cust_id = customer ? customer.id : null;

    const token = uuidv4();
    const randomPassword = Math.random().toString(36).slice(2, 10);
    const passwordHash = await bcrypt.hash(randomPassword, 10);
    let zipPath = null;
    let filename = null;
    let downloadLink = "";

    if (file) {
      const zip = new AdmZip();
      const filePath = path.join(__dirname, "..", file.path);
      zip.addLocalFile(filePath, "", file.originalname);

      const generatedZipPath = path.join(
        __dirname,
        "..",
        "secure",
        `${uuidv4()}`.zip
      );
      zip.writeZip(generatedZipPath);
      fs.unlinkSync(filePath); // delete original uploaded file

      zipPath = generatedZipPath;
      filename = file.originalname;

      // Only generate download link if file is uploaded
      downloadLink = `${frontendUrl}/secure-view/${token}`;
    }

    await SecureDocument.create({
      filename,
      zipPath,
      passwordHash,
      token,
      emp_id,
      to_email,
      subject,
      body,
      cust_id,
      downloadLink,
    });

    res.json({
      downloadLink, // Will be empty string if no file uploaded
      password: file ? randomPassword : null, // Only show password if file uploaded
    });
  } catch (err) {
    console.error("Upload secure doc error:", err);
    res.status(500).json({ error: "Failed to process document" });
  }
};

exports.verifySecureDocument = async (req, res) => {
  const { token, password } = req.body;

  try {
    const doc = await SecureDocument.findOne({ where: { token } });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    const isValid = await bcrypt.compare(password, doc.passwordHash);

    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // get just the filename from full path
    const fileName = path.basename(doc.zipPath);

    // send file path or download URL if password is valid
    return res.status(200).json({
      success: true,
      filename: doc.filename,
      // downloadUrl: `http://localhost:5000/api/auth/${doc.zipPath.replace(/\\/g, "/")}`
      downloadUrl: `${backendUrl}/api/auth/secure/${fileName}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.downloadSecureDoc = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "secure", req.params.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // Trigger file download
    return res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to download file" });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//Not used
exports.getSecureDocument1 = async (req, res) => {
  try {
    const secureDoc = await SecureDocument.findAll({
      attributes: ["filename", "downloadLink", "to_email", "subject", "body"],
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname", "email"],
        },
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "company_name", "email_id"],
        },
      ],
    });

    if (!secureDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Secure document not found" });
    }
    return res.status(200).json({
      success: true,
      data: secureDoc,
    });
  } catch (error) {
    console.error("Error fetching secure document:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getSecureDocument = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Search filter for SecureDocument + related models
    const searchFilter = search
      ? {
          [Op.or]: [
            { filename: { [Op.like]: `%${search}%` } },
            { to_email: { [Op.like]: `%${search}%` } },
            { subject: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Get total count (manually with raw query or estimate via group count)
    const totalCount = await SecureDocument.count({
      where: searchFilter,
      distinct: true,
      col: "cust_id",
    });
    const secureDoc = await SecureDocument.findAll({
      attributes: [
        "cust_id",
        [fn("COUNT", col("to_email")), "email_count"],
        [fn("COUNT", col("filename")), "document_count"],
        [literal("GROUP_CONCAT(filename SEPARATOR ',')"), "filenames"],
      ],
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "company_name", "email_id"],
        },
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname", "email"],
        },
      ],
      group: [
        "cust_id",
        "customer.id",
        "customer.company_name",
        "customer.email_id",
        "employee.id",
        "employee.fullname",
        "employee.email",
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      subQuery: false,
    });
    secureDoc.forEach(doc => {
  if (doc.dataValues.filenames) {
    doc.dataValues.filenames = doc.dataValues.filenames
      .split(',')
      .map(f => f.trim());
  }
  });

    if (!secureDoc || secureDoc.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Secure document not found" });
    }

    return res.status(200).json({
      success: true,
      data: secureDoc,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching secure document:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
