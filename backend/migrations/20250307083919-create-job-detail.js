'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobDetails', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Ensure this matches the user model's table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      employment_type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Full-time', 'Part-time', 'Contract', 'Intern']],
            msg: 'Employment type must be Full-time, Part-time, Contract, or Intern',
          },
        },
      },
      date_of_joining: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: { msg: 'Salary must be a valid decimal number' },
        },
      },
      work_location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reporting_manager_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Assuming managers are also in the Users table
          key: 'id',
        },
      },
      offer_letter_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_of_exit: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JobDetails');
  },
};
