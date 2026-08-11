"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("checkin_checkout", "checkin_location", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("checkin_checkout", "checkout_location", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn("checkin_checkout", "data", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("checkin_checkout", "checkin_location");
    await queryInterface.removeColumn("checkin_checkout", "checkout_location");
    await queryInterface.changeColumn("checkin_checkout", "data", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
