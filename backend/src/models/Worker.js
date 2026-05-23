const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mbiemri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  telefoni: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profesioni: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paga_ditore: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  data_punesimit: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  statusi: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Worker;
