'use strict';
module.exports = (sequelize, DataTypes) => {
  const CostWorkingProduct = sequelize.define('CostWorkingProduct', {
    cost_working_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cost_workings', // Reference to cost_workings table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    // category_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'categories', // Reference to products table
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // },
    category_name:{
      type: DataTypes.STRING,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products', // Reference to products table
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qty_for: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    std_pak: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    std_basic_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    basic_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_material_cost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qty_for_1: {
      type: DataTypes.INTEGER,
      allowNull:true,
    },
  }, {
    sequelize,
    modelName: 'CostWorkingProduct',
    tableName: 'cost_working_products',
    timestamps: true,
  });

  CostWorkingProduct.associate = function(models) {
    CostWorkingProduct.belongsTo(models.CostWorking, { foreignKey: 'cost_working_id' });
    CostWorkingProduct.belongsTo(models.Product, { foreignKey: 'product_id' });
    CostWorkingProduct.belongsTo(models.Category, { foreignKey: 'category_id', as: "category"});
  };

  return CostWorkingProduct;
};
