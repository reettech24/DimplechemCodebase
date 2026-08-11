"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LocalExpenseDetail extends Model {
    static associate(models) {
      LocalExpenseDetail.belongsTo(models.LocalExpense, {
        foreignKey: "local_expense_id",
        as: "local_expense",
        onDelete: "CASCADE",
      });
    }
  }

  LocalExpenseDetail.init(
    {
      local_expense_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      particulars: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      travelling_exp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      loading_boarding: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      printing_stationery: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      food_expenses: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      company_car_exp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      purchases: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      other: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "LocalExpenseDetail",
      tableName: "local_expense_details",
      timestamps: true,
    }
  );

  return LocalExpenseDetail;
};
