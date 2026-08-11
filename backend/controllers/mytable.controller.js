const { Op } = require("sequelize");
const {
  Customer,
  Lead,
  User,
  BusinessAssociate,
  sequelize,
  CustomerContactPerson,
  CustomerAddress,
  Mytable,
} = require("../models");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { ValidationError } = require("sequelize");
const moment = require("moment");

const getAllPincodes = async (req, res) => {
  try {
    const pincodes = await Mytable.findAll({
      attributes: ['pincode'],
      group: ['pincode'], // Optional: remove duplicates
    });

    res.status(200).json({
      success: true,
      data: pincodes,
    });
  } catch (error) {
    console.error('Error fetching pincodes:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pincodes.',
    });
  }
};

const getAreaByPincode = async (req, res) => {
  const { pincode } = req.params;

  try {
    const areas = await Mytable.findAll({
      where: { pincode },
      attributes: ['areaname'],
    });

    if (areas.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No areas found for the given pincode.',
      });
    }

    res.status(200).json({
      success: true,
      data: areas,
    });
  } catch (error) {
    console.error('Error fetching area by pincode:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching area by pincode.',
  });
}
};


const getCityByAreaname = async (req, res) => {
  const { areaname } = req.params;

  try {
    const results = await Mytable.findAll({
      where: { areaname },
      attributes: ['district'],
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No districts found for the given areaname.',
      });
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error fetching district by areaname:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching district by areaname.',
    });
  }
};

module.exports = {getAllPincodes,getAreaByPincode,getCityByAreaname};