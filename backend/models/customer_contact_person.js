"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CustomerContactPerson extends Model {
    static associate(models) {
      CustomerContactPerson.belongsTo(models.Customer, {
        foreignKey: "customer_id",
        as: "customer",
      });
      CustomerContactPerson.hasMany(models.Lead, {
        foreignKey: "id",
        as: "leads",
      });
    }
  }

  CustomerContactPerson.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
       name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull:true,
      },
    },
    {
      sequelize,
      modelName: "CustomerContactPerson",
      tableName: "customer_contact_persons",
      timestamps: true,
    }
  );

  return CustomerContactPerson;
};
