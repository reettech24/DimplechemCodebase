"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OutTour extends Model {
    static associate(models) {
      OutTour.hasMany(models.OutTourDetail, {
        foreignKey: "out_tour_id",
        as: "details",
        onDelete: "CASCADE",
      });
      OutTour.hasMany(models.OutTourExpense, {
        foreignKey: "out_tour_id",
        as: "expenses",
        onDelete: "CASCADE",
      });
      OutTour.belongsTo(models.User, {
        foreignKey: "employee_id",
        as: "employee",
      });
    }
  }

  OutTour.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Employee ID is required" },
          isInt: { msg: "Employee ID must be an integer" },
        },
      },
      person_accompanied: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      place_of_visit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      period_of_visit:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      period_of_visit_from_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      period_of_visit_to_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      total_expenses:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
        prepared_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "OutTour",
      tableName: "out_tours",
    }
  );

  return OutTour;
};
