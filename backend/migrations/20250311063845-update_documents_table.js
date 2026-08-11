'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   // Rename existing field (Example: renaming 'old_field_name' to 'new_field_name')
   await queryInterface.renameColumn('Documents', 'file_path', 'documents');

   // Remove unwanted field (Example: removing 'unwanted_field')
   await queryInterface.removeColumn('Documents', 'document_type');
  },

  async down (queryInterface, Sequelize) {
    // Reverse the changes in case of rollback
    await queryInterface.renameColumn('Documents', 'file_path', 'documents');
    await queryInterface.addColumn('Documents', 'document_type', {
      type: Sequelize.STRING, // Change type based on original field type
      allowNull: true,
    });
  }
};
