'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Leads', 'meeting_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Leads', 'meeting_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Leads', 'contact_person_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Leads', 'meeting_type');
    await queryInterface.removeColumn('Leads', 'meeting_time');
    await queryInterface.removeColumn('Leads', 'contact_person_name');
  }
};
