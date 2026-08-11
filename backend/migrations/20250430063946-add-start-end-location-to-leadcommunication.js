'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('leadcommunications', 'start_location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('leadcommunications', 'end_location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('leadcommunications', 'start_location');
    await queryInterface.removeColumn('leadcommunications', 'end_location');
  }
};
