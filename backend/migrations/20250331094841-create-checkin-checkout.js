"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("checkin_checkout", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      check_in_time: {
        type: Sequelize.DATE, // ✅ Stores both date & time
        allowNull: false,
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      working_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("checkin_checkout");
  },
};
