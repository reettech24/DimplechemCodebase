'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Leads', 'lead_custom_address', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Leads', 'lead_custom_address');
  }
};
