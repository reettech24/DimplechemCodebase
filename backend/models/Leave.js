"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    static associate(models) {
      // Relationship with Users table for the employee
      Leave.belongsTo(models.User, {
        as: "employee",
        foreignKey: "employee_id",
        onDelete: "CASCADE",
      });

      // Relationship with Users table for the approving authority
      Leave.belongsTo(models.User, {
        as: "approvedByUser",
        foreignKey: "approved_by",
        onDelete: "SET NULL",
      });
      Leave.hasMany(models.LeaveDocument, {
        foreignKey: "leave_id",
        as: "documents",
      });
    }
  }

  Leave.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      leave_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      applied_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      from_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      to_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reason_unplanned_leave: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
      leave_duration: {
        type: DataTypes.ENUM("Full Day", "Half Day"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Leave",
      tableName: "leaves",
      timestamps: true, // createdAt, updatedAt
    }
  );

  return Leave;
};
