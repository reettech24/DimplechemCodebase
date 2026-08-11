"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CostWorking extends Model {
    static associate(models) {
      // Define associations here (if needed)
      CostWorking.hasMany(models.CostWorkingProduct, {
        foreignKey: "cost_working_id",
        as: "products",
      });
      CostWorking.belongsTo(models.Customer, {
        foreignKey: "company_name",
        as: "company",
      });
    }
  }

  CostWorking.init(
    {
      company_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nature_of_work: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      technology_used: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estimate_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estimate_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      revision_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      revision_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      area_to_be_coated: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thickness_in_mm: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      labour_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cunsumable_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      transport_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      supervision_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contractor_profit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      over_head_charges: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      b3_total_application_labour_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_project_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_material_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cr_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      b1_total: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      b2_percent: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      b2_percent_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      b2_total_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      b3_percent: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      b3_percent_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contractor_profit_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      grand_total: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      labour_cost_area: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      cunsumable_cost_area: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      transport_cost_area: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      supervision_cost_area: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      finance_cost_month: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      finance_cost_persantage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      over_head_charges_area: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      over_head_charges_persantage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      contractor_profit_persantage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      checked_by: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      dcpl_representative: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      prepared_by: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "CostWorking",
      tableName: "cost_workings",
      timestamps: true,
      // hooks: {
      //   // async afterCreate(CostWorking) {
      //   //   const newCostId = `10${String(CostWorking.id).padStart(2, "0")}`;
      //   //   await CostWorking.update({ revision_no: newCostId });
      //   // },
      //   async afterCreate(CostWorking) {
      //     const revisionNo = `R00${CostWorking.id}`;
      //     const estimateNo = `EST${CostWorking.id}`;
      //     await CostWorking.update({ revision_no: revisionNo, estimate_no: estimateNo, });
      //   },
      // },
    }
  );

  return CostWorking;
};
