"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.hasMany(models.Lead, {
        foreignKey: "customer_id",
        as: "leads",
      });
      Customer.belongsTo(models.BusinessAssociate, {
        foreignKey: "business_associate",
        as: "businessAssociates",
      });

      Customer.hasMany(models.CustomerContactPerson, {
        foreignKey: "customer_id",
        as: "contactPersons",
      });
      Customer.hasMany(models.CustomerAddress, {
        foreignKey: "customer_id",
        as: "addresses",
      });
      Customer.hasMany(models.SecureDocument, {
        foreignKey: "cust_id",
        as: "secureDocuments",
      });
      Customer.belongsTo(models.User, {
        foreignKey: "sales_person_id",
        as: "salesPerson",
        onDelete: "SET NULL",
      });
    }
  }
  Customer.init(
    {
      company_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
      },
      primary_contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secondary_contact: {
        type: DataTypes.STRING,
      },
      email_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      pincode: {
        type: DataTypes.STRING,
      },
      pan_no: {
        type: DataTypes.STRING,
        allowNull: true,
        //unique: true,
      },
      active_status: {
        type: DataTypes.ENUM("active", "deactive"), // 👈 ENUM field
        defaultValue: "active", // 👈 Default to "active"
      },
      address_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address_3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address_4: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cust_id: {
        type: DataTypes.STRING,
        unique: true,
      },
      business_associate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contact_persion1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_persion2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_persion3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gst_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sales_person_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "customers",
      timestamps: true, // Includes createdAt and updatedAt automatically
      hooks: {
        async afterCreate(customer) {
          const newCustId = `CUST${String(customer.id).padStart(2, "0")}`;
          await customer.update({ cust_id: newCustId });
        },
      },
    }
  );
  return Customer;
};
