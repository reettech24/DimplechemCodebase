"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Department.hasMany(models.JobDetail, { 
        foreignKey: "department_id", 
        as: "jobDetails" 
      });
    }
  }

  Department.init(
    {
      department_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Department name cannot be empty" },
          len: { args: [2, 50], msg: "Department name must be between 2 and 50 characters" },
        },
      },
      department_description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: { args: [5, 500], msg: "Description should be between 5 and 500 characters" },
        },
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
        allowNull: false,
        validate: {
          isIn: { args: [["Active", "Inactive"]], msg: "Status must be 'Active' or 'Inactive'" },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Department",
      tableName: 'departments'
    }
  );

  return Department;
};
