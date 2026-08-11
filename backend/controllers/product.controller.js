const { Product, Category } = require("../models");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const getAllProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, all } = req.query; // Get query parameters
    const offset = (page - 1) * limit; // Calculate offset

    // Search filter
    const whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { product_name: { [Op.like]: `%${search}%` } },
        { HSN_code: { [Op.like]: `%${search}%` } },
      ];
    }

    //Fetch products with pagination and search
    // const { count, rows: products } = await Product.findAndCountAll({
    //   where: whereCondition,
    //   limit: parseInt(limit),
    //   offset: parseInt(offset),
    //   order: [["id", "DESC"]],
    // });

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "category_name"], // Only select what you need
        },
      ],
    });

    if (all === "true") {
      const customers = await Product.findAll({
        where: { status: 1 },
        order: [["id", "DESC"]],
      });
      return res.status(200).json({ success: true, data: customers });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
      totalRecords: count, // Total records in DB
      currentPage: parseInt(page), // Current page
      totalPages: Math.ceil(count / limit), // Total pages
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { product_name } = req.body;

    // Check if product with same name exists
    const existingProduct = await Product.findOne({ where: { product_name } });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product name already exists",
      });
    }

    // Create product if not duplicate
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log("req.body", req.body);
    const [updated] = await Product.update(req.body, { where: { id } });

    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      return res.json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Toggle status (1 -> 0, 0 -> 1)
    const newStatus = product.status === 1 ? 0 : 1;
    await product.update({ status: newStatus });

    res.json({
      success: true,
      message: `Product status updated to ${newStatus}`,
      data: product,
    });
  } catch (error) {
    console.error("Error toggling product status:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.findAll({
      where: { category_id: categoryId },
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const exportProductsToExcel = async (req, res) => {
  try {
    const { search } = req.query;

    let whereCondition = {};
    if (search) {
      whereCondition[Op.or] = [
        { product_name: { [Op.like]: `%${search}%` } },
        { HSN_code: { [Op.like]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({
      where: whereCondition,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_name"],
        },
      ],
      order: [["id", "DESC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products Report");

    worksheet.columns = [
      { header: "Product Name", key: "product_name", width: 30 },
      { header: "HSN Code", key: "HSN_code", width: 15 },
      { header: "Category", key: "category", width: 25 },
      { header: "Unit", key: "unit", width: 10 },
      { header: "Rate", key: "rate", width: 15 },
      { header: "Area mtr2 ", key: "area_mtr2", width: 15 },
      // { header: "area_mtr2 ", key: "area_mtr2 ", width: 15 },
      { header: "Product Description ", key: "product_description", width: 20 },
      { header: "Status", key: "status", width: 10 },
    ];

    products.forEach((prod) => {
      worksheet.addRow({
        product_name: prod.product_name ?? null,
        HSN_code: prod.HSN_code ?? null,
        category: prod.category?.category_name ?? null,
        unit: prod.unit ?? null,
        rate: prod.rate ?? null,
        area_mtr2: prod.area_mtr2 ?? null,
        product_description: prod.product_description ?? null,
        status: prod.status === 1 ? "Active" : "Inactive",
      });
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];

    const fileName = `Products_Report_${timestamp}.xlsx`;
    const filePath = path.join(__dirname, `../exports/${fileName}`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Download error:", err);
      }

      // Delete file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete file:", unlinkErr);
        } else {
          console.log("Deleted file:", filePath);
        }
      });
    });
  } catch (error) {
    console.error("Export Products Error:", error);
    res.status(500).json({ success: false, message: error.message});
  }
};



module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  getProductsByCategoryId,
  exportProductsToExcel
};
