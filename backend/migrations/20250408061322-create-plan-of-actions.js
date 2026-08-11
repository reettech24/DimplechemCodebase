"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PlanOfActions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Customers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      contact_persion_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sales_persion_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      meeting_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      meeting_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meeting_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      product_sale: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      total_material_qty: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      approx_business: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      project_name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("PlanOfActions");
  },
};
