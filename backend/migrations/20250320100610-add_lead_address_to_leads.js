"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Leads", "lead_address", {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if this field is required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Leads", "lead_address");
  },
};
