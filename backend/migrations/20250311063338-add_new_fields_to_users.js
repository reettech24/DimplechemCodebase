'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'emergency_contact', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'remarks', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'digital_signature', {
      type: Sequelize.TEXT,
      allowNull: true, // Can store base64 signature or file path
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'emergency_contact');
    await queryInterface.removeColumn('Users', 'remarks');
    await queryInterface.removeColumn('Users', 'digital_signature');
  }
};
