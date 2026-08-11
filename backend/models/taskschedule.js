"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskSchedule extends Model {
    static associate(models) {
      TaskSchedule.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "assignedUser",
      });
    }
  }
  TaskSchedule.init(
    {
      task_title: DataTypes.TEXT,
      description: DataTypes.TEXT,
      salesperson_remark:{
        type: DataTypes.TEXT,
        defaultValue: null
      },
      assigned_to: DataTypes.STRING,
      due_date: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TaskSchedule",
      tableName: "taskschedules"
    }
  );
  return TaskSchedule;
};
