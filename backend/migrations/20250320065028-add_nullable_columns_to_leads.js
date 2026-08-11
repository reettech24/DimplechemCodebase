'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Leads', 'last_contact', { 
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'next_followup', { 
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'product_service', { 
      type: Sequelize.BOOLEAN,  
      allowNull: true,
    });

    await queryInterface.addColumn('Leads', 'product_detail', { 
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'quantity', { 
      type: Sequelize.BOOLEAN,  
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'quantity_no', { 
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'special_requirement', { 
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'who_contact_before', { 
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'last_communication', { 
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Leads', 'follow_up_record', { 
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Leads', 'last_contact');
    await queryInterface.removeColumn('Leads', 'next_followup');
    await queryInterface.removeColumn('Leads', 'product_service');
    await queryInterface.removeColumn('Leads', 'product_detail');
    await queryInterface.removeColumn('Leads', 'quantity');
    await queryInterface.removeColumn('Leads', 'quantity_no');
    await queryInterface.removeColumn('Leads', 'special_requirement');
    await queryInterface.removeColumn('Leads', 'who_contact_before');
    await queryInterface.removeColumn('Leads', 'last_communication');
    await queryInterface.removeColumn('Leads', 'follow_up_record');
  }
};
