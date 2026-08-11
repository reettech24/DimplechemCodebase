'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Customers", "active_status", {
      type: Sequelize.ENUM("active", "deactive"),
      defaultValue: "active",
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "active_status");
  }
};
