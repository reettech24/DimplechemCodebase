"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SecureDocument extends Model {
    static associate(models) {
      SecureDocument.belongsTo(models.Customer, {
        foreignKey: "cust_id",
        as: "customer", // optional alias
        onDelete: "SET NULL", // or "CASCADE"
      });
      SecureDocument.belongsTo(models.User, {
        foreignKey: "emp_id",
        as: "employee", // optional alias
        onDelete: "SET NULL", // or "CASCADE"
      });
      SecureDocument.hasMany(SecureDocument, {
        foreignKey: "cust_id",
        as: "documents",
      });
    }
  }

  SecureDocument.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      zipPath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          hey: "id",
        },
      },
      to_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cust_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "customers",
          key: "id",
        },
      },
      downloadLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SecureDocument",
      tableName: "securedocuments", // or 'SecureDocuments' if you prefer PascalCase
    }
  );

  return SecureDocument;
};
