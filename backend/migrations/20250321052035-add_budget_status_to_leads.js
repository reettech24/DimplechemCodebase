"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Leads", "budget_status", {
      type: Sequelize.BOOLEAN,
      allowNull: true, // ✅ Allow null values
      defaultValue: null, // ✅ Default is null
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Leads", "budget_status");
  },
};
