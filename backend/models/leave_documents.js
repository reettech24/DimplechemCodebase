// leave_documents model example
module.exports = (sequelize, DataTypes) => {
  const LeaveDocument = sequelize.define(
    "LeaveDocument",
    {
      leave_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      documents: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "leave_documents", 
      timestamps: false, 
    }
  );

  LeaveDocument.associate = (models) => {
    LeaveDocument.belongsTo(models.Leave, {
      foreignKey: "leave_id",
      as: "leave",
    });
  };

  return LeaveDocument;
};
