'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmployeeRole extends Model {
    static associate(models) {
      // Relationship: EmployeeRole belongs to User (Employee)
      EmployeeRole.belongsTo(models.User, { 
        foreignKey: "employee_id", 
        as: "employee" 
      });
    
      EmployeeRole.belongsTo(models.Role, { 
        foreignKey: "role_id", 
        as: "role" 
      });
    }
  }

  EmployeeRole.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'EmployeeRole',
      tableName: 'employeeroles',
      timestamps: true,
    }
  );
  return EmployeeRole;
};
