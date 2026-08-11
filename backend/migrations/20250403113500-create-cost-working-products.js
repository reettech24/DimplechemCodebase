'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cost_working_products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cost_working_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'cost_workings', // Reference to cost_workings table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'products', // Reference to products table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      qty_for: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      std_pak: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      std_basic_rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      basic_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_material_cost: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cost_working_products');
  },
};
