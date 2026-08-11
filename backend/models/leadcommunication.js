module.exports = (sequelize, DataTypes) => {
  const LeadCommunication = sequelize.define('LeadCommunication', {
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    lead_owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    sales_persion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lead_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followup_summary: {
      type: DataTypes.TEXT,
      allowNull:true,
    },
    lead_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lead_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_meeting_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    end_meeting_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    total_hrs_spent: {
      type: DataTypes.TIME,
      allowNull:true,
    },
    next_meeting_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    start_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'leads', // The referenced table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    final_meeting: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
    },
    lead_type: {
      type: DataTypes.STRING,
      allowNull:true,
    },
    meeting_done: {
      type: DataTypes.BOOLEAN,
      defaultValue:false,
    },
  }, {
    tableName: 'leadcommunications',
    timestamps: true,
  });

  LeadCommunication.associate = (models) => {
    LeadCommunication.belongsTo(models.Customer, { foreignKey: 'customer_id' });
    //LeadCommunication.belongsTo(models.User, { foreignKey: 'lead_owner_id',  });
    LeadCommunication.belongsTo(models.User, { foreignKey: 'lead_owner_id',as: 'leadOwner' });
    LeadCommunication.belongsTo(models.User, { foreignKey: 'sales_persion_id', as: 'salesPerson'});
    LeadCommunication.belongsTo(models.Lead, { foreignKey: 'lead_id' ,as:"leads"});
  };

  return LeadCommunication;
};
