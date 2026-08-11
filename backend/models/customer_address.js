'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomerAddress extends Model {
    static associate(models) {
      // Association with Customer
      CustomerAddress.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
    }
  }

  CustomerAddress.init({
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_address: {
      type: DataTypes.STRING,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'CustomerAddress',
    tableName: 'customer_addresses',
  });

  return CustomerAddress;
};
