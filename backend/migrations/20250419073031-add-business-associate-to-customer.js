'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'business_associate', {
      type: Sequelize.STRING,
      allowNull: true, // or false if required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('customers', 'business_associate');
  }
};
