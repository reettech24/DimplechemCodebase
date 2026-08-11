'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRight extends Model {
    static associate(models) {
      UserRight.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      UserRight.belongsTo(models.Module, { foreignKey: 'module_id', as: 'module' });
      UserRight.belongsTo(models.Action, { foreignKey: 'action_id', as: 'action' });
    }
  }

  UserRight.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserRight',
    tableName: 'user_rights',
    timestamps: true,
  });

  return UserRight;
};
