const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  njësia_matëse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  çmimi_njesi: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  furnitori_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Supplier',
      key: 'id'
    }
  },
  sasia_stokut: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  kategoria: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Material;
