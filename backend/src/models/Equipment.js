const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Equipment = sequelize.define('Equipment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lloji: {
    type: DataTypes.STRING,
    allowNull: true
  },
  statusi: {
    type: DataTypes.STRING,
    allowNull: true
  },
  kosto_ditore: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  data_blerjes: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
});

module.exports = Equipment;
