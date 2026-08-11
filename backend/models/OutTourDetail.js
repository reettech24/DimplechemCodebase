'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OutTourDetail extends Model {
    static associate(models) {
      OutTourDetail.belongsTo(models.OutTour, { foreignKey: 'out_tour_id', as: 'tour' });
    }
  }

  OutTourDetail.init(
    {
      out_tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Out Tour ID is required" },
          isInt: { msg: "Out Tour ID must be an integer" },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      place_of_visit: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'OutTourDetail',
      tableName: 'out_tour_details'
    }
  );

  return OutTourDetail;
};
