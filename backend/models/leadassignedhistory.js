'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LeadAssignedHistory extends Model {
    static associate(models) {
      LeadAssignedHistory.belongsTo(models.Lead, {
        foreignKey: 'lead_id',
        as: 'lead'
      });

      LeadAssignedHistory.belongsTo(models.User, {
        foreignKey: 'new_assigned_person_id',
        as: 'assignedPerson'
      });
    }
  }

  LeadAssignedHistory.init({
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    new_assigned_person_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'LeadAssignedHistory',
    tableName: 'lead_assigned_history',
    underscored: false
  });

  return LeadAssignedHistory;
};
