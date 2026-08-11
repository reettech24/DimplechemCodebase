'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class dealData extends Model {
    static associate(models) {
      dealData.belongsTo(models.Lead, {
        foreignKey: 'lead_id',
        as: 'lead'
      });

      dealData.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  dealData.init(
    {
      lead_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      area: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      advance_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deal_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'dealData',
      tableName: 'dealdata',
      hooks: {
        async afterCreate(dealData, options) {
          const newCode = `DEAL${String(dealData.lead_id).padStart(2, '0')}`;
          dealData.deal_code = newCode;
          await dealData.save({ transaction: options.transaction });
        }
      }
    },
    {
      sequelize,
      modelName: 'dealData',
      tableName: 'dealdata',
    }
  );

  return dealData;
};
