"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlanOfAction extends Model {
    static associate(models) {
      // Customer
      PlanOfAction.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
        onDelete: "CASCADE",
      });

      // Sales Person (User)
      PlanOfAction.belongsTo(models.User, {
        foreignKey: "sales_persion_id",
        as: "salesPerson",
        onDelete: "CASCADE",
      });
    }
  }

  PlanOfAction.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contact_persion_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sales_persion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      meeting_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      meeting_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meeting_summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_sale: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      total_material_qty: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      approx_business: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      project_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull:true,
      },
    },
    {
      sequelize,
      modelName: "PlanOfAction",
      tableName: "planofactions",
    }
  );

  return PlanOfAction;
};
