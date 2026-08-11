'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.EmployeeRole, { 
        foreignKey: "role_id", 
        as: "employeeRoles" 
      });
    }
  }
  Role.init({
    role_name: DataTypes.STRING,
    role_description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
  });
  return Role;
};