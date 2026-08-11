'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('JobDetails', 'currently_working', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Employee is assumed to be working when added
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('JobDetails', 'currently_working');
  }
};
