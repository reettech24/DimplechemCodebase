// models/marketing_master.js
module.exports = (sequelize, DataTypes) => {
  const MarketingMaster = sequelize.define('MarketingMaster', {
    activity_planned: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    activity_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    complete_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    total_spent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lead_generated: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // name of the table, not the model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }
  }, {
    tableName: 'marketing_master',
    timestamps: true, // if you want createdAt and updatedAt columns
    paranoid: true 
  });

  MarketingMaster.associate = function(models) {
    MarketingMaster.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignedUser'
    });
  };

  return MarketingMaster;
};
