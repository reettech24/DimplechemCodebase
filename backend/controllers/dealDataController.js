const { dealData, Product,Lead } = require('../models'); // Adjust path as necessary
const { Op } = require('sequelize');

// const getLeadProducts = async (req, res) => {
//   try {
//     const { lead_id } = req.params;

//     //console.log("lead_id", lead_id);

//     if (!lead_id) {
//       return res.status(400).json({
//         success: false,
//         message: 'lead_id is required',
//       });
//     }

//     const products = await dealData.findAll({
//       where: { lead_id },
//       include: [
//         {
//           model: Product,
//           as: 'product',
//           attributes: ['product_name'], // Only fetch product_name
//         },
//       ],
//       // No need to specify attributes in dealData to get all columns
//     });

//     const productNames = products.map(item => ({
//       ...item.toJSON(), // includes all dealData fields
//       product_name: item.product?.product_name || null, // append product_name
//     }));
//     res.status(200).json({
//       success: true,
//       message: 'Products fetched successfully',
//       data: productNames,
//     });
//   } catch (error) {
//     console.error('Error fetching product names:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//     });
//   }
// };

const getLeadProducts = async (req, res) => {
  try {
    const { customer_id } = req.params;

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: 'customer_id is required',
      });
    }

    // Get all leads for this customer_id
    const leads = await Lead.findAll({
      where: { customer_id },
      attributes: ['id'], // get only primary keys
    });

    const leadIds = leads.map(lead => lead.id);

    if (leadIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No leads found for this customer',
      });
    }

    // Fetch all dealData where lead_id is in those lead IDs
    const products = await dealData.findAll({
      where: {
        lead_id: { [Op.in]: leadIds },
      },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['product_name'],
        },
      ],
    });

    const productNames = products.map(item => ({
      ...item.toJSON(),
      product_name: item.product?.product_name || null,
    }));

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: productNames,
    });
  } catch (error) {
    console.error('Error fetching product names:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};


module.exports = { getLeadProducts };
