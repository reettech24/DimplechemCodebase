'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "aadhar_no", {
      type: Sequelize.STRING,
      allowNull: true, // Temporarily allow NULL values
      unique: true,
    });
    await queryInterface.addColumn("Users", "pan_no", {
      type: Sequelize.STRING,
      allowNull: true, // Temporarily allow NULL values
      unique: true, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "aadhar_no");
    await queryInterface.removeColumn("Users", "pan_no");
  }
};
