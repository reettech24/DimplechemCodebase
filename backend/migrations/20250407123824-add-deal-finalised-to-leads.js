"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Leads", "deal_finalised", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // false is stored as 0 in DB
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Leads", "deal_finalised");
  },
};
