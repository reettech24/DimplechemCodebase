"use strict";

const {
  LocalExpense,
  LocalExpenseDetail,
  sequelize,
  User,
} = require("../models");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { Op, Model, Sequelize} = require("sequelize");
const puppeteer = require("puppeteer");

// 📌 Create Local Expense with Details
exports.addLocalExpense = async (req, res) => {
  const {
    employee_id,
    period_of_expenses,
    place_of_visit,
    bank_account_no,
    details,

    // New fields
    prepared_by,
    checked_by,
    approved_by,
    recon_of_bank_ac,
    bank_ac_limit,
    petty_cash_sub_on,
    petty_cash_pending_for_reload,
    balance_on_bank_ac,
    cash_in_hand,
    diff,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const expense = await LocalExpense.create(
      {
        employee_id,
        period_of_expenses,
        place_of_visit,
        bank_account_no,
        status: 1,
        prepared_by,
        checked_by,
        approved_by,
        recon_of_bank_ac,
        bank_ac_limit,
        petty_cash_sub_on,
        petty_cash_pending_for_reload,
        balance_on_bank_ac,
        cash_in_hand,
        diff,
      },
      { transaction }
    );

    if (details && details.length > 0) {
      for (const item of details) {
        const total =
          parseFloat(item.travelling_exp || 0) +
          parseFloat(item.loading_boarding || 0) +
          parseFloat(item.printing_stationery || 0) +
          parseFloat(item.food_expenses || 0) +
          parseFloat(item.company_car_exp || 0) +
          parseFloat(item.purchases || 0) +
          parseFloat(item.other || 0);

        await LocalExpenseDetail.create(
          {
            local_expense_id: expense.id,
            date: item.date,
            particulars: item.particulars,
            travelling_exp: item.travelling_exp,
            loading_boarding: item.loading_boarding,
            printing_stationery: item.printing_stationery,
            food_expenses: item.food_expenses,
            company_car_exp: item.company_car_exp,
            purchases: item.purchases,
            other: item.other,
            total: total.toFixed(2),
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "Local Expense created successfully",
      data: expense,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to create Local Expense",
      error: error.message,
    });
  }
};

// 📌 Update Local Expense with Details
exports.updateLocalExpense = async (req, res) => {
  const { id } = req.params;
  const {
    employee_id,
    period_of_expenses,
    place_of_visit,
    bank_account_no,
    details,
    // New fields
    prepared_by,
    checked_by,
    approved_by,
    recon_of_bank_ac,
    bank_ac_limit,
    petty_cash_sub_on,
    petty_cash_pending_for_reload,
    balance_on_bank_ac,
    cash_in_hand,
    diff,
  } = req.body;

  const transaction = await sequelize.transaction();

  try {
    await LocalExpense.update(
      {
        employee_id,
        period_of_expenses,
        place_of_visit,
        bank_account_no,
        status: 1,
        prepared_by,
        checked_by,
        approved_by,
        recon_of_bank_ac,
        bank_ac_limit,
        petty_cash_sub_on,
        petty_cash_pending_for_reload,
        balance_on_bank_ac,
        cash_in_hand,
        diff,
      },
      { where: { id }, transaction }
    );

    await LocalExpenseDetail.destroy({
      where: { local_expense_id: id },
      transaction,
    });

    if (details && details.length > 0) {
      for (const item of details) {
        const total =
          parseFloat(item.travelling_exp || 0) +
          parseFloat(item.loading_boarding || 0) +
          parseFloat(item.printing_stationery || 0) +
          parseFloat(item.food_expenses || 0) +
          parseFloat(item.company_car_exp || 0) +
          parseFloat(item.purchases || 0) +
          parseFloat(item.other || 0);
        await LocalExpenseDetail.create(
          {
            local_expense_id: id,
            date: item.date,
            particulars: item.particulars,
            travelling_exp: item.travelling_exp,
            loading_boarding: item.loading_boarding,
            printing_stationery: item.printing_stationery,
            food_expenses: item.food_expenses,
            company_car_exp: item.company_car_exp,
            purchases: item.purchases,
            other: item.other,
            total: total.toFixed(2),
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    res
      .status(200)
      .json({ success: true, message: "Local Expense updated successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Failed to update Local Expense",
      error: error.message,
    });
  }
};

// 📌 Get All Local Expenses with Details (with pagination + search)
exports.getLocalExpenses = async (req, res) => {
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
      status: 1,
    };
    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { place_of_visit: { [Op.like]: `%${search}%` } },
          Sequelize.where(Sequelize.col("employee.fullname"), {
            [Op.like]: `%${search}%`,
          }),
        ],
      };
    }

    const { count, rows } = await LocalExpense.findAndCountAll({
      where: whereCondition,
      include: [
        { model: LocalExpenseDetail, as: "details" },
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname"],
          required: false,
        },
      ],
      order: [[sortBy, order]],
      offset,
      limit: parseInt(limit),
      distinct: true,
      subQuery: false,
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
      message: "Failed to fetch Local Expenses",
      error: error.message,
    });
  }
};

// 📌 Get Single Local Expense by ID
exports.getLocalExpenseById = async (req, res) => {
  try {
    const expense = await LocalExpense.findByPk(req.params.id, {
      include: [
        { model: LocalExpenseDetail, as: "details" },
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname"],
        },
      ],
    });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Local Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Local Expense",
      error: error.message,
    });
  }
};

// 📌 Delete Local Expense (soft delete by status)
exports.deleteLocalExpense = async (req, res) => {
  try {
    const expense = await LocalExpense.findByPk(req.params.id);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Local Expense not found" });
    }

    // ✅ Soft delete by setting status = 0
    await expense.update({ status: 0 });

    res
      .status(200)
      .json({ success: true, message: "Local Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete Local Expense",
      error: error.message,
    });
  }
};

// 📌 Export Local Expenses to Excel
exports.exportLocalExpensesToExcel = async (req, res) => {
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
      status: 1,
    };

    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [{ place_of_visit: { [Op.like]: `%${search}%` } },
        Sequelize.where(Sequelize.col("employee.fullname"), {
                      [Op.like]: `%${search}%`,
                    }),],
      };
    }

    const expenses = await LocalExpense.findAll({
      where: whereCondition,
      order: [["id", "ASC"]],
      include: [
        { model: LocalExpenseDetail, as: "details" },
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname"],
          required: false,
        },
      ],
      order: [[sortBy, order]],
      offset,
      limit: parseInt(limit),
      distinct: true,
      subQuery: false,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Local Expense Report");

    worksheet.columns = [
      { header: "Expense ID", key: "id", width: 10 },
      { header: "Employee Name", key: "employee_name", width: 25 },
      { header: "Period of Expenses", key: "period_of_expenses", width: 20 },
      { header: "Place of Visit", key: "place_of_visit", width: 20 },
      { header: "Bank A/C No", key: "bank_account_no", width: 20 },
      { header: "Total", key: "total", width: 20 },
    ];

    expenses.forEach((expense) => {
      const totalSum = expense.details.reduce((sum, item) => {
        return sum + parseFloat(item.total || 0);
      }, 0);
      worksheet.addRow({
        id: expense.id,
        employee_name: expense.employee.fullname,
        period_of_expenses: expense.period_of_expenses,
        place_of_visit: expense.place_of_visit,
        bank_account_no: expense.bank_account_no,
        total: totalSum.toFixed(2),
      });
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      __dirname,
      `../exports/LocalExpenses_Report_${timestamp}.xlsx`
    );

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await workbook.xlsx.writeFile(filePath);
    return res.download(filePath, "LocalExpenses_Report.xlsx");
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportLocalExpensessByIdToPDFWithHTML = async (req, res) => {
  let browser; // Declare browser variable here so it's accessible in finally block
  try {
    const { id } = req.params;

    const getLocalExpenseById = await LocalExpense.findOne({
      where: { id },
      include: [
        {
          model: LocalExpenseDetail,
          as: "details",
        },
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname"],
        },
      ],
    });

    if (!getLocalExpenseById) {
      return res
        .status(404)
        .json({ success: false, message: "expenses record not found" });
    }

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB");
    };

    const totals = {
      travelling_exp: 0,
      loading_boarding: 0,
      printing_stationery: 0,
      food_expenses: 0,
      company_car_exp: 0,
      purchases: 0,
      other: 0,
      grand_total: 0,
    };

    getLocalExpenseById.details.forEach((item) => {
      const travelling_exp = parseFloat(item.travelling_exp || 0);
      const loading_boarding = parseFloat(item.loading_boarding || 0);
      const printing_stationery = parseFloat(item.printing_stationery || 0);
      const food_expenses = parseFloat(item.food_expenses || 0);
      const company_car_exp = parseFloat(item.company_car_exp || 0);
      const purchases = parseFloat(item.purchases || 0);
      const other = parseFloat(item.other || 0);

      const rowTotal =
        travelling_exp +
        loading_boarding +
        printing_stationery + // Corrected typo here from original code: printing_stationy -> printing_stationery
        food_expenses +
        company_car_exp +
        purchases +
        other;

      totals.travelling_exp += travelling_exp;
      totals.loading_boarding += loading_boarding;
      totals.printing_stationery += printing_stationery;
      totals.food_expenses += food_expenses;
      totals.company_car_exp += company_car_exp;
      totals.purchases += purchases;
      totals.other += other;
      totals.grand_total += rowTotal;
    });
    // --- NEW CALCULATIONS (from user's input) ---

    let totalRow = `
  <tr>
    <td colspan="2"></td>
    <td>Total:</td>
    ${[
      "travelling_exp",
      "loading_boarding",
      "printing_stationery",
      "food_expenses",
      "company_car_exp",
      "purchases",
      "other",
    ]
      .map((field) => {
        const total = getLocalExpenseById?.details?.reduce(
          (sum, curr) => sum + parseFloat(curr[field] || 0),
          0
        );
        return `<td>${total.toFixed(2)}</td>`;
      })
      .join("")}
    <td>
      ${getLocalExpenseById?.details
        ?.reduce(
          (sum, curr) =>
            sum +
            parseFloat(curr.travelling_exp || 0) +
            parseFloat(curr.loading_boarding || 0) +
            parseFloat(curr.printing_stationery || 0) +
            parseFloat(curr.food_expenses || 0) +
            parseFloat(curr.company_car_exp || 0) +
            parseFloat(curr.purchases || 0) +
            parseFloat(curr.other || 0),
          0
        )
        .toFixed(2)}
    </td>
  </tr>
`;

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>DIMPLE CHEMICALS & SERVICES PVT LTD - EXPENSES STATEMENT</title>
    <!-- Embed Poppins font -->
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
      .info-table,
      .data-table,
      .approvals-table,
      .reconciliation-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        table-layout: fixed;
        border: 1px solid gray;
      }
      .info-table td,
      .reconciliation-table td,  .info-table,
      .data-table,
      .approvals-table,
      .reconciliation-tabl
      .approvals-table td,
      .data-table td,
      .data-table th {
        padding: 0.5rem 1rem;
        border: 1px solid gray;
        font-size:9px;
      }
     
     
      .data-table thead {
        background-color: #9da3af;
      }
      .data-table th {
        font-weight: 500;
        font-size: 8px;
        text-align: center;
      }
      .data-table td {
        font-size: 8px;
        text-align: center;
      }
      
    
      
      .signature-box {
        margin-top: 0.25rem;
        color: #374151;
        white-space: pre-line;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        padding: 0.5rem;
        background-color: #f9fafb;
        min-height: 80px;
      }
      h1 {
        font-size:15px;
        font-weight: bold;
        color: #1a202c;
        text-align: center;
        margin: 0;
        padding: 0.5rem;
      }
    </style>
  </head>
  <body>
    <div class="main-wrapper">
      <div class="container">
        <h4 class="header">
          DIMPLE CHEMICALS & SERVICES PVT LTD<br />
          <span>OUTSTATION / LOCAL EXPENSES STATEMENT</span>
        </h4>
        <div class="content-border">
          <table class="info-table">
            <tbody>
              <tr>
                <td>Name of Employee</td>
                <td>${getLocalExpenseById?.employee?.fullname || "-"}</td>
              </tr>
              <tr>
                <td>Period of Expenses</td>
                <td>${getLocalExpenseById?.period_of_expenses || "-"}</td>
              </tr>
              <tr>
                <td>Place of Visit</td>
                <td>${getLocalExpenseById?.place_of_visit || "-"}</td>
              </tr>
              <tr>
                <td>Bank A/C No.</td>
                <td>${getLocalExpenseById?.bank_account_no || "-"}</td>
              </tr>
            </tbody>
          </table><table class="data-table">
            <thead>
              <tr>
                <th style="width:10px">S.N.</th>
                <th style="width:30px">Date</th>
                <th>Particulars</th>
                <th>Travelling Exp.</th>
                <th>Loading & Boarding</th>
                <th>Printing & Stationery</th>
                <th>Food Expenses</th>
                <th>Company Car Exp.</th>
                <th>Purchases</th>
                <th>Other</th>
                <th>Total</th>
                </tr>
            </thead>
            <tbody>
              ${getLocalExpenseById.details
                .map((item, index) => {
                  const rowTotal =
                    parseFloat(item.travelling_exp || 0) +
                    parseFloat(item.loading_boarding || 0) +
                    parseFloat(item.printing_stationery || 0) +
                    parseFloat(item.food_expenses || 0) +
                    parseFloat(item.company_car_exp || 0) +
                    parseFloat(item.purchases || 0) +
                    parseFloat(item.other || 0);
                  return `<tr><td>${index + 1}</td>
                    <td>${formatDate(item?.date)}</td>
                    <td>${item?.particulars || "-"}</td>
                    <td>${item?.travelling_exp || 0}</td>
                    <td>${item?.loading_boarding || 0}</td>
                    <td>${item?.printing_stationery || 0}</td>
                    <td>${item?.food_expenses || 0}</td>
                    <td>${item?.company_car_exp || 0}</td>
                    <td>${item?.purchases || 0}</td>
                    <td>${item?.other || 0}</td>
                    <td>${rowTotal.toFixed(2)}</td>
                  </tr>`;
                })
                .join("")}

                ${totalRow}
            </tbody>
          </table>
          <table class="reconciliation-table">
            <tbody>
              <tr><td colspan="3"><h4>Reconciliation of Bank A/c</h4></td></tr>
              <tr>
                <td colspan="2">Bank A/C Limit</td>
                <td>${getLocalExpenseById?.bank_ac_limit || "-"}</td>
              </tr>
              <tr>
                <td colspan="2">Petty Cash Submitted On</td>
                <td>${getLocalExpenseById?.petty_cash_sub_on || "-"}</td>
              </tr>
              <tr>
                <td colspan="2">Petty Cash Pending for Reload</td>
                <td>${
                  getLocalExpenseById?.petty_cash_pending_for_reload || "-"
                }</td>
              </tr>
              <tr>
                <td colspan="2">Cash in Hand</td>
                <td>${getLocalExpenseById?.cash_in_hand || "-"}</td>
              </tr>
              <tr>
                <td colspan="2">Balance on Bank A/C</td>
                <td>${getLocalExpenseById?.balance_on_bank_ac || "-"}</td>
              </tr>
              <tr>
                <td colspan="2">Difference</td>
                <td>${getLocalExpenseById?.diff || "-"}</td>
              </tr>
            </tbody>
          </table>
           <table class="approvals-table" style="margin-top: 2rem;">
            <tr>
              <td>
                Prepared By
                <div class="signature-box">${
                  getLocalExpenseById?.prepared_by || "-"
                }</div>
              </td>
              <td>
                Checked By
                <div class="signature-box">${
                  getLocalExpenseById?.checked_by || "-"
                }</div>
              </td>
              <td>
                Approved By
                <div class="signature-box">${
                  getLocalExpenseById?.approved_by || "-"
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

    const fileName = `Local_Expense_${
      getLocalExpenseById.employee?.fullname || "report"
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
