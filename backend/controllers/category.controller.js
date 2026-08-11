const { Op } = require("sequelize");
const { Category } = require("../models");

// ✅ List all categories
const listCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", all } = req.query;

    const whereCondition = search
      ? { category_name: { [Op.like]: `%${search}%` } }
      : {};

    // Return all categories without pagination
    if (all === "true") {
      const categories = await Category.findAll({
        where: whereCondition,
        order: [["category_name", "DESC"]],
      });
      return res.status(200).json({ success: true, data: categories });
    }

    // Paginated categories
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Category.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      order: [["category_name", "DESC"]],
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

module.exports = { listCategories };
