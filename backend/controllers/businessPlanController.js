const {
  AnnualBusinessPlan,
  BusinessPlanProduct,
  CustomerContactPerson,
  BusinessAssociate,
  User,
  Product,
  Customer,
  Category,
  sequelize,
  Mytable,
} = require("../models");
const { Op, Sequelize } = require("sequelize");
const ExcelJS = require("exceljs");

exports.addAnnualBusinessPlan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      emp_id,
      customer_id,
      associate_id,
      contact_person_id,
      project_name,
      area_mtr2,
      buisness_potential,
      for_month,
      location,
      comment,
      products, // array of product objects
    } = req.body;

    const existingPlan = await AnnualBusinessPlan.findOne({
      where: {
        emp_id,
        customer_id,
        for_month,
      },
    });

    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message:
          "This report is already created for the selected employee and customer in the given month.",
      });
    }
    const cleanValue = (value) => {
      return value === "" ? null : value;
    };

    const plan = await AnnualBusinessPlan.create(
      {
        emp_id: cleanValue(emp_id),
        customer_id: cleanValue(customer_id),
        associate_id: cleanValue(associate_id),
        contact_person_id: cleanValue(contact_person_id),
        project_name: cleanValue(project_name),
        area_mtr2: cleanValue(area_mtr2),
        buisness_potential: cleanValue(buisness_potential),
        location: cleanValue(location),
        comment: cleanValue(comment),
        for_month: cleanValue(for_month),
      },
      { transaction: t }
    );

    for (const p of products) {
      await BusinessPlanProduct.create(
        {
          business_plan_id: plan.id,
          product_id: p.product_id,
          technology_used: p.technology_used,
          qty: p.qty,
          rate: p.rate,
          value_in_rs: p.value_in_rs,
          gst_amt: p.gst_amt,
          gross_sale_include_gst: p.gross_sale_include_gst,
          commission: p.commission,
          net_sale: p.net_sale,
          gst_percent: p.gst_percent,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({
      success: true,
      message: "Business plan and products added successfully",
      planId: plan.id,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to submit business plan" });
  }
};

exports.getAnnualBusinessPlanList = async (req, res) => {
  try {
    const empId = req.user.id;
    const roleId = req.user.userrole;
    const {
      page = 1,
      limit = 10,
      search = "",
      monthWise,
      anu_emp_id,
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (monthWise) {
      whereClause.for_month = Number(monthWise);
    }

    if (anu_emp_id) {
      whereClause.emp_id = Number(anu_emp_id);
    }

    if (roleId === 3) {
      whereClause.emp_id = empId;
    }

    if (search) {
      whereClause[Op.or] = [
        { project_name: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        Sequelize.where(Sequelize.col("customer.company_name"), {
          [Op.like]: `%${search}%`,
        }),
        Sequelize.where(Sequelize.col("employee.fullname"), {
          [Op.like]: `%${search}%`,
        }),
      ];
    }

    // Employee view (no group)
    if (roleId === 3) {
      const { count, rows } = await AnnualBusinessPlan.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
        subQuery: false,
        include: [
          {
            model: User,
            as: "employee",
            attributes: ["id", "username", "email", "emp_id", "fullname"],
          },
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "company_name", "email_id", "cust_id"],
          },
          {
            model: BusinessAssociate,
            as: "associate",
            attributes: ["id", "associate_name", "code", "email", "phone_no"],
          },
          {
            model: CustomerContactPerson,
            as: "contactPerson",
            attributes: ["id", "name", "email", "phone_no", "designation"],
          },
          {
            model: Mytable,
            as: "areaDetails",
            attributes: ["district", "statename"],
          },
          {
            model: BusinessPlanProduct,
            as: "products",
            include: [
              {
                model: Product,
                as: "product",
                attributes: [
                  "product_name",
                  ["category_id", "technology_used"],
                ],
              },
              // {
              //   model: Category,
              //   as: "category",
              //   attributes: ["id", "category_name"],
              // },
            ],
          },
        ],
      });

      return res.status(200).json({
        success: true,
        message: "Business plan list retrieved successfully",
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalRecords: count,
        data: rows,
      });
    }

    // if (roleId === 1) {
    //   // Total unique employee count
    //   const totalGroups = await AnnualBusinessPlan.count({
    //     where: whereClause,
    //     distinct: true,
    //     col: "emp_id",
    //   });

    //   // Paginated emp_ids
    //   const groupEmpIds = await AnnualBusinessPlan.findAll({
    //     attributes: ["emp_id"],
    //     where: whereClause,
    //     group: ["emp_id"],
    //     order: [
    //       [sequelize.literal("MAX(AnnualBusinessPlan.createdAt)"), "DESC"],
    //     ],
    //     limit: parseInt(limit),
    //     offset: parseInt(offset),
    //   });

    //   if (!groupEmpIds.length) {
    //     return res.status(200).json({
    //       success: true,
    //       message: "No business plans found",
    //       currentPage: parseInt(page),
    //       totalPages: Math.ceil(totalGroups / limit),
    //       totalRecords: totalGroups,
    //       data: [],
    //     });
    //   }

    //   const data = await Promise.all(
    //     groupEmpIds.map(async (group) => {
    //       const empId = group.emp_id;

    //       // Get one latest business plan record for this emp_id (keeping old includes)
    //       const singlePlan = await AnnualBusinessPlan.findOne({
    //         where: { ...whereClause, emp_id: empId },
    //         include: [
    //           {
    //             model: User,
    //             as: "employee",
    //             attributes: ["id", "username", "email", "emp_id", "fullname"],
    //           },
    //           {
    //             model: Customer,
    //             as: "customer",
    //             attributes: ["id", "company_name", "email_id", "cust_id"],
    //           },
    //           {
    //             model: BusinessAssociate,
    //             as: "associate",
    //             attributes: [
    //               "id",
    //               "associate_name",
    //               "code",
    //               "email",
    //               "phone_no",
    //             ],
    //           },
    //           {
    //             model: CustomerContactPerson,
    //             as: "contactPerson",
    //             attributes: ["id", "name", "email", "phone_no", "designation"],
    //           },
    //           {
    //             model: BusinessPlanProduct,
    //             as: "products",
    //             include: [
    //               {
    //                 model: Product,
    //                 as: "product",
    //                 attributes: ["product_name", "category_id"],
    //               },
    //               {
    //                 model: Category,
    //                 as: "category",
    //                 attributes: ["id", "category_name"],
    //               },
    //             ],
    //           },
    //         ],
    //         order: [["createdAt", "DESC"]],
    //       });

    //       // Collect all for_month values into an array for this emp_id
    //       const allMonths = await AnnualBusinessPlan.findAll({
    //         attributes: ["for_month"],
    //         where: { ...whereClause, emp_id: empId },
    //         order: [["createdAt", "DESC"]],
    //       });

    //       const forMonths = allMonths.map((p) => p.for_month);

    //       // Inject forMonths array into singlePlan data
    //       const planData = singlePlan.toJSON();
    //       planData.for_months = forMonths;

    //       return planData;
    //     })
    //   );

    //   return res.status(200).json({
    //     success: true,
    //     message: "Business plan list retrieved successfully",
    //     currentPage: parseInt(page),
    //     totalPages: Math.ceil(totalGroups / limit),
    //     totalRecords: totalGroups,
    //     data, // same shape as before
    //   });
    // }

    if (roleId === 1) {
      // Total unique (emp_id, customer_id) count
      const totalGroupsResult = await AnnualBusinessPlan.findAll({
        attributes: [
          [sequelize.col("emp_id"), "emp_id"],
          [sequelize.col("customer_id"), "customer_id"],
        ],
        where: whereClause,
        group: ["emp_id", "customer_id"],
      });

      const totalGroups = totalGroupsResult.length;

      // Paginated (emp_id, customer_id) pairs
      const groupEmpCustIds = await AnnualBusinessPlan.findAll({
        attributes: [
          [sequelize.col("emp_id"), "emp_id"],
          [sequelize.col("customer_id"), "customer_id"],
        ],
        where: whereClause,
        group: ["emp_id", "customer_id"],
        order: [
          [sequelize.literal("MAX(AnnualBusinessPlan.createdAt)"), "DESC"],
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      if (!groupEmpCustIds.length) {
        return res.status(200).json({
          success: true,
          message: "No business plans found",
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalGroups / limit),
          totalRecords: totalGroups,
          data: [],
        });
      }

      const data = await Promise.all(
        groupEmpCustIds.map(async (group) => {
          const empId = group.emp_id;
          const custId = group.customer_id;

          // Latest business plan record for this (emp_id, customer_id) pair
          const singlePlan = await AnnualBusinessPlan.findOne({
            where: { ...whereClause, emp_id: empId, customer_id: custId },
            include: [
              {
                model: User,
                as: "employee",
                attributes: ["id", "username", "email", "emp_id", "fullname"],
              },
              {
                model: Customer,
                as: "customer",
                attributes: ["id", "company_name", "email_id", "cust_id"],
              },
              {
                model: Mytable,
                as: "areaDetails",
                attributes: ["district", "statename"],
              },
              {
                model: BusinessAssociate,
                as: "associate",
                attributes: [
                  "id",
                  "associate_name",
                  "code",
                  "email",
                  "phone_no",
                ],
              },
              {
                model: CustomerContactPerson,
                as: "contactPerson",
                attributes: ["id", "name", "email", "phone_no", "designation"],
              },
              {
                model: BusinessPlanProduct,
                as: "products",
                include: [
                  {
                    model: Product,
                    as: "product",
                    attributes: ["product_name", "category_id"],
                  },
                  {
                    model: Category,
                    as: "category",
                    attributes: ["id", "category_name"],
                  },
                ],
              },
            ],
            order: [["createdAt", "DESC"]],
          });

          // Collect all for_month values for this (emp_id, customer_id)
          const allMonths = await AnnualBusinessPlan.findAll({
            attributes: ["for_month"],
            where: { ...whereClause, emp_id: empId, customer_id: custId },
            order: [["createdAt", "DESC"]],
          });

          const forMonths = allMonths.map((p) => p.for_month);

          // Attach for_months array to single plan data
          const planData = singlePlan.toJSON();
          planData.for_months = forMonths;

          return planData;
        })
      );

      return res.status(200).json({
        success: true,
        message: "Business plan list retrieved successfully",
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalGroups / limit),
        totalRecords: totalGroups,
        data, // unchanged shape
      });
    }
  } catch (error) {
    console.error("Error fetching business plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve business plan list",
      error: error.message,
    });
  }
};

exports.updateAnnualBusinessPlan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params; // ID from URL
    const {
      emp_id,
      customer_id,
      associate_id,
      contact_person_id,
      project_name,
      area_mtr2,
      buisness_potential,
      for_month,
      location,
      comment,
      products, // array of product objects
    } = req.body;

    // Check if the business plan exists
    const existingPlan = await AnnualBusinessPlan.findByPk(id);
    if (!existingPlan) {
      return res.status(404).json({ error: "Business plan not found" });
    }

    // Update the main plan details
    await existingPlan.update(
      {
        emp_id,
        customer_id,
        associate_id,
        contact_person_id,
        project_name,
        area_mtr2,
        buisness_potential,
        for_month,
        location,
        comment,
      },
      { transaction: t }
    );

    // Delete all existing products linked to this business plan
    await BusinessPlanProduct.destroy({
      where: { business_plan_id: id },
      transaction: t,
    });

    // Create new product entries
    for (const p of products) {
      await BusinessPlanProduct.create(
        {
          business_plan_id: id,
          product_id: p.product_id,
          technology_used: p.technology_used,
          qty: p.qty,
          rate: p.rate,
          value_in_rs: p.value_in_rs,
          gst_amt: p.gst_amt,
          gross_sale_include_gst: p.gross_sale_include_gst,
          commission: p.commission,
          net_sale: p.net_sale,
          gst_percent: p.gst_percent,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({
      success: true,
      message: "Business plan updated successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to update business plan" });
  }
};

exports.getAnnualBusinessPlanSummary = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const plans = await AnnualBusinessPlan.findAll({
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname"],
          where: search
            ? {
                fullname: {
                  [Op.like]: `%${search}%`,
                },
              }
            : undefined,
        },
        {
          model: BusinessPlanProduct,
          as: "products",
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_name"],
            },
          ],
        },
      ],
    });

    const employeeMap = new Map();

    for (const plan of plans) {
      const empId = plan.emp_id;
      const empFullname = plan.employee?.fullname || "Unknown";
      const customerId = plan.customer_id;

      // Get category name from the last product
      const categoryName =
        plan.products?.[plan.products.length - 1]?.category?.category_name ||
        "";

      if (!empId) continue;

      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          emp_id: empId,
          employee_fullname: empFullname,
          unique_customers: new Set(),
          total_area_mtr2: 0,
          total_buisness_potential: 0,
          category_names: new Set(),
        });
      }

      const entry = employeeMap.get(empId);
      if (customerId) entry.unique_customers.add(customerId);
      if (plan.area_mtr2) entry.total_area_mtr2 += plan.area_mtr2;
      if (plan.buisness_potential)
        entry.total_buisness_potential += plan.buisness_potential;
      entry.category_name = categoryName;
    }

    // Grand totals
    let grand_total_area_mtr2 = 0;
    let grand_total_buisness_potential = 0;

    const fullResult = Array.from(employeeMap.values()).map((emp) => {
      grand_total_area_mtr2 += emp.total_area_mtr2;
      grand_total_buisness_potential += emp.total_buisness_potential;

      return {
        emp_id: emp.emp_id,
        employee_fullname: emp.employee_fullname,
        unique_customers_count: emp.unique_customers.size,
        total_area_mtr2: emp.total_area_mtr2,
        total_buisness_potential: emp.total_buisness_potential,
        category_names: emp.category_name,
      };
    });

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedData = fullResult.slice(
      startIndex,
      startIndex + parseInt(limit)
    );

    return res.json({
      success: true,
      total: fullResult.length,
      page: parseInt(page),
      limit: parseInt(limit),
      grand_total_area_mtr2,
      grand_total_buisness_potential,
      data: paginatedData,
    });
  } catch (error) {
    console.error("Error in getAnnualBusinessPlanSummary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAnnualBusinessPlanByEmpId = async (req, res) => {
  try {
    const { id } = req.params;
    const { monthValue } = req.query;
    //console.log("monthValue",monthValue);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required in params",
      });
    }

    const whereCondition = { emp_id: id };

    if (monthValue) {
      whereCondition.for_month = monthValue;
    }

    const plans = await AnnualBusinessPlan.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname", "emp_id"],
        },
        {
          model: BusinessAssociate,
          as: "associate",
          attributes: ["id", "associate_name", "email", "phone_no", "code"],
        },
        {
          model: CustomerContactPerson,
          as: "contactPerson",
          attributes: ["id", "name", "email", "phone_no", "designation"],
        },
        {
          model: Customer,
          as: "customer",
          attributes: ["id", "company_name"],
        },
        {
          model: Mytable,
          as: "areaDetails",
          attributes: ["district", "statename"],
        },
      ],
      order: [["createdAt", "DESC"]], // Optional: Order by latest
    });

    if (plans.length === 0) {
      return res.json({
        success: false,
        emp_id: id,
        message: "No business plan records found for this employee",
        total_records: plans.length,
        data: plans,
      });
    }

    return res.json({
      success: true,
      emp_id: id,
      emp_code: plans[0].employee?.emp_id,
      employee_fullname: plans[0].employee?.fullname || "Unknown",
      total_records: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error("Error in getAnnualBusinessPlanByEmpId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getProductsByBusinessPlanId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing business_plan_id in request params",
      });
    }

    const products = await BusinessPlanProduct.findAll({
      where: { business_plan_id: id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "product_name"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "category_name"],
        },
      ],
      order: [["id", "ASC"]],
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for the given business plan ID",
      });
    }

    return res.status(200).json({
      success: true,
      total_products: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching business plan products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.exportAnnualBusinessPlanSummary = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const plans = await AnnualBusinessPlan.findAll({
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "fullname"],
          where: search
            ? {
                fullname: {
                  [Op.like]: `%${search}%`,
                },
              }
            : undefined,
        },
        {
          model: BusinessPlanProduct,
          as: "products",
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["category_name"],
            },
          ],
        },
      ],
    });

    const employeeMap = new Map();

    for (const plan of plans) {
      const empId = plan.emp_id;
      const empFullname = plan.employee?.fullname || "Unknown";
      const customerId = plan.customer_id;

      const categoryName =
        plan.products?.[plan.products.length - 1]?.category?.category_name ||
        "";

      if (!empId) continue;

      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          emp_id: empId,
          employee_fullname: empFullname,
          unique_customers: new Set(),
          total_area_mtr2: 0,
          total_buisness_potential: 0,
          category_name: categoryName,
        });
      }

      const entry = employeeMap.get(empId);
      if (customerId) entry.unique_customers.add(customerId);
      if (plan.area_mtr2) entry.total_area_mtr2 += plan.area_mtr2;
      if (plan.buisness_potential)
        entry.total_buisness_potential += plan.buisness_potential;
      entry.category_name = categoryName;
    }

    const fullResult = Array.from(employeeMap.values()).map((emp) => ({
      emp_id: emp.emp_id,
      employee_fullname: emp.employee_fullname,
      unique_customers_count: emp.unique_customers.size,
      total_area_mtr2: emp.total_area_mtr2,
      total_buisness_potential: emp.total_buisness_potential,
      category_name: emp.category_name,
    }));

    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Business Plan Summary");

    // Header
    worksheet.columns = [
      { header: "Employee ID", key: "emp_id", width: 15 },
      { header: "Employee Name", key: "employee_fullname", width: 30 },
      { header: "No. of Companies", key: "unique_customers_count", width: 10 },
      {
        header: "Product Sale / Work Execution / Expected Sales",
        key: "category_name",
        width: 40,
      },
      {
        header: "Total Material Qty. / Total Area (in Sqm)",
        key: "total_area_mtr2",
        width: 40,
      },
      {
        header: "Approx Business Potential",
        key: "total_buisness_potential",
        width: 40,
      },
    ];

    // Add rows
    // fullResult.forEach((item) => {
    //   worksheet.addRow(item);
    // });

    // Add rows and calculate grand totals
    let grandTotalArea = 0;
    let grandTotalBusinessPotential = 0;

    fullResult.forEach((item) => {
      worksheet.addRow(item);
      grandTotalArea += item.total_area_mtr2;
      grandTotalBusinessPotential += item.total_buisness_potential;
    });

    // Add a blank row for spacing
    worksheet.addRow({});

    // Add grand total row
    worksheet.addRow({
      category_name: "Grand Total",
      total_area_mtr2: grandTotalArea,
      total_buisness_potential: grandTotalBusinessPotential,
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=AnnualBusinessPlanSummary.xlsx"
    );

    // Write to response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error in exportAnnualBusinessPlanSummary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
