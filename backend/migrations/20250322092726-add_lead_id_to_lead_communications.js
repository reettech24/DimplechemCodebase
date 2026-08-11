'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('leadcommunications', 'lead_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'leads', // The name of the referenced table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('leadcommunications', 'lead_id');
  },
};
