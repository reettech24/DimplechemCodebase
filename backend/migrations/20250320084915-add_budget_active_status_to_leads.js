module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Leads', 'budget', {
      type: Sequelize.INTEGER,
      allowNull: true
    }).then(() => {
      return queryInterface.addColumn('Leads', 'active_status', {
        type: Sequelize.ENUM('active', 'deactive'),
        allowNull: false,
        defaultValue: 'active'
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Leads', 'budget')
      .then(() => queryInterface.removeColumn('Leads', 'active_status'));
  }
};
