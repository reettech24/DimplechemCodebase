'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      // Add associations here if needed
    }
  }

  Module.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Module',
    tableName: 'modules',
    timestamps: false,
    underscored: true
  });

  return Module;
};
