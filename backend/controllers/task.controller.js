const { Op, Sequelize, fn, col, literal } = require("sequelize");
const { TaskSchedule, User } = require("../models");

// Create task
const createTask = async (req, res) => {
  try {
    const { task_title, description, assigned_to, due_date, status } = req.body;

    const task = await TaskSchedule.create({
      task_title,
      description,
      assigned_to,
      due_date,
      status,
    });

    res.status(201).json({ success: true, message: "Task created", task });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: err.message,
    });
  }
};

// List all tasks
const listTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", orderBy = "due_date", order = "DESC", all } = req.query;
    const userId = req.user?.id;
    const userRole = req.user?.userrole;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    // Base where condition
    let whereCondition = {};

    // If user is not an admin (role 1) and all is not passed — restrict to their own tasks
    if (userRole !== 1 && all !== "true") {
      whereCondition.assigned_to = userId;
    }

    // If search query is provided — add search filters
    if (search) {
      whereCondition[Op.or] = [
        { task_title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        Sequelize.where(
          Sequelize.col("assignedUser.fullname"),
          { [Op.like]: `%${search}%` }
        ),
      ];
    }

    const { count, rows } = await TaskSchedule.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ["id", "fullname"],
        },
      ],
      order: [[orderBy, order]], // Sort dynamically by query param
      distinct: true,
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
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// const listTasks = async (req, res) => {
//   try {
//     const tasks = await TaskSchedule.findAll({
//       order: [["due_date", "DESC"]],
//       include: [
//         {
//           model: User,
//           as: "assignedUser",
//           attributes: ["id", "fullname"], // Only fetch relevant fields
//         },
//       ],
//     });
//     res.status(200).json({ success: true, tasks });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching tasks",
//       error: err.message,
//     });
//   }
// };

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedData = req.body;

    const task = await TaskSchedule.findByPk(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    await task.update(updatedData);
    res.status(200).json({ success: true, message: "Task updated", task });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await TaskSchedule.findByPk(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    await task.destroy();
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await TaskSchedule.findByPk(taskId, {
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ["id", "fullname"],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving task",
      error: error.message,
    });
  }
};

const getTasksByUser = async (req, res) => {
   const userId = req.user?.id;

  try {
    const tasks = await TaskSchedule.findAll({
      where: { assigned_to: userId },
      include: [
        {
          model: User,
          as: "assignedUser",
          attributes: ["id", "fullname"],
        },
      ],
      order: [["due_date", "ASC"]], // Optional: sort by due_date
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving tasks",
      error: error.message,
    });
  }
};


module.exports = {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  getTaskById,
  getTasksByUser
};
