"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Customers", "address_2", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Customers", "address_3", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Customers", "address_4", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "address_2");
    await queryInterface.removeColumn("Customers", "address_3");
    await queryInterface.removeColumn("Customers", "address_4");
  },
};
