'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Action extends Model {
    static associate(models) {
      // Add associations here if needed
    }
  }

  Action.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Action',
    tableName: 'actions',
    timestamps: false,
    underscored: true
  });

  return Action;
};
