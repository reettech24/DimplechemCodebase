'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OutTourExpense extends Model {
    static associate(models) {
      OutTourExpense.belongsTo(models.OutTour, { foreignKey: 'out_tour_id', as: 'tour' });
    }
  }

  OutTourExpense.init(
    {
      out_tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Out Tour ID is required" },
          isInt: { msg: "Out Tour ID must be an integer" },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        validate: {
          isDecimal: { msg: "Amount must be a valid decimal number" },
        },
      },
    },
    {
      sequelize,
      modelName: 'OutTourExpense',
      tableName: 'out_tour_expenses'
    }
  );

  return OutTourExpense;
};
