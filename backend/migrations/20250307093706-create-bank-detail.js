'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BankDetails', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }, // Assuming Users table exists
        onDelete: 'CASCADE',
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      branch_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BankDetails');
  }
};