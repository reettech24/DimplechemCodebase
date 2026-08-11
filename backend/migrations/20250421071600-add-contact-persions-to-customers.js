'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Customers', 'contact_persion1', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Customers', 'contact_persion2', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Customers', 'contact_persion3', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Customers', 'contact_persion1');
    await queryInterface.removeColumn('Customers', 'contact_persion2');
    await queryInterface.removeColumn('Customers', 'contact_persion3');
  }
};
