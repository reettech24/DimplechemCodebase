"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessPlanProduct extends Model {
    static associate(models) {
      BusinessPlanProduct.belongsTo(models.AnnualBusinessPlan, {
        foreignKey: "business_plan_id",
        as: "businessPlan",
      });
      BusinessPlanProduct.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
      BusinessPlanProduct.belongsTo(models.Category, {
        foreignKey: "technology_used",
        as: "category",
      });
    }
  }
  BusinessPlanProduct.init(
    {
      business_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      qty: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      value_in_rs: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gst_amt: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gross_sale_include_gst: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      commission: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      net_sale: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      technology_used: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gst_percent: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },

    {
      sequelize,
      modelName: "BusinessPlanProduct",
      tableName: "business_plan_products",
    }
  );
  return BusinessPlanProduct;
};
