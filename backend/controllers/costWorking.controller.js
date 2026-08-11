const {
  CostWorking,
  CostWorkingProduct,
  Product,
  Customer,
  Category,
} = require("../models");
const { Sequelize, Op } = require("sequelize");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const createCostWorking = async (req, res) => {
  const {
    company_name,
    location,
    nature_of_work,
    technology_used,
    estimate_date,
    estimate_no,
    revision_date,
    revision_no,
    area_to_be_coated,
    thickness_in_mm,
    labour_cost,
    cunsumable_cost,
    transport_cost,
    supervision_cost,
    contractor_profit,
    labour_cost_area,
    cunsumable_cost_area,
    transport_cost_area,
    supervision_cost_area,
    finance_cost_month,
    finance_cost_persantage,
    over_head_charges_area,
    over_head_charges_persantage,
    contractor_profit_persantage,
    notes,
    total_material_cost,
    b2_percent,
    b3_percent,
    approved_by,
    checked_by,
    dcpl_representative,
    prepared_by,
    products,
  } = req.body;

  try {
    const toNumber = (val) => Number(val || 0);
    const to2Decimal = (val) => Number(Number(val).toFixed(2));

    const parsedRevisionDate =
      revision_date && !isNaN(new Date(revision_date))
        ? new Date(revision_date)
        : null;

    const toNullableNumber = (value) => {
      return value === "" || value === undefined ? null : to2Decimal(value);
    };

    const costWorking = await CostWorking.create({
      company_name,
      location,
      nature_of_work,
      technology_used,
      estimate_no,
      estimate_date,
      revision_no,
      revision_date: parsedRevisionDate,
      area_to_be_coated: toNullableNumber(area_to_be_coated),
      thickness_in_mm: toNullableNumber(thickness_in_mm),
      labour_cost: toNullableNumber(labour_cost),
      cunsumable_cost: toNullableNumber(cunsumable_cost),
      transport_cost: toNullableNumber(transport_cost),
      supervision_cost: toNullableNumber(supervision_cost),
      labour_cost_area: to2Decimal(labour_cost_area),
      cunsumable_cost_area: to2Decimal(cunsumable_cost_area),
      transport_cost_area: to2Decimal(transport_cost_area),
      supervision_cost_area: to2Decimal(supervision_cost_area),
      finance_cost_month: to2Decimal(finance_cost_month),
      finance_cost_persantage: to2Decimal(finance_cost_persantage),
      over_head_charges_area: to2Decimal(over_head_charges_area),
      over_head_charges_persantage: to2Decimal(over_head_charges_persantage),
      contractor_profit_persantage: to2Decimal(contractor_profit_persantage),
      contractor_profit: toNullableNumber(contractor_profit),
      approved_by,
      checked_by,
      dcpl_representative,
      prepared_by,
      notes,
    });

    const cost_working_id = costWorking.id;

    await costWorking.update({ cr_id: cost_working_id });

    // if (products && Array.isArray(products)) {
    //   const productRecords = products.map((product) => ({
    //     cost_working_id,
    //     //category_id: product.category_id,
    //     category_name: product.category_name,
    //     product_id: product.product_id,
    //     unit: product.unit,
    //     qty_for: product.qty_for,
    //     std_pak: product.std_pak,
    //     std_basic_rate: product.std_basic_rate,
    //     basic_amount: product.basic_amount,
    //     qty_for_1: product.qty_for_1,
    //   }));

    //   await CostWorkingProduct.bulkCreate(productRecords);
    // }

    if (products && Array.isArray(products)) {
      const productRecords = [];

      products.forEach((category) => {
        const { category_name, items } = category;

        if (Array.isArray(items)) {
          items.forEach((product) => {
            productRecords.push({
              cost_working_id,
              category_name,
              product_id: product.product_id,
              unit: product.unit,
              qty_for: product.qty_for,
              std_pak: product.std_pak,
              std_basic_rate: product.std_basic_rate,
              basic_amount: product.basic_amount,
              qty_for_1: product.qty_for_1,
            });
          });
        }
      });

      if (productRecords.length > 0) {
        await CostWorkingProduct.bulkCreate(productRecords);
      }
    }

    res.status(201).json({
      success: true,
      message: "Cost Working and Products added successfully",
      cost_working_id,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const getCostWorking = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await CostWorking.findAndCountAll({
      where: {
        [Op.or]: [
          { estimate_no: { [Op.like]: `%${search}%` } },
          { location: { [Op.like]: `%${search}%` } },
          Sequelize.where(Sequelize.col("company.company_name"), {
            [Op.like]: `%${search}%`,
          }),
        ],
      },
      include: [
        {
          model: CostWorkingProduct,
          as: "products",
          include: [
            {
              model: Product, // Include product details here
              attributes: ["id", "product_name", "HSN_code"], // Adjust attributes as needed
            },
            // {
            //       model: Category,
            //       as: "category",
            //       attributes: ["id", "category_name"], // Only select what you need
            //     },
          ],
        },
        {
          model: Customer,
          as: "company",
          attributes: ["id", "company_name"],
          required: false,
        },
      ],
      offset: parseInt(offset),
      limit: parseInt(limit),
      distinct: true,
      subQuery: false,
      //order: [["id", "DESC"]],
      //order: [["createdAt", "DESC"]],
      order: [Sequelize.literal("CostWorking.id DESC")],
    });

    // Group by cr_id and mark last one as editable
    const grouped = {};
    rows.forEach((item) => {
      const cr_id = item.cr_id;
      if (!grouped[cr_id]) {
        grouped[cr_id] = [];
      }
      grouped[cr_id].push(item);
    });

    const modifiedRows = [];

    for (const cr_id in grouped) {
      const versions = grouped[cr_id];
      const sortedVersions = versions.sort(
        (a, b) => b.revision_no - a.revision_no
      );
      sortedVersions.forEach((version, index) => {
        const data = version.toJSON();
        data.edit = index === 0; // only latest version editable
        modifiedRows.push(data);
      });
    }

    res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      data: modifiedRows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const updateCostWorking = async (req, res) => {
  const {
    company_name,
    location,
    nature_of_work,
    technology_used,
    estimate_date,
    estimate_no,
    revision_date,
    revision_no,
    area_to_be_coated,
    thickness_in_mm,
    labour_cost,
    cunsumable_cost,
    transport_cost,
    supervision_cost,
    contractor_profit,
    labour_cost_area,
    cunsumable_cost_area,
    transport_cost_area,
    supervision_cost_area,
    finance_cost_month,
    finance_cost_persantage,
    over_head_charges_area,
    over_head_charges_persantage,
    contractor_profit_persantage,
    total_material_cost,
    b2_percent,
    b3_percent,
    approved_by,
    checked_by,
    dcpl_representative,
    prepared_by,
    products,
    notes,
  } = req.body;

  const { id } = req.params;

  try {
    const toNumber = (val) => Number(val || 0);
    const to2Decimal = (val) => Number(Number(val).toFixed(2));
    const toNullableNumber = (value) =>
      value === "" || value === undefined ? null : to2Decimal(value);
    const parsedRevisionDate =
      revision_date && !isNaN(new Date(revision_date))
        ? new Date(revision_date)
        : null;

    // Fetch previous version
    const previousVersion = await CostWorking.findByPk(id);
    if (!previousVersion) {
      return res
        .status(404)
        .json({ success: false, message: "Cost working not found" });
    }

    const cr_id = previousVersion.cr_id;

    // Create new revision
    const newCostWorking = await CostWorking.create({
      cr_id,
      company_name,
      location,
      nature_of_work,
      technology_used,
      estimate_no,
      estimate_date,
      revision_no,
      revision_date: parsedRevisionDate,
      area_to_be_coated: toNullableNumber(area_to_be_coated),
      thickness_in_mm: toNullableNumber(thickness_in_mm),
      labour_cost: toNullableNumber(labour_cost),
      cunsumable_cost: toNullableNumber(cunsumable_cost),
      transport_cost: toNullableNumber(transport_cost),
      supervision_cost: toNullableNumber(supervision_cost),
      contractor_profit: toNullableNumber(contractor_profit),
      labour_cost_area,
      cunsumable_cost_area,
      transport_cost_area,
      supervision_cost_area,
      finance_cost_month,
      finance_cost_persantage,
      over_head_charges_area,
      over_head_charges_persantage,
      contractor_profit_persantage,
      approved_by,
      checked_by,
      dcpl_representative,
      prepared_by,
      notes,
    });

    const cost_working_id = newCostWorking.id;

    // Insert updated products
    // if (products && Array.isArray(products)) {
    //   const productRecords = products.map((product) => ({
    //     cost_working_id,
    //     category_name: product.category_name,
    //     //category_id: product.category_id,
    //     product_id: product.product_id,
    //     unit: product.unit,
    //     qty_for: product.qty_for,
    //     std_pak: product.std_pak,
    //     std_basic_rate: product.std_basic_rate,
    //     basic_amount: product.basic_amount,
    //     qty_for_1: product.qty_for_1,
    //   }));

    //   await CostWorkingProduct.bulkCreate(productRecords);
    // }

    if (products && Array.isArray(products)) {
      const productRecords = [];

      products.forEach((category) => {
        const { category_name, items } = category;

        if (Array.isArray(items)) {
          items.forEach((product) => {
            productRecords.push({
              cost_working_id,
              category_name,
              product_id: product.product_id,
              unit: product.unit,
              qty_for: product.qty_for,
              std_pak: product.std_pak,
              std_basic_rate: product.std_basic_rate,
              basic_amount: product.basic_amount,
              qty_for_1: product.qty_for_1,
            });
          });
        }
      });

      if (productRecords.length > 0) {
        await CostWorkingProduct.bulkCreate(productRecords);
      }
    }

    res.status(200).json({
      success: true,
      message: "New revision created successfully",
      cost_working_id,
      //revision_no: newRevisionNo,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const exportCostWorkingListToExcel = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {
      [Op.or]: [
        { estimate_no: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        Sequelize.where(Sequelize.col("company.company_name"), {
          [Op.like]: `%${search}%`,
        }),
      ],
    };

    const records = await CostWorking.findAll({
      where: whereCondition,
      include: [
        {
          model: CostWorkingProduct,
          as: "products",
          include: [
            {
              model: Product,
              attributes: ["id", "product_name", "HSN_code"],
            },
          ],
        },
        {
          model: Customer,
          as: "company",
          attributes: ["id", "company_name"],
          required: false,
        },
      ],
      offset: parseInt(offset),
      limit: parseInt(limit),
      distinct: true,
      subQuery: false,
      //order: [["id", "DESC"]],
      //order: [["createdAt", "DESC"]],
      order: [Sequelize.literal("CostWorking.id DESC")],
    });

    //console.log("records",records);

    const grouped = {};
    records.forEach((item) => {
      const cr_id = item.cr_id;
      if (!grouped[cr_id]) grouped[cr_id] = [];
      grouped[cr_id].push(item);
    });

    const latestVersions = [];
    for (const cr_id in grouped) {
      const sorted = grouped[cr_id].sort(
        (a, b) => b.revision_no - a.revision_no
      );
      latestVersions.push(sorted[0]);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Cost Working Report");

    worksheet.columns = [
      { header: "Company Name", key: "company_name", width: 25 },
      { header: "Estimate No", key: "estimate_no", width: 20 },
      { header: "Estimate Date", key: "estimate_date", width: 20 },
      { header: "Nature of Work", key: "nature_of_work", width: 20 },
      { header: "Technology Used", key: "technology_used", width: 20 },
      { header: "Location", key: "location", width: 20 },
      { header: "Revision No", key: "revision_no", width: 15 },
      { header: "Revision Date", key: "revision_date ", width: 15 },
      { header: "Products", key: "products", width: 50 },
      { header: "Created Date", key: "created_at", width: 20 },
    ];

    latestVersions.forEach((item) => {
      worksheet.addRow({
        company_name: item.company?.company_name ?? null,
        estimate_no: item.estimate_no ?? null,
        estimate_date: item?.estimate_date
          ? new Date(item.estimate_date).toLocaleDateString()
          : "",
        nature_of_work: item?.nature_of_work ?? null,
        technology_used: item.technology_used ?? null,
        revision_date: item.revision_date
          ? new Date(item.revision_date).toLocaleDateString()
          : "",
        estimate_no: item.estimate_no,
        location: item.location,
        company_name: item.company?.company_name ?? null,
        revision_no: item.revision_no,
        products: item.products
          .map((p) => `${p?.Product?.product_name} (${p?.Product?.HSN_code})`)
          .join("\n"),
        created_at: item.createdAt.toLocaleDateString(),
      });
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      __dirname,
      `../exports/CostWorking_Report_${timestamp}.xlsx`
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, `CostWorking_Report_${timestamp}.xlsx`);
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export",
      error: error.message,
    });
  }
};

const getNextEstimateNo = async (req, res) => {
  try {
    const latest = await CostWorking.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["estimate_no"],
    });

    let nextNo = "001";
    if (latest && latest.estimate_no) {
      const num = parseInt(latest.estimate_no, 10) + 1;
      nextNo = num.toString().padStart(3, "0");
    }

    return res.status(200).json({
      success: true,
      estimate_no: nextNo,
    });
  } catch (error) {
    console.error("Error generating next estimate number:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const exportCostWorkingByIdToExcel = async (req, res) => {
  try {
    const { id } = req.params;

    const costWorking = await CostWorking.findOne({
      where: { id },
      include: [
        {
          model: CostWorkingProduct,
          as: "products",
          include: [
            {
              model: Product,
              attributes: ["product_name", "HSN_code"],
            },
          ],
        },
        {
          model: Customer,
          as: "company",
          attributes: ["company_name"],
        },
      ],
    });

    //console.log("costWorking", costWorking);

    if (!costWorking) {
      return res
        .status(404)
        .json({ success: false, message: "CostWorking record not found" });
    }

    // --- NEW CALCULATIONS (from user's input) ---
    const totalMaterialCost = costWorking?.products.reduce((total, item) => {
      const basicAmount = parseFloat(item.basic_amount);
      return total + (isNaN(basicAmount) ? 0 : basicAmount);
    }, 0);

    //B2 start
    const totalLabourCost =
      (costWorking?.labour_cost || 0) +
      (costWorking?.cunsumable_cost || 0) +
      (costWorking?.transport_cost || 0) +
      (costWorking?.supervision_cost || 0);

    const totalAreaCost =
      (parseFloat(costWorking.labour_cost_area) || 0) +
      (parseFloat(costWorking.cunsumable_cost_area) || 0) +
      (parseFloat(costWorking.transport_cost_area) || 0) +
      (parseFloat(costWorking.supervision_cost_area) || 0);

    const FinanceCost = (
      (parseFloat(totalMaterialCost) + parseFloat(totalLabourCost)) *
      ((costWorking?.finance_cost_persantage || 0) / 100) *
      (costWorking?.finance_cost_month || 0)
    ).toFixed(2);

    const TotalFinanceCost =
      parseFloat(FinanceCost) + parseFloat(totalLabourCost);
    //end c

    const overhead_charges =
      (TotalFinanceCost * (costWorking?.over_head_charges_persantage || 0)) /
      100;

    const total_application_labour_cost = (
      parseFloat(TotalFinanceCost) + parseFloat(overhead_charges)
    ).toFixed(2);

    const totalApplication_Totalmaterialcost = (
      Number(totalMaterialCost || 0) +
      Number(total_application_labour_cost || 0)
    ).toFixed(2);

    const contarctorprofit = (
      totalApplication_Totalmaterialcost *
      ((parseFloat(costWorking?.contractor_profit_persantage) || 0) / 100)
    ).toFixed(2);

    const total_project_cost = (
      parseFloat(totalApplication_Totalmaterialcost) +
      parseFloat(contarctorprofit)
    ).toFixed(2);

    const cost_persqrtmt = (
      (parseFloat(totalMaterialCost) || 0) /
      (costWorking?.area_to_be_coated || 1)
    ) // Avoid division by zero
      .toFixed(2);

    const final_cost_persqrtmt = (
      (parseFloat(total_project_cost) || 0) /
      (costWorking?.area_to_be_coated || 1)
    ) // Avoid division by zero
      .toFixed(2);
    // --- END NEW CALCULATIONS ---

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Cost Working Estimate");

    // Define column widths for the entire sheet (9 columns A-I as per screenshot)
    sheet.columns = [
      { width: 20 }, // A: S.N. / Labels
      { width: 25 }, // B: Item / Description / Values
      { width: 15 }, // C: HSN Code / Area / Unit / Qty
      { width: 10 }, // D: Qty/M1 / Unit
      { width: 10 }, // E: Unit / Amount
      { width: 20 }, // F: Qty. for Total Area (in SqM)
      { width: 10 }, // G: Std Pak / Total Project Cost Rs
      { width: 15 }, // H: Basic Rate
      { width: 20 }, // I: Basic Amount
    ];

    // Helper function for cell styling (borders, alignment, font, fill)
    const applyCellStyles = (
      cell,
      bold = false,
      horizontal = "middle",
      vertical = "middle",
      fill = null,
      border = true
    ) => {
      cell.alignment = { horizontal: horizontal, vertical: vertical };
      if (bold) cell.font = { bold: true };
      if (fill)
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fill },
        };
      if (border) {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      } else {
        cell.border = {}; // No border
      }
    };

    let currentRow = 1;

    // === Header Section ===
    sheet.mergeCells(`A${currentRow}:I${currentRow}`); // Merged across 9 columns as per screenshot
    sheet.getCell(`A${currentRow}`).value = "Cost Working/Estimate";
    applyCellStyles(
      sheet.getCell(`A${currentRow}`),
      true,
      "center",
      "middle",
      "FF2F4B7C"
    ); // Dark blue header
    sheet.getCell(`A${currentRow}`).font = {
      bold: true,
      size: 16,
      color: { argb: "FFFFFFFF" },
    }; // White text

    currentRow++; // Move to row 2
    sheet.addRow([]); // Empty row for spacing

    // === Basic Info Section ===
    // Left side info (Labels in A, Values merged B-E)
    const infoLeftStartCol = "A";
    const infoLeftValueStartCol = "B";
    const infoLeftValueEndCol = "E";

    // Right side info (Labels in F, Values merged H-I)
    const infoRightStartCol = "F";
    const infoRightValueStartCol = "H";
    const infoRightValueEndCol = "I";

    const infoDataLeft = [
      {
        label: "Name of Company:",
        value: costWorking.company?.company_name ?? null,
      },
      {
        label: "Location/Site:",
        value: costWorking.location ?? null,
      },
      {
        label: "Nature of Work:",
        value: costWorking.nature_of_work ?? null,
      },
      {
        label: "Technology Used:",
        value: costWorking.technology_used ?? null,
      },
      {
        label: "Area (In Sq. Mtr.):",
        value: costWorking.area_to_be_coated ?? null,
      },
      {
        label: "Thickness in mm:",
        value: costWorking.thickness_in_mm ?? null,
      },
    ];

    const infoDataRight = [
      { label: "Estimate No:", value: costWorking.estimate_no ?? null },
      {
        label: "Estimate Date:",
        value: costWorking.estimate_date
          ? new Date(costWorking.estimate_date).toLocaleDateString("en-GB")
          : "",
      },
      { label: "Revision No:", value: costWorking.revision_no ?? null },
      {
        label: "Revision Date:",
        value: costWorking.revision_date
          ? new Date(costWorking.revision_date).toLocaleDateString("en-GB")
          : "",
      },
    ];

    const startInfoRow = currentRow;

    for (
      let i = 0;
      i < Math.max(infoDataLeft.length, infoDataRight.length);
      i++
    ) {
      currentRow = startInfoRow + i;
      sheet.addRow([]); // Add a new row for each line of info

      if (infoDataLeft[i]) {
        sheet.getCell(`${infoLeftStartCol}${currentRow}`).value =
          infoDataLeft[i].label;
        applyCellStyles(
          sheet.getCell(`${infoLeftStartCol}${currentRow}`),
          true,
          "left",
          "middle",
          null,
          false
        ); // Label, no border
        sheet.mergeCells(
          `${infoLeftValueStartCol}${currentRow}:${infoLeftValueEndCol}${currentRow}`
        );
        sheet.getCell(`${infoLeftValueStartCol}${currentRow}`).value =
          infoDataLeft[i].value;
        applyCellStyles(
          sheet.getCell(`${infoLeftValueStartCol}${currentRow}`),
          false,
          "left",
          "middle",
          null,
          true
        ); // Value, with border
      }

      if (infoDataRight[i]) {
        sheet.getCell(`${infoRightStartCol}${currentRow}`).value =
          infoDataRight[i].label;
        applyCellStyles(
          sheet.getCell(`${infoRightStartCol}${currentRow}`),
          true,
          "left",
          "middle",
          null,
          false
        ); // Label, no border
        sheet.mergeCells(
          `${infoRightValueStartCol}${currentRow}:${infoRightValueEndCol}${currentRow}`
        );
        sheet.getCell(`${infoRightValueStartCol}${currentRow}`).value =
          infoDataRight[i].value;
        applyCellStyles(
          sheet.getCell(`${infoRightValueStartCol}${currentRow}`),
          false,
          "left",
          "middle",
          null,
          true
        ); // Value, with border
      }
    }
    currentRow =
      startInfoRow + Math.max(infoDataLeft.length, infoDataRight.length); // Update current row correctly

    sheet.addRow([]); // Empty row for spacing

    // === Material Cost Section (Table A) ===
    currentRow++;
    const materialHeaders = [
      "S.N.",
      "Item",
      "HSN Code",
      "Qty/M²",
      "Unit",
      "Qty. for Total Area (in SqM)",
      "Std Pak",
      "Basic Rate",
      "Basic Amount",
    ];

    const materialHeaderRow = sheet.getRow(currentRow);
    materialHeaders.forEach((header, index) => {
      const cell = materialHeaderRow.getCell(index + 1); // Excel cells are 1-indexed
      cell.value = header;
      applyCellStyles(cell, true, "center", "middle", "FFD9D9D9"); // Light grey header
    });
    materialHeaderRow.commit();

    // Material Cost sub-header
    currentRow++;
    sheet.getCell(`A${currentRow}`).value = "A-";
    applyCellStyles(sheet.getCell(`A${currentRow}`), true, "left", "middle");
    sheet.mergeCells(`B${currentRow}:I${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Material Cost";
    applyCellStyles(sheet.getCell(`B${currentRow}`), true, "left", "middle");

    // Product Data Rows
    // Group products by category to replicate screenshot structure
    const productsByCategory = costWorking.products.reduce((acc, product) => {
      // Assuming product.category_name can be used as the 'main item' like "bio wash"
      const category = product.category_name || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    let snCounter = 1; // For S.N. (1, 2, etc.)
    for (const categoryName in productsByCategory) {
      // Add the main category row (e.g., "bio wash" with S.N.)
      currentRow++;
      const mainProductRowValues = [
        snCounter.toString(), // S.N.
        categoryName, // Item (e.g., "bio wash")
        "",
        "",
        "",
        "",
        "",
        "",
        "", // Empty for other columns as per screenshot
      ];
      const mainProductRow = sheet.addRow(mainProductRowValues);
      mainProductRow.eachCell((cell, colNumber) => {
        // Column 2 = "B" = category name
        const isCategoryCell = colNumber === 2;
        cell.font = {
          bold: isCategoryCell, // only bold category name
        };
        applyCellStyles(cell, false, "left", "middle", "FFEEEEEE");
      });
      // mainProductRow.eachCell((cell) => {
      //   applyCellStyles(cell, false, "left", "middle", "FFEEEEEE");
      // });
      // Merge the 'Item' cell (B) across to 'I' for the main product/category row
      sheet.mergeCells(
        mainProductRow.getCell("B").address,
        mainProductRow.getCell("I").address
      );

      // Add sub-products under this category (e.g., "Clenon Concentrate")
      productsByCategory[categoryName].forEach((product) => {
        currentRow++;
        const subProductRowValues = [
          "", // No S.N. for sub-items
          product.Product?.product_name || "", // Item
          product.Product?.HSN_code || "", // HSN Code
          product.qty_for_1 || "", // Qty/M1
          product.unit || "", // Unit
          product.qty_for || "", // Qty. for Total Area (in SqM)
          product.std_pak || "", // Std Pak
          product.std_basic_rate || "", // Basic Rate
          product.basic_amount || "", // Basic Amount
        ];
        const subProductRow = sheet.addRow(subProductRowValues);
        subProductRow.eachCell((cell, colNumber) => {
          applyCellStyles(
            cell,
            false,
            colNumber === 2 ? "left" : "right",
            "middle",
            "FFEEEEEE"
          );
        });
        // No merging for sub-product rows, as their data is in distinct columns
      });
      snCounter++;
    }

    // Total Material Basic Cost
    currentRow++;
    sheet.mergeCells(`A${currentRow}:H${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "Total Material Basic Cost :";
    applyCellStyles(
      sheet.getCell(`A${currentRow}`),
      true,
      "right",
      "middle",
      "FFD9D9D9"
    );
    sheet.getCell(`I${currentRow}`).value = totalMaterialCost.toFixed(2); // Use actual data
    applyCellStyles(
      sheet.getCell(`I${currentRow}`),
      true,
      "right",
      "middle",
      "FFD9D9D9"
    );

    // Per Sq. Mtr. Material Cost
    currentRow++;
    sheet.mergeCells(`A${currentRow}:H${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "Per Sq. Mtr. Material Cost :";
    applyCellStyles(
      sheet.getCell(`F${currentRow}`),
      true,
      "right",
      "middle",
      "FFD9D9D9"
    );
    sheet.getCell(`I${currentRow}`).value = cost_persqrtmt; // Use calculated cost_persqrtmt
    applyCellStyles(
      sheet.getCell(`I${currentRow}`),
      true,
      "right",
      "middle",
      "FFD9D9D9"
    );

    sheet.addRow([]); // Empty row for spacing

    // === Cost per Project / Site Condition Section (Table B) ===
    currentRow++;
    const costHeaderRow = sheet.addRow([
      "",
      "Description",
      "Area",
      "Unit",
      "Amount",
    ]);
    costHeaderRow.eachCell((cell) => {
      applyCellStyles(cell, true, "center", "middle", "FFD9D9D9");
    });
    // No merge for Description and Area as per new screenshot

    currentRow++;
    sheet.getCell(`A${currentRow}`).value = "B-";
    applyCellStyles(sheet.getCell(`A${currentRow}`), true, "left", "middle");
    sheet.mergeCells(`B${currentRow}:I${currentRow}`);
    sheet.getCell(`B${currentRow}`).value =
      "Cost as per project / Site condition";
    applyCellStyles(sheet.getCell(`B${currentRow}`), true, "left", "middle");

    // === B1 - Labour Cost Header ===
    currentRow++;
    sheet.getCell(`A${currentRow}`).value = "B1-";
    sheet.mergeCells(`A${currentRow}:I${currentRow}`);
    applyCellStyles(
      sheet.getCell(`A${currentRow}`),
      true,
      "left",
      "middle",
      "FFD9D9D9"
    );

    // === B1 Labour Cost Rows with Merging ===
    const labourCosts = [
      {
        desc: "Labour cost",
        area: costWorking.labour_cost_area,
        unit: "M2",
        amount: costWorking.labour_cost,
      },
      {
        desc: "Consumable cost",
        area: costWorking.cunsumable_cost_area,
        unit: "M2",
        amount: costWorking.cunsumable_cost,
      },
      {
        desc: "Transport cost",
        area: costWorking.transport_cost_area,
        unit: "M2",
        amount: costWorking.transport_cost,
      },
      {
        desc: "Supervision cost",
        area: costWorking.supervision_cost_area,
        unit: "M2",
        amount: costWorking.supervision_cost,
      },
    ];

    let totalB1Amount = 0;
    let totalB1Area = 0;

    labourCosts.forEach((item) => {
      currentRow++;

      // Merge and set values
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.getCell(`B${currentRow}`).value = item.desc;

      sheet.mergeCells(`D${currentRow}:E${currentRow}`);
      sheet.getCell(`D${currentRow}`).value = item.area;

      sheet.mergeCells(`F${currentRow}:G${currentRow}`);
      sheet.getCell(`F${currentRow}`).value = item.unit;

      sheet.mergeCells(`H${currentRow}:I${currentRow}`);
      sheet.getCell(`H${currentRow}`).value = item.amount;

      // Apply styles
      ["B", "D", "F", "H"].forEach((col) => {
        applyCellStyles(
          sheet.getCell(`${col}${currentRow}`),
          false,
          col === "B" ? "left" : "right", // align 'desc' left, others right
          "middle",
          "FFEEEEEE"
        );
      });

      totalB1Amount += parseFloat(item.amount || 0);
      totalB1Area += parseFloat(item.area || 0);
    });

    currentRow++;

    // Merge B & C — for the "B1 Total -"
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "B1 Total -";
    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      true,
      "left",
      "middle",
      "FFD9D9D9"
    );

    // Merge D & E — for total area
    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = totalAreaCost.toFixed(2);
    applyCellStyles(
      sheet.getCell(`D${currentRow}`),
      true,
      "right",
      "middle",
      "FFD9D9D9"
    );

    // Merge F & G — leave blank or add unit if needed
    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = ""; // Or costWorking.unit
    applyCellStyles(
      sheet.getCell(`F${currentRow}`),
      true,
      "right",
      "middle",
      "FFD9D9D9"
    );

    // Merge H & I — for total amount
    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = totalB1Amount.toFixed(2);
    applyCellStyles(
      sheet.getCell(`H${currentRow}`),
      true,
      "right",
      "middle",
      "FFD9D9D9"
    );

    sheet.addRow([]);
    // B2 Header
    currentRow++;
    sheet.getCell(`A${currentRow}`).value = "B2";
    applyCellStyles(
      sheet.getCell(`A${currentRow}`),
      true,
      "left",
      "middle",
      "FFD9D9D9"
    );

    // Merge B–I for consistent design
    sheet.mergeCells(`B${currentRow}:I${currentRow}`);
    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      false,
      "left",
      "middle",
      "FFD9D9D9"
    );

    // Finance Cost Data Row
    currentRow++;
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Finance cost";

    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value =
      costWorking.finance_cost_month || "2 month";

    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value =
      (costWorking.finance_cost_persantage || 0) + "%";

    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = FinanceCost;

    ["B", "D", "F", "H"].forEach((col) => {
      const alignment = col === "B" ? "left" : "right";
      applyCellStyles(
        sheet.getCell(`${col}${currentRow}`),
        false,
        alignment,
        "middle",
        "FFFEF9C3"
      );
    });

    // Total Row
    currentRow++;
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Total Cost :";

    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = "b2";

    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "M2";

    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = TotalFinanceCost.toFixed(2);

    // Style total row
    ["B", "D", "F", "H"].forEach((col) => {
      const alignment = col === "B" ? "left" : "right";
      applyCellStyles(
        sheet.getCell(`${col}${currentRow}`),
        true,
        alignment,
        "middle",
        "FFF9F9F9",
        "FFFD7A00"
      ); // Orange font
    });

    sheet.addRow([]);

    // B3 Header Row
    currentRow++;
    sheet.getCell(`A${currentRow}`).value = "B3";
    applyCellStyles(
      sheet.getCell(`A${currentRow}`),
      true,
      "left",
      "middle",
      "FFD9D9D9"
    );
    sheet.mergeCells(`B${currentRow}:I${currentRow}`);
    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      false,
      "left",
      "middle",
      "FFD9D9D9"
    );

    // Data Row: Over Head Charges
    currentRow++;
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Over Head Charges";

    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = costWorking.over_head_charges_area;

    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value =
      costWorking.over_head_charges_persantage;

    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = overhead_charges;

    ["B", "D", "F", "H"].forEach((col) => {
      const alignment = col === "B" ? "left" : "right";
      applyCellStyles(
        sheet.getCell(`${col}${currentRow}`),
        false,
        alignment,
        "middle",
        "FFFEF9C3"
      ); // Light yellow
    });

    // Total Labour Cost Row
    currentRow++;
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value =
      "Total application ( Labour) cost :";

    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = "=(B1+B2+B3)"; // Placeholder

    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "M2";

    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = total_application_labour_cost;

    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      true,
      "left",
      "middle",
      "FFF9F9F9",
      "FFFD7A00"
    ); // Orange
    applyCellStyles(
      sheet.getCell(`D${currentRow}`),
      true,
      "center",
      "middle",
      "FFF9F9F9",
      "FFFD7A00"
    );
    applyCellStyles(
      sheet.getCell(`F${currentRow}`),
      true,
      "right",
      "middle",
      "FFF9F9F9",
      "FFFD7A00"
    );
    applyCellStyles(
      sheet.getCell(`H${currentRow}`),
      true,
      "right",
      "middle",
      "FFFF7B7B",
      "FFFFFFFF"
    ); // Red fill, white text

    sheet.addRow([]); // Empty row for spacing

    // Section C - Header
    // --- Section Header Row Above "Project Calculation" (like screenshot) ---
    currentRow++;
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Total";
    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      true,
      "left",
      "middle",
      "FFB7BFC7"
    );

    sheet.mergeCells(`D${currentRow}:E${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = "Unit";
    applyCellStyles(
      sheet.getCell(`D${currentRow}`),
      true,
      "center",
      "middle",
      "FFB7BFC7"
    );

    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "Qty";
    applyCellStyles(
      sheet.getCell(`F${currentRow}`),
      true,
      "center",
      "middle",
      "FFB7BFC7"
    );

    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = "Total Project Cost RS";
    applyCellStyles(
      sheet.getCell(`H${currentRow}`),
      true,
      "center",
      "middle",
      "FFB7BFC7"
    );

    currentRow++;
    sheet.getCell(`A${currentRow}`).value = "C-";
    applyCellStyles(sheet.getCell(`A${currentRow}`), true, "left", "middle");
    sheet.mergeCells(`B${currentRow}:C${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Project Calculation";
    applyCellStyles(sheet.getCell(`B${currentRow}`), true, "left", "middle");
    sheet.mergeCells(`D${currentRow}:I${currentRow}`); // Remaining blank header cells

    // Project Table Rows
    const projectCalculations = [
      {
        total: "Total Material Basic Cost",
        unit: "A",
        qty: "M2",
        totalProjectCost: totalMaterialCost.toFixed(2),
      },
      {
        total: "Total application (Labour) cost",
        unit: "B",
        qty: "M2",
        totalProjectCost: total_application_labour_cost,
      },
      {
        total: "Total Material + Application basic Cost",
        unit: "A+B",
        qty: "M2",
        totalProjectCost: totalApplication_Totalmaterialcost,
      },
      {
        total: "Contractor profit",
        unit: "C",
        qty: costWorking.contractor_profit_persantage || "0.00",
        totalProjectCost: contarctorprofit,
      },
    ];

    projectCalculations.forEach((item) => {
      currentRow++;
      sheet.mergeCells(`B${currentRow}:C${currentRow}`);
      sheet.mergeCells(`D${currentRow}:E${currentRow}`);
      sheet.mergeCells(`F${currentRow}:G${currentRow}`);
      sheet.mergeCells(`H${currentRow}:I${currentRow}`);

      sheet.getCell(`B${currentRow}`).value = item.total;
      sheet.getCell(`D${currentRow}`).value = item.unit;
      sheet.getCell(`F${currentRow}`).value = item.qty;
      sheet.getCell(`H${currentRow}`).value = item.totalProjectCost;

      ["B", "D", "F", "H"].forEach((col) => {
        let alignment = "center"; // default

        if (col === "B") alignment = "left";
        else if (col === "H") alignment = "right";

        applyCellStyles(
          sheet.getCell(`${col}${currentRow}`),
          false,
          alignment,
          "middle",
          "FFFFFFFF"
        );
      });
    });

    // Final Total Row
    currentRow++;
    sheet.mergeCells(`B${currentRow}:E${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Total Project Cost :";
    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      true,
      "left",
      "middle",
      "FFF5F5F5"
    );

    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "A+B+C";
    applyCellStyles(
      sheet.getCell(`F${currentRow}`),
      true,
      "center",
      "middle",
      "FFF5F5F5"
    );

    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = total_project_cost;
    applyCellStyles(
      sheet.getCell(`H${currentRow}`),
      true,
      "right",
      "middle",
      "FFF5F5F5"
    );

    // Final Cost Per M2
    currentRow++;
    sheet.mergeCells(`B${currentRow}:E${currentRow}`);
    sheet.getCell(`B${currentRow}`).value = "Total Project Cost Per M2 :";
    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      true,
      "left",
      "middle",
      "FFFFF0E0",
      "FFEC7000"
    );

    sheet.mergeCells(`F${currentRow}:G${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "M2";
    applyCellStyles(
      sheet.getCell(`F${currentRow}`),
      true,
      "center",
      "middle",
      "FFFFF0E0",
      "FFEC7000"
    );

    sheet.mergeCells(`H${currentRow}:I${currentRow}`);
    sheet.getCell(`H${currentRow}`).value = final_cost_persqrtmt;
    applyCellStyles(
      sheet.getCell(`H${currentRow}`),
      true,
      "right",
      "middle",
      "FFFFF0E0",
      "FFEC7000"
    );
    sheet.addRow([]);

    // === Note Section ===
    currentRow++;
    sheet.mergeCells(`A${currentRow}:I${currentRow}`);
    sheet.getCell(`A${currentRow}`).value = "Note";
    applyCellStyles(
      sheet.getCell(`A${currentRow}`),
      true,
      "left",
      "middle",
      "FFEEEEEE"
    ); // Light grey

    currentRow++;
    sheet.mergeCells(`B${currentRow}:I${currentRow}`);

    // Prepare note value (fallback if empty)
    const noteContent = costWorking.notes?.trim()
      ? costWorking.notes
      : "No additional notes provided.";

    sheet.getCell(`B${currentRow}`).value = noteContent;
    applyCellStyles(
      sheet.getCell(`B${currentRow}`),
      false,
      "left",
      "top",
      "FFFFFFCC"
    ); // Light yellow

    sheet.getCell(`B${currentRow}`).alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };

    // Auto-adjust row height based on content (rough estimate)
    const lines = noteContent.split(/\r\n|\r|\n/).length;
    sheet.getRow(currentRow).height = Math.max(30, lines * 15);
    sheet.addRow([]);
    // === Approval Section ===
    currentRow++;
    sheet.mergeCells(`A${currentRow}:I${currentRow}`);
    sheet.getCell(`A${currentRow}`).value =
      "For Dimple Chemicals & Services Pvt. Ltd.";
    applyCellStyles(sheet.getCell(`A${currentRow}`), true, "left", "middle");

    currentRow++;
    sheet.addRow([]); // Empty row for spacing
    currentRow++;

    const approvalLabels = [
      "Approved By",
      "Checked By",
      "DCPL Representative",
      "Prepared By",
    ];
    const approvalRowNumber = currentRow;

    const approvalLabelsRow = sheet.getRow(approvalRowNumber);
    approvalLabelsRow.getCell(1).value = approvalLabels[0];
    approvalLabelsRow.getCell(3).value = approvalLabels[1];
    approvalLabelsRow.getCell(5).value = approvalLabels[2];
    approvalLabelsRow.getCell(7).value = approvalLabels[3];

    // Merge (1-2), (3-4), (5-6), (7-9)
    sheet.mergeCells(`A${approvalRowNumber}:B${approvalRowNumber}`);
    sheet.mergeCells(`C${approvalRowNumber}:D${approvalRowNumber}`);
    sheet.mergeCells(`E${approvalRowNumber}:F${approvalRowNumber}`);
    sheet.mergeCells(`G${approvalRowNumber}:I${approvalRowNumber}`);

    // Style label row
    approvalLabelsRow.eachCell((cell) => {
      applyCellStyles(cell, true, "center", "middle", "FFD9D9D9");
    });

    // Approval Values Row
    currentRow++;
    const approvalValues = [
      costWorking.approved_by,
      costWorking.checked_by,
      costWorking.dcpl_representative,
      costWorking.prepared_by,
    ];

    const approvalValuesRow = sheet.getRow(currentRow);
    approvalValuesRow.height = 70;
    approvalValuesRow.getCell(1).value = approvalValues[0];
    approvalValuesRow.getCell(3).value = approvalValues[1];
    approvalValuesRow.getCell(5).value = approvalValues[2];
    approvalValuesRow.getCell(7).value = approvalValues[3];

    // Merge (1-2), (3-4), (5-6), (7-9)
    sheet.mergeCells(`A${currentRow}:B${currentRow}`);
    sheet.mergeCells(`C${currentRow}:D${currentRow}`);
    sheet.mergeCells(`E${currentRow}:F${currentRow}`);
    sheet.mergeCells(`G${currentRow}:I${currentRow}`);

    // Style value row
    approvalValuesRow.eachCell((cell) => {
      applyCellStyles(cell, false, "center", "top", "FFEEEEEE");
    });

    // Final adjustments for print area
    sheet.pageSetup.printArea = `A1:I${currentRow}`; // Adjust print area to cover all content
    sheet.pageSetup.fitToPage = true;

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const fileName = `Cost_Working_Report_${timestamp}.xlsx`;
    const filePath = path.join(__dirname, `../exports/${fileName}`);

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("File download error:", err);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file:", unlinkErr);
          });
        }
        res.status(500).json({
          success: false,
          message: "Failed to download Excel file",
          error: err.message,
        });
      } else {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file:", unlinkErr);
          });
        }
      }
    });
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export cost working Excel",
      error: error.message,
    });
  }
};

const exportCostWorkingByIdToPDFWithHTML = async (req, res) => {
  let browser; // Declare browser variable here so it's accessible in finally block
  try {
    const { id } = req.params;

    const costWorking = await CostWorking.findOne({
      where: { id },
      include: [
        {
          model: CostWorkingProduct,
          as: "products",
          include: [
            {
              model: Product,
              attributes: ["product_name", "HSN_code"],
            },
          ],
        },
        {
          model: Customer,
          as: "company",
          attributes: ["company_name"],
        },
      ],
    });

    if (!costWorking) {
      return res
        .status(404)
        .json({ success: false, message: "CostWorking record not found" });
    }

    // --- NEW CALCULATIONS (from user's input) ---
    const totalMaterialCost = costWorking?.products.reduce((total, item) => {
      const basicAmount = parseFloat(item.basic_amount);
      return total + (isNaN(basicAmount) ? 0 : basicAmount);
    }, 0);

    const totalLabourCost =
      (parseFloat(costWorking?.labour_cost) || 0) +
      (parseFloat(costWorking?.cunsumable_cost) || 0) +
      (parseFloat(costWorking?.transport_cost) || 0) +
      (parseFloat(costWorking?.supervision_cost) || 0);

    const totalAreaCost =
      (parseFloat(costWorking.labour_cost_area) || 0) +
      (parseFloat(costWorking.cunsumable_cost_area) || 0) +
      (parseFloat(costWorking.transport_cost_area) || 0) +
      (parseFloat(costWorking.supervision_cost_area) || 0);

    const FinanceCost = (
      (parseFloat(totalMaterialCost) + parseFloat(totalLabourCost)) *
      ((parseFloat(costWorking?.finance_cost_persantage) || 0) / 100) *
      (parseFloat(costWorking?.finance_cost_month) || 0)
    ).toFixed(2);

    const TotalFinanceCost =
      parseFloat(FinanceCost) + parseFloat(totalLabourCost);

    const overhead_charges =
      (TotalFinanceCost *
        (parseFloat(costWorking?.over_head_charges_persantage) || 0)) /
      100;

    const total_application_labour_cost = (
      parseFloat(TotalFinanceCost) + parseFloat(overhead_charges)
    ).toFixed(2);

    const totalApplication_Totalmaterialcost = (
      Number(totalMaterialCost || 0) +
      Number(total_application_labour_cost || 0)
    ).toFixed(2);

    const contarctorprofit = (
      totalApplication_Totalmaterialcost *
      ((parseFloat(costWorking?.contractor_profit_persantage) || 0) / 100)
    ).toFixed(2);

    const total_project_cost = (
      parseFloat(totalApplication_Totalmaterialcost) +
      parseFloat(contarctorprofit)
    ).toFixed(2);

    const cost_persqrtmt = (
      (parseFloat(totalMaterialCost) || 0) /
      (parseFloat(costWorking?.area_to_be_coated) || 1)
    ).toFixed(2);

    const final_cost_persqrtmt = (
      (parseFloat(total_project_cost) || 0) /
      (parseFloat(costWorking?.area_to_be_coated) || 1)
    ).toFixed(2);

    const labourCosts = [
      {
        desc: "Labour cost",
        area: costWorking.labour_cost_area || "0.00",
        unit: "M2",
        amount: costWorking.labour_cost || "0.00",
      },
      {
        desc: "Consumable cost",
        area: costWorking.cunsumable_cost_area || "0.00",
        unit: "M2",
        amount: costWorking.cunsumable_cost || "0.00",
      },
      {
        desc: "Transport cost",
        area: costWorking.transport_cost_area || "0.00",
        unit: "M2",
        amount: costWorking.transport_cost || "0.00",
      },
      {
        desc: "Supervision cost",
        area: costWorking.supervision_cost_area || "0.00",
        unit: "M2",
        amount: costWorking.supervision_cost || "0.00",
      },
    ];

    const projectCalculations = [
      {
        total: "Total Material Basic Cost",
        unit: "A",
        qty: "M2",
        totalProjectCost: totalMaterialCost.toFixed(2),
      },
      {
        total: "Total application (Labour) cost",
        unit: "B",
        qty: "M2",
        totalProjectCost: total_application_labour_cost,
      },
      {
        total: "Total Material + Application basic Cost",
        unit: "A+B",
        qty: "M2",
        totalProjectCost: totalApplication_Totalmaterialcost,
      },
      {
        total: "Contractor profit",
        unit: "C",
        qty: costWorking.contractor_profit_persantage || "0.00",
        totalProjectCost: contarctorprofit,
      },
    ];

    const productsByCategory = costWorking?.products?.reduce((acc, product) => {
      const category = product.category_name || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});

    const productRowsHTML = Object.entries(productsByCategory)
      .map(([categoryName, products], categoryIndex) => {
        const categoryHeaderRow = `
      <tr class="section-header-row">
        <td>${categoryIndex + 1}</td>
        <td class="leftmove" colspan="8"><b>${categoryName}</b></td>
      </tr>
    `;

        const productRows = products
          .map((product) => {
            return `
          <tr class="data-row">
            <td></td>
            <td class="leftmove">${product.Product?.product_name ?? ""}</td>
            <td class="rightmove">${product.Product?.HSN_code ?? ""}</td>
            <td class="rightmove">${product.qty_for ?? ""}</td>
            <td class="rightmove">${product.unit ?? ""}</td>
            <td class="rightmove">${product.qty_for_1 ?? ""}</td>
            <td class="rightmove">${product.std_pak ?? ""}</td>
            <td class="rightmove">${product.std_basic_rate ?? ""}</td>
            <td class="rightmove">${product.basic_amount ?? ""}</td>
          </tr>
        `;
          })
          .join("");

        return categoryHeaderRow + productRows;
      })
      .join("");

    // --- END NEW CALCULATIONS ---

    // Generate HTML content based on costWorking data

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <title>Cost Working/Estimate Report - Sample Company</title>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      h1 {
        color: darkblue;
        text-align: center;
        background-color: #fe6c00;
        color: white;
        padding: 10px;
        border-radius: 5px 5px 0px 0px;
        font-size: 13px;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
        font-size:10px;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
      }
      th {
        background-color: #f2f2f2;
      }
       .info-section {
            font-size: 13px;
            border: 1px solid #ddd; /* Border around the entire info section table */
            margin-top: 15px;
        }
        .info-section table {
            margin-top: 0;
        }
        .info-section td {
            border: 1px solid #ddd; /* Apply borders to all cells */
            padding: 5px 8px;
            text-align: left;
            vertical-align: top;
        }
        .info-section td:first-child {
            font-weight: bold;
            color: #514b4b;
            width: 170px;
        }
      .bordered-value {
        padding: 3px;
        min-width: 230px;
      }
      .section-header {
        background-color: lightgrey;
        font-weight: bold;
        padding: 5px;
        margin-top: 15px;
      }
      .sub-category-row {
        background-color: #eeeeee;
        font-weight: bold;
        text-align: left !important;
      }
      .data-row {
        background-color: #eeeeee;
      }
      .total-row {
        background-color: #d9d9d9;
        font-weight: bold;
        text-align: right;
        color: #513a0f;
      }
      .highlight-row {
        background-color: #fef9c3;
      } /* Light yellow */
      .orange-text {
        color: #513a0f;
      }
      .padding-data {
        padding: 5px;
      }
      .red-fill {
        background-color: red;
        color: white;
      }
      .approval-box {
        border: 1px solid #ccc;
        text-align: center;
        display: inline-block;
        width: 25%;
        height:120px;
        box-sizing: border-box;
      }
      h3{
      font-size:13px;
      }

      .first-table {
        margin-top: 40px;
      }

       .section-header-row {
        background-color: #f2f2f2; /* Light grey background for section headers */
        font-weight: bold;
        color: black;
        text-align: left !important;
      }

      .second-table {
        margin-top: 50px;
      }

      .third-table {
        margin-top: 50px;
      }

      .note-data {
        margin-top: 50px;
      }

      h2 {
        font-size: 13px;
        margin-bottom: 0px;
      }

      .leftmove{
        text-align: left !important;
        color: #34261c;
      }

      .colorchnage{
        color: #34261c;
      }

      .rightmove{
        text-align: right !important;
        color: #34261c;
      }

      h3{
        margin-bottom: 0px;
      }
      
    </style>
  </head>
  <body>
   
      <h1>Cost Working/Estimate</h1>
      <div class="padding-data">
        <div class="info-section">
          <table>
                <tbody>
                    <tr>
                        <td>Name of Company:</td>
                        <td><span class="bordered-value">${
                          costWorking.company?.company_name ?? ""
                        }</span></td>
                        <td>Estimate No:</td>
                        <td><span class="bordered-value">${
                          costWorking.estimate_no ?? ""
                        }</span></td>
                    </tr>
                    <tr>
                        <td>Location/Site:</td>
                        <td><span class="bordered-value">${
                          costWorking.location ?? ""
                        }</span></td>
                        <td>Estimate Date:</td>
                        <td><span class="bordered-value">${
                          costWorking.estimate_date
                            ? new Date(
                                costWorking.estimate_date
                              ).toLocaleDateString("en-GB")
                            : ""
                        }</span></td>
                    </tr>
                    <tr>
                        <td>Nature of Work:</td>
                        <td><span class="bordered-value">${
                          costWorking.nature_of_work ?? ""
                        }</span></td>
                        <td>Revision No:</td>
                        <td><span class="bordered-value">${
                          costWorking.revision_no ?? ""
                        }</span></td>
                    </tr>
                    <tr>
                        <td>Technology Used:</td>
                        <td><span class="bordered-value">${
                          costWorking.technology_used ?? ""
                        }</span></td>
                        <td>Revision Date:</td>
                        <td><span class="bordered-value">${
                          costWorking.revision_date
                            ? new Date(
                                costWorking.revision_date
                              ).toLocaleDateString("en-GB")
                            : ""
                        }</span></td>
                    </tr>
                    <tr>
                        <td>Area (In Sq. Mtr.):</td>
                        <td><span class="bordered-value">${
                          costWorking.area_to_be_coated ?? ""
                        }</span></td>
                        <td colspan="2"></td>
                    </tr>
                    <tr>
                        <td>Thickness in mm:</td>
                        <td><span class="bordered-value">${
                          costWorking.thickness_in_mm ?? ""
                        }</span></td>
                        <td colspan="2"></td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>

        <div class="first-table">
          <h2></h2>
          <table>
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Item</th>
                <th>HSN Code</th>
                <th>Qty/M²</th>
                <th>Unit</th>
                <th>Qty. for Total Area (in SqM)</th>
                <th>Std Pak</th>
                <th>Basic Rate</th>
                <th>Basic Amount</th>
              </tr>
            </thead>
            <tbody>
      <tr class="section-header-row">
        <td class="leftmove">A-</td>
        <td class="leftmove" colspan="8">Material Cost</td>
      </tr>
            ${productRowsHTML}
  
              <tr class="total-row">
                <td colspan="6" class="rightmove">Total Material Basic Cost</td>
                <td  class="rightmove">A</td>
                <td  class="rightmove">Rs.</td>
                <td class="rightmove">${totalMaterialCost.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="6" class="rightmove">Per Sq. Mtr. Material Cost</td>
                <td  class="rightmove">A</td>
                <td  class="rightmove">Per Sq Mtr.</td>
                <td class="rightmove">${cost_persqrtmt}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="second-table">
          <h2></h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th colspan="1" class="leftmove">Description</th>
                <th>Area</th>
                <th>Unit</th>
                <th>Amount</th>
              </tr>
               <tr>
                <th class="leftmove">B- </th>
                <th class="leftmove">Cost as per project / Site condition</th>
                <th colspan="3"></th>
              </tr>
            </thead>
            <tbody>

              <tr class="section-header">
                <td colspan="5" class="leftmove">B1- </td>
              </tr>
               ${labourCosts
                 .map(
                   (item) => `
              <tr class="data-row">
                <td class="leftmove"></td>
                <td colspan="1" class="leftmove">${item.desc}</td>
               <td class="rightmove">${item.area}</td>
                                <td class="rightmove">${item.unit}</td>
                                <td class="rightmove">${item.amount}</td>
              </tr>
                `
                 )
                 .join("")}
             
              <tr class="total-row">
                <td  class="leftmove"></td>
                <td colspan="1" class="leftmove">B1 - Total:</td>
                <td class="rightmove">${totalAreaCost.toFixed(2)}</td>
                <td></td>
                <td class="rightmove">${totalLabourCost.toFixed(2)}</td>
              </tr>
              <tr class="section-header">
                <td colspan="5" class="leftmove">B2</td>
              </tr>
              <tr class="highlight-row">
                <td class="leftmove"></td>
                <td colspan="1" class="leftmove">Finance cost</td>
                <td class="rightmove">${
                  costWorking.finance_cost_month ?? ""
                }</td>
                <td class="rightmove">${
                  (costWorking.finance_cost_persantage || 0) + "%"
                }</td>
                <td class="rightmove">${FinanceCost}</td>
              </tr>
              <tr class="total-row orange-text">
                <td class="leftmove"></td>
                <td colspan="1" class="leftmove">Total Cost:</td>
                <td class="rightmove">b2</td>
                <td class="rightmove">M2</td>
                <td class="rightmove">${TotalFinanceCost.toFixed(2)}</td>
              </tr>
              <tr class="section-header">
                <td colspan="5" class="leftmove">B3</td>
              </tr>
              <tr class="highlight-row">
                <td  class="leftmove"></td>
                <td colspan="1" class="leftmove">Over Head Charges</td>
                <td class="rightmove">${
                  costWorking.over_head_charges_area || ""
                }</td>
                <td class="rightmove">${
                  costWorking.over_head_charges_persantage || ""
                }%</td>
                <td class="rightmove">${overhead_charges}</td>
              </tr>
              <tr class="total-row orange-text">
                <td  class="leftmove"></td>
                <td colspan="1" class="leftmove">Total application ( Labour) cost:</td>
                <td>=(B1+B2+B3)</td>
                <td class="rightmove">M2</td>
                <td class="red-fill rightmove">${total_application_labour_cost}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="third-table">
          <table>
            <thead>
              <tr>
                <th></th>
                <th colspan="1" class="leftmove">Total</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Total Project Cost Rs</th>
              </tr>
              <tr>
                <th class="leftmove">C- </th>
                <th colspan="4" class="leftmove">Project Calculation</th>
                
              </tr>
            </thead>
            <tbody>
             ${projectCalculations
               .map(
                 (item) => `
              <tr>
                <td class="leftmove"></td>
                <td colspan="1" class="leftmove">${item.total}</td>
                 <td>${item.unit}</td>
                                <td>${item.qty}</td>
                                <td class="rightmove">${item.totalProjectCost}</td>
              </tr>
              `
               )
               .join("")}
             
              <tr class="total-row">
                <td class="leftmove"></td>
                <td colspan="1" class="leftmove">Total Project Cost :</td>
                <td>A+B+C</td>
                <td></td>
                <td class="rightmove">${total_project_cost}</td>
              </tr>
              <tr
                class="total-row"
                style="background-color: #fff0e0; color: orange"
              > <td class="leftmove"></td>
                <td colspan="1" class="leftmove">Total Project Cost Per M2 :</td>
                <td class="colorchnage">M2</td>
                <td></td>
                <td class="colorchnage rightmove">${final_cost_persqrtmt}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="note-data">
          <h2>Note</h2>
          <div
            style="
              background-color: #ffffffcc;
              padding: 10px;
              border: 1px solid #ccc;
              font-size:13px;
            "
          >
          ${
            costWorking?.notes?.trim() !== ""
              ? costWorking.notes
                  .split("\n")
                  .map((line, index) => `<div>${line.trim()}</div>`)
                  .join("")
              : "<div>No additional notes provided.</div>"
          }

          </div>
        </div>

        <div style="margin-top: 50px">
          <h3>For Dimple Chemicals & Services Pvt. Ltd.</h3>
          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              font-size:13px;
            "
          >
            <div class="approval-box">
              <div
                style="
                  background-color: lightgrey;
                  font-weight: bold;
                  padding: 5px;
                "
              >
                Approved By
              </div>
              <div
                style="padding: 5px; height: 30px"
              >
                ${costWorking.approved_by ?? ""}
              </div>
            </div>
            <div class="approval-box">
              <div
                style="
                  background-color: lightgrey;
                  font-weight: bold;
                  padding: 5px;
                "
              >
                Checked By
              </div>
              <div
                style="padding: 5px; height: 30px"
              >
               ${costWorking.checked_by ?? ""}
              </div>
            </div>
            <div class="approval-box">
              <div
                style="
                  background-color: lightgrey;
                  font-weight: bold;
                  padding: 5px;
                "
              >
                DCPL Representative
              </div>
              <div
                style="padding: 5px; height: 30px"
              >
               ${costWorking.dcpl_representative ?? ""}
              </div>
            </div>
            <div class="approval-box">
              <div
                style="
                  background-color: lightgrey;
                  font-weight: bold;
                  padding: 5px;
                "
              >
                Prepared By
              </div>
              <div
                style="padding: 5px; height: 30px"
              >
                ${costWorking.prepared_by ?? ""}
              </div>
            </div>
          </div>
        </div>
      </div>
 </body>
</html>`;

    // --- File Path Setup (moved to ensure consistency and correct order) ---
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];

    const fileName = `Cost_Working_Report_${timestamp}.pdf`;
    const exportsDir = path.join(__dirname, "../pdfs"); // Using 'exports' as discussed, adjust if you prefer 'pdfs'
    if (!fs.existsSync(exportsDir)) {
      console.log(`Creating directory for PDFs: ${exportsDir}`);
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    const filePath = path.join(exportsDir, fileName);
    // --- End File Path Setup ---

    // --- Puppeteer Logic ---
    browser = await puppeteer.launch({ headless: true });

    //         const browser = await puppeteer.launch({
    //   headless: true,
    //   executablePath: '/root/.cache/puppeteer/chrome/linux-138.0.7204.168/chrome-linux64/chrome',
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });

    // headless: 'new' is often preferred for newer versions
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" }); // Wait for page to fully load

    console.log(`[DEBUG] Attempting to save PDF to: ${filePath}`); // Debug log for file path

    await page.pdf({
      path: filePath, // Saves the PDF to the specified path
      format: "A4",
      printBackground: true,
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
    });

    console.log(`[DEBUG] PDF successfully created at: ${filePath}`); // Debug log for successful creation

    await browser.close(); // Close browser immediately after PDF creation
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");
    // --- File Download and Cleanup ---
    // Use res.download to send the file to the client and then delete it.
    res.sendFile(filePath, fileName, (err) => {
      if (err) {
        console.error("File download error:", err);
        // If download fails, still try to unlink to clean up
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr)
              console.error(
                "Error deleting file after failed download:",
                unlinkErr
              );
          });
        }
        res.status(500).json({
          success: false,
          message: "Failed to download PDF file",
          error: err.message,
        });
      } else {
        console.log(
          `PDF file "${fileName}" sent for download. Removing from server.`
        );
        // If download succeeds, delete the file
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr)
              console.error(
                "Error deleting file after successful download:",
                unlinkErr
              );
          });
        }
      }
    });
  } catch (error) {
    console.error("Error exporting cost working to PDF:", error);
    // Ensure browser is closed even if an error occurs
    if (browser) {
      await browser.close();
    }
    res.status(500).json({
      success: false,
      message: "Internal server error during PDF export",
      error: error.message,
    });
  }
};

module.exports = {
  createCostWorking,
  getCostWorking,
  updateCostWorking,
  exportCostWorkingListToExcel,
  getNextEstimateNo,
  exportCostWorkingByIdToExcel,
  //exportCostWorkingByIdToPDF,
  exportCostWorkingByIdToPDFWithHTML,
  //exportCostWorkingByIdToPDF
};
