"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: true, // Allows NULL
      },
      HSN_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      product_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = Active, 0 = Inactive
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("products");
  },
};
