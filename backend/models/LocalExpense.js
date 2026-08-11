"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LocalExpense extends Model {
    static associate(models) {
      LocalExpense.hasMany(models.LocalExpenseDetail, {
        foreignKey: "local_expense_id",
        as: "details",
        onDelete: "CASCADE",
      });

      LocalExpense.belongsTo(models.User, {
        foreignKey: "employee_id",
        as: "employee",
        onDelete: "SET NULL",
      });
    }
  }

  LocalExpense.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      period_of_expenses: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      place_of_visit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank_account_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      //New fields added

      prepared_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      checked_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recon_of_bank_ac: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank_ac_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      petty_cash_sub_on: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      petty_cash_pending_for_reload: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      balance_on_bank_ac: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      diff: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cash_in_hand: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LocalExpense",
      tableName: "local_expenses",
      timestamps: true,
    }
  );

  return LocalExpense;
};
