module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('marketing_master', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      activity_planned: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      activity_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      complete_date: {
        type: Sequelize.DATEONLY
      },
      total_spent: {
        type: Sequelize.INTEGER
      },
      lead_generated: {
        type: Sequelize.TEXT
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('marketing_master');
  }
};
