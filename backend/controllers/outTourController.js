const {
  OutTour,
  OutTourDetail,
  OutTourExpense,
  sequelize,
  User,
} = require("../models");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { Op, Sequelize } = require("sequelize");
const puppeteer = require("puppeteer");

// 📌 Add OutTour with Details & Expenses
exports.addOutTour = async (req, res) => {
  const {
    employee_id,
    person_accompanied,
    place_of_visit,
    period_of_visit_from_date,
    period_of_visit_to_date,
    prepared_by,
    approved_by,
    details,
    expenses,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const fromDate = new Date(period_of_visit_from_date);
    const toDate = new Date(period_of_visit_to_date);
    const diffInDays =
      Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    // ✅ Sum of expenses
    let totalExpenses = 0;
    if (expenses && expenses.length > 0) {
      totalExpenses = expenses.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      );
    }

    const outTour = await OutTour.create(
      {
        employee_id,
        person_accompanied,
        place_of_visit,
        period_of_visit: diffInDays,
        period_of_visit_from_date,
        period_of_visit_to_date,
        prepared_by,
        approved_by,
        total_expenses: totalExpenses,
        status: 1,
      },
      { transaction }
    );

    // Add visit details
    if (details && details.length > 0) {
      for (const item of details) {
        await OutTourDetail.create(
          {
            out_tour_id: outTour.id,
            date: item.date,
            place_of_visit: item.place_of_visit,
            purpose: item.purpose,
          },
          { transaction }
        );
      }
    }

    // Add expenses
    if (expenses && expenses.length > 0) {
      for (const item of expenses) {
        await OutTourExpense.create(
          {
            out_tour_id: outTour.id,
            description: item.description,
            amount: item.amount,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Out Tour created successfully",
      out_tour_id: outTour.id,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to create Out Tour",
      error: error.message,
    });
  }
};

exports.updateOutTour = async (req, res) => {
  const { id } = req.params;
  const {
    employee_id,
    person_accompanied,
    place_of_visit,
    period_of_visit_from_date,
    period_of_visit_to_date,
    prepared_by,
    approved_by,
    details,
    expenses,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const fromDate = new Date(period_of_visit_from_date);
    const toDate = new Date(period_of_visit_to_date);
    const diffInDays =
      Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    // ✅ Calculate total expenses
    let totalExpenses = 0;
    if (expenses && expenses.length > 0) {
      totalExpenses = expenses.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      );
    }

    // Update main out tour
    await OutTour.update(
      {
        employee_id,
        person_accompanied,
        place_of_visit,
        period_of_visit: diffInDays,
        period_of_visit_from_date,
        period_of_visit_to_date,
        prepared_by,
        approved_by,
        total_expenses: totalExpenses,
      },
      {
        where: { id },
        transaction,
      }
    );

    // Delete existing details and expenses for this tour
    await OutTourDetail.destroy({ where: { out_tour_id: id }, transaction });
    await OutTourExpense.destroy({ where: { out_tour_id: id }, transaction });

    // Recreate details
    if (details && details.length > 0) {
      for (const item of details) {
        await OutTourDetail.create(
          {
            out_tour_id: id,
            date: item.date,
            place_of_visit: item.place_of_visit,
            purpose: item.purpose,
          },
          { transaction }
        );
      }
    }

    // Recreate expenses
    if (expenses && expenses.length > 0) {
      for (const item of expenses) {
        await OutTourExpense.create(
          {
            out_tour_id: id,
            description: item.description,
            amount: item.amount,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Out Tour updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to update Out Tour",
      error: error.message,
    });
  }
};

// 📌 Get All Out Tours (with Details & Expenses)
exports.getOutTours = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where condition if search is present
    let whereCondition = {
      status: 1, // add status = 1 condition here
    };

    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { place_of_visit: { [Op.like]: `%${search}%` } },
          { person_accompanied: { [Op.like]: `%${search}%` } },
          Sequelize.where(Sequelize.col("employee.fullname"), {
                      [Op.like]: `%${search}%`,
                    }),
        ],
      };
    }

    // Fetch count and paginated data
    const { count, rows } = await OutTour.findAndCountAll({
      where: whereCondition,
      include: [
        { model: OutTourDetail, as: "details" },
        { model: OutTourExpense, as: "expenses" },
        { model: User, as: "employee",required: false,},
      ],
      order: [[sortBy, order]],
      offset,
      limit: parseInt(limit),
      distinct: true,
      subQuery: false, // Important for proper pagination count with includes
    });

    res.status(200).json({
      success: true,
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Out Tours",
      error: error.message,
    });
  }
};

// 📌 Get Single Out Tour by ID
exports.getOutTourById = async (req, res) => {
  try {
    const outTour = await OutTour.findByPk(req.params.id, {
      include: [
        { model: OutTourDetail, as: "details" },
        { model: OutTourExpense, as: "expenses" },
        { model: User, as: "employee" },
      ],
    });

    if (!outTour) {
      return res
        .status(404)
        .json({ success: false, message: "Out Tour not found" });
    }

    res.status(200).json({ success: true, data: outTour });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Out Tour",
      error: error.message,
    });
  }
};

// 📌 Delete Out Tour (and cascade delete details & expenses)
exports.deleteOutTour = async (req, res) => {
  try {
    const outTour = await OutTour.findByPk(req.params.id);
    if (!outTour) {
      return res.status(404).json({
        success: false,
        message: "Out Tour not found",
      });
    }

    // ✅ Soft delete by setting status = 0
    await outTour.update({ status: 0 });

    res.status(200).json({
      success: true,
      message: "Out Tour soft-deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Out Tour",
      error: error.message,
    });
  }
};

//out tour expensess export
exports.exportOutToursToExcel = async (req, res) => {
  try {
      const {
      search = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);


    let whereCondition = {
      status: 1, // add status = 1 condition here
    };

    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { place_of_visit: { [Op.like]: `%${search}%` } },
          { person_accompanied: { [Op.like]: `%${search}%` } },
          Sequelize.where(Sequelize.col("employee.fullname"), {
                      [Op.like]: `%${search}%`,
                    }),
        ],
      };
    }

    // Fetch all Out Tours with related details
    const outTours = await OutTour.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
      include: [
        { model: OutTourDetail, as: "details" },
        { model: OutTourExpense, as: "expenses" },
        { model: User, as: "employee",required: false, },
      ],
      order: [[sortBy, order]],
      offset,
      limit: parseInt(limit),
      distinct: true,
      subQuery: false,
    });

    // Prepare Excel workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Out Tour Report");

    // Define columns
    worksheet.columns = [
      { header: "OutTour ID", key: "id", width: 12 },
      { header: "Employee Name", key: "employee_name", width: 25 },
      { header: "Place of Visit", key: "place_of_visit", width: 20 },
      { header: "Person Accompanied", key: "person_accompanied", width: 25 },
      { header: "Period of Visit (Days)", key: "period_of_visit", width: 20 },
      { header: "Amount", key: "total_expenses", width: 50 },
    ];

    // Add data rows
    outTours.forEach((tour) => {
      worksheet.addRow({
        id: tour.id,
        employee_name: tour.employee?.fullname || "",
        place_of_visit: tour.place_of_visit,
        person_accompanied: tour.person_accompanied,
        period_of_visit: tour.period_of_visit,
        total_expenses: tour.total_expenses,
      });
    });

    // Generate file path
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      __dirname,
      `../exports/OutTours_Report_${timestamp}.xlsx`
    );

    // Remove old file if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Save workbook
    await workbook.xlsx.writeFile(filePath);

    // Download the file
    return res.download(filePath, "OutTours_Report.xlsx", (err) => {
      if (err) {
        console.error("Download failed:", err);
        return res
          .status(500)
          .json({ success: false, message: "Download failed" });
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("File deletion failed:", unlinkErr);
        } else {
          console.log("File deleted after download:", filePath);
        }
      });
    });
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportOutTourExpensessByIdToPDFWithHTML = async (req, res) => {
  let browser; // Declare browser variable here so it's accessible in finally block
  try {
    const { id } = req.params;

    const outTourDataById = await OutTour.findOne({
      where: { id },
      include: [
        {
          model: OutTourDetail,
          as: "details",
        },
        { model: OutTourExpense, as: "expenses" },
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname"],
        },
      ],
    });

    if (!outTourDataById) {
      return res
        .status(404)
        .json({ success: false, message: "expenses record not found" });
    }

    function formatDate(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
    }

    //console.log("outTourDataById",outTourDataById);
    // --- NEW CALCULATIONS (from user's input) ---

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>DIMPLE CHEMICALS & SERVICES PVT LTD - OUT TOUR EXPENSES</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet" />
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
      }
      .main-wrapper {
        width: 100%;
        margin: 10px;
        border-radius: 8px;
        overflow: hidden;
      }
      .container {
        padding: 1rem;
        background-color: #ffffff;
        border-radius: 0 0 8px 8px;
      }
      .header {
        margin-bottom: 0;
        color: black;
        background-color: #9da3af;
        padding: 0.5rem;
        border-radius: 4px 4px 0 0;
        font-weight: 500;
        font-size: 13px;
        text-align: center;
        margin-top: 20px;
      }
      .header span {
        color: #4b5563;
        font-size: 11px;
      }
      .content-border {
        border: 1px solid #9da3af;
        padding-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        table-layout: fixed;
        border: 1px solid gray;
        margin-bottom: 1rem;
      }
      th, td {
        padding: 0.5rem 1rem;
        border: 1px solid gray;
        font-size: 9px;
        text-align: center;
      }
      th {
        background-color: #9da3af;
        color: white;
        font-weight: 500;
        font-size: 8px;
      }
      .signature-box {
       

  margin-top: 0.25rem;         /* Tailwind: mt-1 */
  color: #1f2937;              /* Tailwind: text-gray-800 */
  white-space: pre-line;       /* Tailwind: whitespace-pre-line */
  border: 1px solid #d1d5db;   /* Tailwind: border border-gray-300 */
  border-radius: 0.25rem;      /* Tailwind: rounded */
  padding: 0.5rem;             /* Tailwind: p-2 */
  background-color: #f9fafb;   /* Tailwind: bg-gray-50 */
  min-height: 120px;
      }
      h4.section-heading {
        background-color: #e5e7eb;
        padding: 6px;
        font-size: 11px;
        text-align: center;
        border: 1px solid #9da3af;
        margin-bottom: 0.5rem;
        border-radius: 4px;
      }
      .total-row td {
        font-weight: bold;
        color: orange;
        background-color: #f3f4f6;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <div class="main-wrapper">
      <div class="container">
        <h4 class="header">
          DIMPLE CHEMICALS & SERVICES PVT LTD<br />
          <span>OUT TOUR EXPENSES STATEMENT</span>
        </h4>

        <div class="content-border">
          <!-- Basic Info -->
          <table>
            <tbody>
              <tr>
                <td>Name of Employee</td>
                <td>${outTourDataById?.employee?.fullname || "-"}</td>
              </tr>
              <tr>
                <td>Person Accompanied</td>
                <td>${outTourDataById?.person_accompanied || "-"}</td>
              </tr>
              <tr>
                <td>Place of Visit</td>
                <td>${outTourDataById?.place_of_visit || "-"}</td>
              </tr>
              <tr>
                <td>Period of Visit (Days)</td>
                <td>${outTourDataById?.period_of_visit || "-"}</td>
              </tr>
            </tbody>
          </table>

          <!-- Details of Visit -->
          <h4 class="section-heading">Details of Visit<br/>
          <span>Expected Potential (In Rupees)</span></h4>
          <table>
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Date</th>
                <th>Place of Visit</th>
                <th>Purpose of Visit</th>
              </tr>
            </thead>
            <tbody>
              ${outTourDataById?.details
                ?.map((item, index) => {
                  return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item?.date || "-"}</td>
                  <td>${item?.place_of_visit || "-"}</td>
                  <td>${item?.purpose || "-"}</td>
                </tr>`;
                })
                .join("")}
            </tbody>
          </table>

          <!-- Expenses Budget -->
          <h4 class="section-heading">Expenses Budget</h4>
          <table>
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${outTourDataById?.expenses
                ?.map((item, index) => {
                  return `
                <tr>
                  <td>${index + 1}</td>
                  <td style="text-align:left;">${item?.description || "-"}</td>
                  <td style="text-align:right;">${parseFloat(
                    item?.amount || 0
                  ).toFixed(2)}</td>
                </tr>`;
                })
                .join("")}
              <tr class="total-row">
                <td colspan="2">Total</td>
                <td>
                  ${outTourDataById?.expenses
                    ?.reduce(
                      (sum, item) => sum + parseFloat(item.amount || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Approvals -->
          <table>
            <tr>
              <td>
                Prepared By
                <div class="signature-box">${
                  outTourDataById?.prepared_by || "-"
                }</div>
                
              </td>
              <td>
                Approved By
                <div class="signature-box">${
                  outTourDataById?.approved_by || "-"
                }</div>
              </td>
            </tr>
          </table>
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

    const fileName = `OutTour_Expense_${
      outTourDataById.employee?.fullname || "report"
    }_${timestamp}.pdf`;
    const exportsDir = path.join(__dirname, "../expensess"); // Using 'exports' as discussed, adjust if you prefer 'pdfs'
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
    console.error("Error exporting local expensess to PDF:", error);
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
