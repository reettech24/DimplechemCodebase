'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cost_workings', 'total_material_cost', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('cost_workings', 'cr_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cost_workings', 'total_material_cost');
    await queryInterface.removeColumn('cost_workings', 'cr_id');
  }
};
