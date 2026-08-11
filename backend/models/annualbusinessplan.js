"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnnualBusinessPlan extends Model {
    static associate(models) {
      AnnualBusinessPlan.belongsTo(models.User, {
        foreignKey: "emp_id",
        as: "employee",
      });
      AnnualBusinessPlan.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
      });
      AnnualBusinessPlan.belongsTo(models.BusinessAssociate, {
        foreignKey: "associate_id",
        as: "associate",
      });
      AnnualBusinessPlan.belongsTo(models.CustomerContactPerson, {
        foreignKey: "contact_person_id",
        as: "contactPerson",
      });
      AnnualBusinessPlan.hasMany(models.BusinessPlanProduct, {
        foreignKey: "business_plan_id",
        as: "products",
      });
      AnnualBusinessPlan.belongsTo(models.Category, {
        foreignKey: "technology_used",
        as: "category",
      });
      AnnualBusinessPlan.belongsTo(models.Mytable, {
        foreignKey: "location",
        targetKey: "areaname",
        as: "areaDetails",
      });
    }
  }
  AnnualBusinessPlan.init(
    {
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      associate_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      contact_person_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      area_mtr2: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      buisness_potential: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: null,
      },
      technology_used: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      for_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },

    {
      sequelize,
      modelName: "AnnualBusinessPlan",
      tableName: "annual_business_plan",
    }
  );
  return AnnualBusinessPlan;
};
