'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('leadcommunications', 'start_meeting_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('leadcommunications', 'end_meeting_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('leadcommunications', 'next_meeting_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('leadcommunications', 'start_meeting_time');
    await queryInterface.removeColumn('leadcommunications', 'end_meeting_time');
    await queryInterface.removeColumn('leadcommunications', 'next_meeting_time');
  }
};
