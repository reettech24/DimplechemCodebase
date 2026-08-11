'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cost_workings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nature_of_work: {
        type: Sequelize.STRING,
        allowNull: true
      },
      technology_used: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estimate_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estimate_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      revision_no: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      revision_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      area_to_be_coated: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      thickness_in_mm: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      labour_cost: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cunsumable_cost: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      transport_cost: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      supervision_cost: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      contractor_profit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      over_head_charges: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_application_labour_cost: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_project_cost: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cost_workings');
  }
};
