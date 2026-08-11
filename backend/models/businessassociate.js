'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessAssociate extends Model {
    static associate(models) {
      BusinessAssociate.hasMany(models.Customer, {
        foreignKey: 'business_associate',
        as: 'customers'
      });
      
    }
  }

  BusinessAssociate.init({
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    associate_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_no: {
      type: DataTypes.STRING,
      aLlowNull:true,
  },
  }, {
    sequelize,
    modelName: 'BusinessAssociate',
    tableName: 'businessassociates',
    hooks: {
        async afterCreate(ba) {
          const generatedCode = `BA${String(ba.id).padStart(2, "0")}`;
          await ba.update({ code: generatedCode });
      },
     },
  });

  return BusinessAssociate;
};
