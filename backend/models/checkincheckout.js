"use strict";

module.exports = (sequelize, DataTypes) => {
  const CheckinCheckout = sequelize.define(
    "CheckinCheckout",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
          key: "id",
        },
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
      },
      check_in_time: {
        type: DataTypes.DATE, // ✅ Stores both date & time
        allowNull: true,
      },
      check_out_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      working_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      checkin_location: {
        type: DataTypes.TEXT, // Store location name or address
        allowNull: true,
      },
      checkout_location: {
        type: DataTypes.TEXT, // Store location name or address
        allowNull: true,
      },
      data: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "checkin_checkout", // ✅ Explicit table name
      timestamps: true, // ✅ Adds createdAt & updatedAt automatically
    }
  );

  CheckinCheckout.associate = (models) => {
    CheckinCheckout.belongsTo(models.User, {
      foreignKey: "emp_id"
    });
  };

  return CheckinCheckout;
};
