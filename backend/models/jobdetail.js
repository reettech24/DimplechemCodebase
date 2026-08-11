'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JobDetail extends Model {
    static associate(models) {
      JobDetail.belongsTo(models.User, { 
        foreignKey: "employee_id", 
        as: "employee" 
      });
    
      JobDetail.belongsTo(models.Department, { 
        foreignKey: "department_id", 
        as: "department" 
      });

      JobDetail.belongsTo(models.User, { foreignKey: "reporting_manager_id", as: "reportingManager" });
    }
  }

  JobDetail.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      job_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      employment_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Full-time', 'Part-time', 'Contract', 'Intern']],
            msg: 'Employment type must be Full-time, Part-time, Contract, or Intern',
          },
        },
      },
      date_of_joining: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      currently_working: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true, // Default to true when an employee is first added
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isDecimal: { msg: 'Salary must be a valid decimal number' },
        },
      },
      work_location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reporting_manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      offer_letter_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_of_exit: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'JobDetail',
      tableName: 'jobdetails',
      timestamps: true,
    }
  );
  return JobDetail;
};
