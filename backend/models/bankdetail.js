'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BankDetail extends Model {
    static associate(models) {
      //BankDetail.belongsTo(models.User, { foreignKey: 'employee_id', onDelete: 'CASCADE' });
      BankDetail.belongsTo(models.User, { foreignKey: "employee_id", as: "bankDetail" });
    }
  }

  BankDetail.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Employee ID is required" },
          isInt: { msg: "Employee ID must be an integer" },
        },
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "Bank name is required" },
        //   notEmpty: { msg: "Bank name cannot be empty" },
        // },
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        // validate: {
        //   notNull: { msg: "Account number is required" },
        //   notEmpty: { msg: "Account number cannot be empty" },
        //   len: { args: [10, 20], msg: "Account number must be between 10 and 20 characters" },
        // },
      },
      ifsc_code: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "IFSC code is required" },
        //   notEmpty: { msg: "IFSC code cannot be empty" },
        //   is: { args: /^[A-Z]{4}0[A-Z0-9]{6}$/, msg: "Invalid IFSC code format" },
        // },
      },
      branch_name: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "Branch name is required" },
        //   notEmpty: { msg: "Branch name cannot be empty" },
        // },
      },
      account_type: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   notNull: { msg: "Account type is required" },
        //   isIn: {
        //     args: [["Saving", "Current"]],
        //     msg: "Account type must be either 'Saving' or 'Current'",
        //   },
        // },
      },
    },
    {
      sequelize,
      modelName: 'BankDetail',
      tableName: 'bankdetails'
    }
  );

  return BankDetail;
};
