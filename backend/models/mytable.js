'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mytable = sequelize.define('Mytable', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    circlename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regionname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    divisionname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    areaname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    statename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    modelName: 'Mytable',
    tableName: 'mytable', // Change to your actual table name if different
    timestamps: true, // Add createdAt and updatedAt columns
  });

  // Define associations if needed in future
//   Location.associate = function(models) {
    // Example:
    // Location.belongsTo(models.SomeModel, { foreignKey: 'some_id' });
//   };

  return Mytable;
};
