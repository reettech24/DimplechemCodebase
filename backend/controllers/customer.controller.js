const { Op, Sequelize } = require("sequelize");
const {
  Customer,
  Lead,
  User,
  BusinessAssociate,
  CustomerContactPerson,
  CustomerAddress,
  dealData,
  Product,
  SecureDocument,
  LeadCommunication,
} = require("../models");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { ValidationError } = require("sequelize");
// const SecureDocument = require("../models/SecureDocument");

const listCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", all } = req.query;

    // Base filter: Only fetch active customers
    let whereCondition = { active_status: "active" };

    // Add search filter if provided
    // if (search) {
    //   //whereCondition.company_name = { [Op.like]: `%${search}%` };
    //   whereCondition.company_name = { [Op.like]: `${search}%` };
    // }
    if (search) {
      whereCondition[Op.or] = [
        { company_name: { [Op.like]: `%${search}%` } },
        { email_id: { [Op.like]: `%${search}%` } },
        { primary_contact : { [Op.like]: `%${search}%` } },
        { secondary_contact: { [Op.like]: `%${search}%` } },
      ];
    }

    // Fetch all active customers if "all" query param is true
    if (all === "true") {
      const customers = await Customer.findAll({
        where: whereCondition,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({ success: true, data: customers });
    }

    // Convert page & limit to integers
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    // Fetch paginated & filtered customers
    const { count, rows } = await Customer.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
      include: [
        {
          model: BusinessAssociate,
          as: "businessAssociates",
          // where: {
          //   status: 1,
          // },
          required: false, // so even customers without active associates are included
          attributes: ["id", "associate_name", "status", "email", "phone_no"], // whatever fields you need
        },
        {
          model: User,
          as: "salesPerson",
          attributes: ["id", "fullname"],
        },
        {
          model: CustomerContactPerson,
          as: "contactPersons", // alias must match your association
          required: false,
          attributes: ["id", "name", "email", "phone_no", "designation"], // adjust as needed
        },
        {
          model: CustomerAddress,
          as: "addresses", // alias must match your association
          required: false,
        },
      ],
    });

    //console.log("rows",rows);

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

const addCustomer = async (req, res) => {
  //console.log("addcustomer backend", req.body);
  try {
    const {
      company_name,
      //client_name,
      //designation,
      primary_contact,
      secondary_contact,
      email_id,
      //address,
      //address_2,
      //address_3,
      //address_4,
      //location,
      //pincode,
      pan_no,
      associate_name,
      business_associate,
      contact_persons,
      company_address,
      gst_number,
      sales_person_id,
    } = req.body;

    // Validation
    if (!company_name || !email_id) {
      return res.status(400).json({
        success: false,
        message: "Company name, client name, and email are required.",
      });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ where: { email_id } });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer with this email already exists.",
      });
    }

    const sanitizedBusinessAssociate =
      business_associate === "" ? null : business_associate;

    // Create new customer
    const newCustomer = await Customer.create({
      company_name,
      //client_name,
      //designation,
      primary_contact,
      secondary_contact,
      email_id,
      // address,
      // address_2,
      //address_3,
      //address_4,
      //location,
      //pincode,
      pan_no,
      business_associate: sanitizedBusinessAssociate,
      contact_persons,
      company_address,
      gst_number,
      sales_person_id,
    });

    if (Array.isArray(contact_persons) && contact_persons.length > 0) {
      const contactEntries = contact_persons.map((person) => ({
        customer_id: newCustomer.id,
        name: person.name,
        email: person.email,
        phone_no: person.phone_no,
        alternate_no: person.alternate_no,
        designation: person.designation,
      }));

      await CustomerContactPerson.bulkCreate(contactEntries);
    }

    // Insert company addresses
    if (Array.isArray(company_address) && company_address.length > 0) {
      const addressEntries = company_address.map((addr) => ({
        customer_id: newCustomer.id,
        pincode: addr.pincode,
        location: addr.location,
        city: addr.city,
        address_type: addr.address_type,
        full_address: addr.full_address,
      }));

      await CustomerAddress.bulkCreate(addressEntries);
    }

    // Create new business associate entry (with foreign key customer_id)
    // if (associate_name) {
    //   await BusinessAssociate.create({
    //     associate_name: associate_name,
    //     //code: BA${newCustomer.id},
    //     status: true,
    //     customer_id: newCustomer.id, // <-- This fixes the foreign key issue
    //   });
    // }

    // Handle Business Associates (multiple, with one marked as status: true)
    // if (Array.isArray(associate_name) && associate_name.length > 0) {
    //   const associateData = associate_name.map((name) => ({
    //     associate_name: name.associate_name,
    //     email: name.email,
    //     phone_no: name.phone_no,
    //     status: name.associate_name === business_associate, // true only for matched one
    //     customer_id: newCustomer.id,
    //   }));

    //   const createdAssociates = await BusinessAssociate.bulkCreate(
    //     associateData,
    //     { returning: true }
    //   );

    //   // Add code for each: BA<ID>
    //   await Promise.all(
    //     createdAssociates.map((associate) => {
    //       const code = `BA${associate.id}`;
    //       return associate.update({ code });
    //     })
    //   );
    // }

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      data: newCustomer,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((err) => err.message);
      console.error("Sequelize Validation Errors:", messages);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_name,
      //client_name,
      //designation,
      primary_contact,
      secondary_contact,
      email_id,
      //address,
      //location,
      //pincode,
      pan_no,
      // address_2,
      // address_3,
      // address_4,
      contact_persons = [],
      company_address,
      gst_number,
      business_associate,
      sales_person_id,
    } = req.body;
    //console.log("req.body",req.body);
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Customer ID is required." });

    const customer = await Customer.findByPk(id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });

    const sanitizedBusinessAssociate =
      business_associate === "" ? null : business_associate;

    await customer.update({
      company_name,
      //client_name,
      //designation,
      primary_contact,
      secondary_contact,
      email_id,
      //address,
      //location,
      //pincode,
      pan_no,
      //address_2,
      //address_3,
      //address_4,
      gst_number,
      sales_person_id,
      business_associate: sanitizedBusinessAssociate,
    });

    // if (business_associate) {
    //   //console.log("business_associate", business_associate);
    //   await BusinessAssociate.update(
    //     { status: 0 },
    //     {
    //       where: {
    //         customer_id: id,
    //       },
    //     }
    //   );
    //   await BusinessAssociate.update(
    //     { status: 1 },
    //     {
    //       where: {
    //         id: business_associate,
    //       },
    //     }
    //   );
    // }

    // Update Contact Persons
    if (Array.isArray(contact_persons)) {
      // First, delete old contact persons for this customer
      await CustomerContactPerson.destroy({
        where: { customer_id: id },
      });

      // Then, add new ones
      for (const contact of contact_persons) {
        await CustomerContactPerson.create({
          customer_id: id,
          name: contact.name,
          email: contact.email,
          phone_no: contact.phone_no,
          designation: contact.designation,
        });
      }
    }

    //  Update Customer Addresses
    if (Array.isArray(company_address)) {
      // Delete old addresses
      await CustomerAddress.destroy({ where: { customer_id: id } });

      const addressEntries = company_address.map((addr) => ({
        customer_id: id,
        pincode: addr.pincode,
        location: addr.location,
        city: addr.city,
        address_type: addr.address_type,
        full_address: addr.full_address,
      }));

      await CustomerAddress.bulkCreate(addressEntries);
    }
    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Remove a customer
const removeCustomer = async (req, res) => {
  const { id } = req.params;
  const active_status = "deactive"; // "active" or "deactive"

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.active_status = active_status;
    await customer.save();

    res.json({ message: "Customer removed successfully", customer });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer status", error });
  }
};

const getCustomerAddresses = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch address details from CustomerAddress
    const customerAddress = await CustomerAddress.findAll({
      where: { customer_id: id },
      attributes: [
        "customer_id",
        "pincode",
        "location",
        "city",
        "address_type",
      ],
    });

    if (!customerAddress) {
      return res.status(404).json({
        success: false,
        message: "Customer address not found.",
      });
    }

    // Fetch contact persons from CustomerContactPerson
    const contactPersons = await CustomerContactPerson.findAll({
      where: { customer_id: id },
      attributes: ["name", "id", "customer_id"],
    });

    const customer = await Customer.findByPk(id);
    //console.log("customer",customer);
    const businessAssociates = await BusinessAssociate.findAll({
      where: { id: customer?.business_associate },
      attributes: [
        "id",
        "code",
        "associate_name",
        "status",
        "email",
        "phone_no",
        "customer_id",
      ],
    });

    // Build the response
    res.status(200).json({
      success: true,
      message: "Customer details retrieved successfully",
      data: {
        customer_id: id,
        addresses: customerAddress,
        contact_persons: contactPersons,
        business_associates: businessAssociates,
      },
    });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving customer details",
      error: error.message,
    });
  }
};

const exportCustomersToExcel = async (req, res) => {
  try {
    const { search = "" } = req.query;

    // Search condition
    // Base filter: Only fetch active customers
    let whereCondition = {};
    // Add search filter if provided
    if (search) {
      whereCondition.company_name = { [Op.like]: `${search}%` };
    }

    const customers = await Customer.findAll({
      where: whereCondition,
      order: [["id", "DESC"]],
      include: [
        {
          model: BusinessAssociate,
          as: "businessAssociates",
          required: false, // so even customers without active associates are included
          attributes: ["id", "associate_name", "status"], // whatever fields you need
        },
        // {
        //   model: User,
        //   as: "salesPerson",
        //   attributes: ["id", "fullname"],
        // },
        {
          model: CustomerContactPerson,
          as: "contactPersons", // alias must match your association
          required: false,
          attributes: ["id", "name", "email", "phone_no", "designation"], // adjust as needed
        },
        {
          model: CustomerAddress,
          as: "addresses", // alias must match your association
          required: false,
        },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customers Report");

    worksheet.columns = [
      { header: "Customer ID", key: "cust_id", width: 15 },
      { header: "Company Name", key: "company_name", width: 25 },
      { header: "Primary Contact", key: "primary_contact", width: 20 },
      { header: "Secondary Contact", key: "secondary_contact", width: 20 },
      { header: "Email", key: "email_id", width: 25 },
      { header: "PAN No", key: "pan_no", width: 20 },
      { header: "GST No", key: "gst_number", width: 20 },
      { header: "Business Associate", key: "business_associate", width: 20 },
      { header: "Status", key: "active_status", width: 15 },
      { header: "Contact Persons", key: "contact_persons", width: 50 },
      { header: "Company Address's", key: "company_address", width: 50 },
    ];

    customers.forEach((customer) => {
      worksheet.addRow({
        cust_id: customer.cust_id,
        company_name: customer.company_name,
        primary_contact: customer.primary_contact,
        secondary_contact: customer.secondary_contact,
        email_id: customer.email_id,
        pan_no: customer.pan_no,
        gst_number: customer.gst_number,
        business_associate: customer.businessAssociates?.associate_name ?? null,
        active_status: customer.active_status,
        contact_persons: customer.contactPersons
          ?.map((p) => `${p.designation} ${p.name} (${p.email}, ${p.phone_no})`)
          .join("\n"), // newline-separated
        company_address: customer.addresses
          ?.map(
            (p) =>
              `${p.address_type} - ${p.location}, (${p.city}, ${p.pincode})`
          )
          .join("\n"), // newline-separated
      });
    });

    // customers.forEach((customer) => {
    //   worksheet.addRow({
    //     cust_id: customer.cust_id,
    //     company_name: customer.company_name,
    //     primary_contact: customer.primary_contact,
    //     secondary_contact: customer.secondary_contact,
    //     email_id: customer.email_id,
    //     pan_no: customer.pan_no,
    //     gst_number: customer.gst_number,
    //     business_associate: customer.businessAssociates[0]?.associate_name,
    //     active_status: customer.active_status,
    //   });
    // });

    const timestamp = new Date()
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .split(".")[0];
    const filePath = path.join(
      __dirname,
      `../exports/Customers_Report_${timestamp}.xlsx`
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await workbook.xlsx.writeFile(filePath);
    return res.download(filePath, "Customers_Report.xlsx", (err) => {
      if (err) {
        console.error("Download Error:", err);
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("File delete error:", unlinkErr);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });
    });
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const customerHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 If customer ID is provided
    if (id) {
      const customer = await Customer.findOne({
        where: { id, active_status: "active" },
        include: [
          {
            model: BusinessAssociate,
            as: "businessAssociates",
            where: {
              status: 1,
            },
            required: false,
            attributes: ["id", "associate_name", "code", "status"],
          },
          {
            model: User,
            as: "salesPerson",
            attributes: ["id", "fullname"],
          },
          {
            model: Lead,
            as: "leads",
            include: [
              {
                model: User,
                as: "assignedPerson",
                attributes: [
                  "id",
                  "fullname",
                  "email",
                  "phone",
                  "emergency_contact",
                ],
              },
              {
                model: LeadCommunication,
                as: "communications",
              },
              {
                model: User,
                as: "leadOwner",
                attributes: [
                  "id",
                  "fullname",
                  "email",
                  "phone",
                  "emergency_contact",
                ],
              },
            ],
            order: [["assign_date", "DESC"]],
          },
          {
            model: SecureDocument,
            as: "secureDocuments",
            separate: true,
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      if (!customer) {
        return res
          .status(404)
          .json({ success: false, message: "Customer not found" });
      }

      return res.status(200).json({ success: true, data: customer });
    }

    // 🔁 If no ID provided, list with pagination or all
    const { page = 1, limit = 10, search = "", all } = req.query;
    let whereCondition = { active_status: "active" };

    if (search) {
      whereCondition.company_name = { [Op.like]: `%${search}%` };
    }

    if (all === "true") {
      const customers = await Customer.findAll({
        where: whereCondition,
        order: [["company_name", "ASC"]],
      });
      return res.status(200).json({ success: true, data: customers });
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Customer.findAndCountAll({
      where: whereCondition,
      limit: pageSize,
      offset,
      order: [["company_name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
    });
  } catch (error) {
    console.error("Error in customerInfo:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBuisnessAssociates = async (req, res) => {
  try {
    //const { id } = req.params;

    // Fetch business associates where customer_id matches the given parameter
    const businessAssociates = await BusinessAssociate.findAll({
      //where: { customer_id: id }, // Apply the filter based on customer_id
      order: [["createdAt", "DESC"]], // Optional: Change the order as needed
    });

    // If no business associates are found for the given customer_id
    if (!businessAssociates.length) {
      return res
        .status(404)
        .json({ message: "No business associates found for this customer." });
    }

    return res.status(200).json({
      success: true,
      data: businessAssociates,
    });
  } catch (error) {
    console.error("Error fetching business associates:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const updateBusinessAssociate = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const { associate_name, email, phone_no } = req.body;
    //console.log("updatebussiness" ,customer_id,associate_name );

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required in params.",
      });
    }

    // CASE 2: Create new associate
    if (associate_name) {
      // Step 1: Deactivate all old associates for this customer
      await BusinessAssociate.update(
        { status: 0 },
        {
          where: {
            customer_id: customer_id,
          },
        }
      );

      // Step 2: Create new associate with status 1
      const newAssociate = await BusinessAssociate.create({
        associate_name,
        customer_id: customer_id,
        // code: `BA${customer_id}`,
        email,
        phone_no,
        status: 1,
      });

      const code = `BA${newAssociate.id}`;
      // Step 3: Update the associate with the generated code
      await newAssociate.update({ code });

      return res.status(201).json({
        success: true,
        message: "New Business Associate created.",
        data: newAssociate,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request. Send either 'id' or 'associate_name'.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const customerInfo = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Fetch specific customer by ID
    if (id) {
      const customer = await Customer.findOne({
        where: { id, active_status: "active" },
        include: [
          {
            model: Lead,
            as: "leads",
            include: [
              {
                model: User,
                as: "assignedPerson",
                attributes: [
                  "id",
                  "fullname",
                  "email",
                  "phone",
                  "emergency_contact",
                ],
              },
              {
                model: dealData,
                as: "deals",
                attributes: ["product_id"],
                include: [
                  {
                    model: Product,
                    as: "product",
                    attributes: ["product_name"],
                  },
                ],
              },
              {
                model: User,
                as: "leadOwner",
                attributes: ["id", "fullname", "email"],
              },
            ],
            order: [["assign_date", "DESC"]],
          },
          {
            model: BusinessAssociate,
            as: "businessAssociates",
            attributes: ["id", "associate_name", "status", "email", "phone_no"],
          },
          {
            model: CustomerContactPerson,
            as: "contactPersons",
            attributes: ["id", "name", "email", "phone_no"],
          },
        ],
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      // const allDeals = customer.leads.flatMap((lead) => lead.deals || []);
      // const mergedDeals = [
      //   ...new Map(allDeals.map((deal) => [deal.product_id, deal])).values(),
      // ];

      const assignedPersons = [
        ...new Map(
          (customer.leads || [])
            .map((lead) => lead.assignedPerson)
            .filter(Boolean)
            .map((person) => [person.id, person])
        ).values(),
      ];

      // Clean leads: remove assignedPerson from each
      const leads = customer.leads.map((lead) => {
        const { assignedPerson, ...rest } = lead.toJSON();
        return rest;
      });

      // Extract merged deals
      const allDeals = customer.leads.flatMap((lead) => lead.deals || []);
      const mergedDeals = [
        ...new Map(allDeals.map((deal) => [deal.product_id, deal])).values(),
      ];

      const responseData = {
        ...customer.toJSON(),
        assignedPersons,
        mergedDeals, // added field
      };

      // const responseData = {
      //   ...customer.toJSON(),
      //   mergedDeals, // added field
      // };

      return res.status(200).json({ success: true, data: responseData });
    }

    // 🔁 Paginated list of customers
    const { page = 1, limit = 10, search = "" } = req.query;
    let whereCondition = { active_status: "active" };

    if (search) {
      whereCondition.company_name = { [Op.like]: `%${search}%` };
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Customer.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: BusinessAssociate,
          as: "businessAssociates",
        },
        {
          model: CustomerContactPerson,
          as: "contactPersons",
        },
      ],
      limit: pageSize,
      offset,
      order: [["company_name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      data: rows,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / pageSize),
      totalItems: count,
    });
  } catch (error) {
    console.error("Error in customerInfo:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// const listBusinessAssociates = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search = "", all } = req.query;

//     // Base where condition: active associates only
//     let whereCondition = { status: 1 };

//     // If search term provided
//     if (search) {
//       whereCondition = {
//         ...whereCondition,
//         [Op.or]: [
//           { associate_name: { [Op.like]: `${search}%` } },
//           { "$customers.company_name$": { [Op.like]: `${search}%` } },
//         ],
//       };
//     }

//     // If "all" param is true, fetch all
//     if (all === "true") {
//       const associates = await BusinessAssociate.findAll({
//         where: whereCondition,
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             model: Customer,
//             as: "customers",
//             attributes: ["id", "company_name"],
//           },
//         ],
//       });

//       return res.status(200).json({ success: true, data: associates });
//     }

//     // Pagination values
//     const pageNumber = parseInt(page, 10);
//     const pageSize = parseInt(limit, 10);
//     const offset = (pageNumber - 1) * pageSize;

//     // Paginated query
//     const { count, rows } = await BusinessAssociate.findAndCountAll({
//       where: whereCondition,
//       limit: pageSize,
//       offset,
//       order: [["createdAt", "DESC"]],
//       distinct: true,
//       include: [
//         {
//           model: Customer,
//           as: "customers",
//           attributes: ["id", "company_name"],
//            required: true,
//           // include: [
//           //   {
//           //     model: CustomerAddress,
//           //     as: "addresses",
//           //     attributes: ["id", "pincode", "location", "city", "address_type"],
//           //   },
//           // ],
//         },
//       ],
//     });

//     return res.status(200).json({
//       success: true,
//       data: rows,
//       currentPage: pageNumber,
//       totalPages: Math.ceil(count / pageSize),
//       totalItems: count,
//     });
//   } catch (error) {
//     console.error("Error in listBusinessAssociates:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const listBusinessAssociates = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", all } = req.query;

    //const whereCondition = { status: true };  // adjust boolean status type

    const includeCustomer = {
      model: Customer,
      as: "customers",
      attributes: ["id", "company_name"],
      required: false, // must be true if filtering
    };

    const whereCondition = [];

    if (search) {
      whereCondition.push({
        [Op.or]: [
          { associate_name: { [Op.like]: `%${search}%` } },
          Sequelize.where(Sequelize.col("customers.company_name"), {
            [Op.like]: `%${search}%`,
          }),
        ],
      });
    }

    if (all === "true") {
      const results = await BusinessAssociate.findAll({
        where: whereCondition,
        include: [includeCustomer],
        order: [["createdAt", "DESC"]],
      });
      return res.json({ success: true, data: results });
    }

    includeCustomer.include = [
      {
        model: CustomerAddress,
        as: "addresses",
        attributes: ["id", "pincode", "location", "city", "address_type"],
      },
    ];

    const { count, rows } = await BusinessAssociate.findAndCountAll({
      where: {
        [Op.and]: whereCondition,
      },
      limit: +limit,
      offset: (page - 1) * +limit,
      distinct: true,
      include: [includeCustomer],
      order: [["createdAt", "DESC"]],
      required: !!search,
      subQuery: false, // critical to prevent alias break inside LIMIT wrap
    });

    return res.json({
      success: true,
      data: rows,
      currentPage: +page,
      totalPages: Math.ceil(count / +limit),
      totalItems: count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const exportBusinessAssociates = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    let whereCondition = { status: 1 };

    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { associate_name: { [Op.like]: `${search}%` } },
          // { "$customers.company_name$": { [Op.like]: `${search}%` } },
          { "$customers.addresses.city$": { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const includeOptions = [
      {
        model: Customer,
        as: "customers",
        attributes: ["company_name"],
        include: [
          {
            model: CustomerAddress,
            as: "addresses",
            attributes: ["id", "pincode", "location", "city", "address_type"],
          },
        ],
      },
    ];

    let associates;
    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    associates = await BusinessAssociate.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
      include: includeOptions,
      subQuery: false,
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Business Associates");

    worksheet.columns = [
      { header: "Associate Code", key: "code", width: 30 },
      { header: "Associate Name", key: "associate_name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone No", key: "phone_no", width: 20 },
      { header: "Company Name", key: "company_name", width: 30 },
      { header: "Location", key: "location", width: 50 },
    ];

    associates.forEach((associate) => {
      const addresses =
        associate.customers?.addresses
          ?.map((addr) => `${addr.location}, ${addr.city}`)
          .join("\n") || "-";

      worksheet.addRow({
        code: associate.code,
        associate_name: associate.associate_name,
        email: associate.email,
        phone_no: associate.phone_no,
        company_name: associate.customers?.company_name || "-",
        location: addresses,
      });
    });

    // Set headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=BusinessAssociates.xlsx"
    );

    // Stream workbook
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Error exporting business associates:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBusinessAssociate = async (req, res) => {
  try {
    const { associate_name, email, phone_no, status = 1 } = req.body;

    // Create Business Associate
    const newAssociate = await BusinessAssociate.create({
      associate_name,
      email,
      phone_no,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Business Associate Added successfully.",
      data: newAssociate,
    });
  } catch (error) {
    console.error("Error in createBusinessAssociate:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const EditBusinessAssociate = async (req, res) => {
  try {
    const { id } = req.params;
    const { associate_name, email, phone_no, status } = req.body;

    // Find record by ID
    const associate = await BusinessAssociate.findByPk(id);

    if (!associate) {
      return res.status(404).json({
        success: false,
        message: "Business Associate not found.",
      });
    }

    // Update fields
    associate.associate_name = associate_name ?? associate.associate_name;
    associate.email = email ?? associate.email;
    associate.phone_no = phone_no ?? associate.phone_no;
    associate.status = status ?? associate.status;

    await associate.save();

    return res.status(200).json({
      success: true,
      message: "Business Associate updated successfully.",
      data: associate,
    });
  } catch (error) {
    console.error("Error in updateBusinessAssociate:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBusinessAssociate = async (req, res) => {
  try {
    const { id } = req.params;

    // Find record by ID
    const associate = await BusinessAssociate.findByPk(id);

    if (!associate) {
      return res.status(404).json({
        success: false,
        message: "Business Associate not found.",
      });
    }

    // Update status to 0 (inactive/deleted)
    associate.status = 0;
    await associate.save();

    return res.status(200).json({
      success: true,
      message: "Business Associate deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteBusinessAssociate:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addCustomer,
  listCustomers,
  updateCustomer,
  removeCustomer,
  getCustomerAddresses,
  exportCustomersToExcel,
  customerInfo,
  customerHistory,
  getBuisnessAssociates,
  updateBusinessAssociate,
  listBusinessAssociates,
  exportBusinessAssociates,
  createBusinessAssociate,
  EditBusinessAssociate,
  deleteBusinessAssociate,
};
