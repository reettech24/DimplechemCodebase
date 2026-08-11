'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Defining relationship: Each document belongs to one user (employee)
      Document.belongsTo(models.User, {
        foreignKey: 'employee_id',
        as: 'employee',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Document.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Ensure this matches your User model's table name
          key: 'id'
        }
      },
      documents: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      sequelize,
      modelName: 'Document',
      tableName: 'documents', // Explicitly specify table name if needed
      timestamps: true // Ensures createdAt & updatedAt are automatically managed
    }
  );

  return Document;
};
