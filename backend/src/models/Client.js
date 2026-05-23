const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kompania: {
    type: DataTypes.STRING,
    allowNull: true
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
  adresa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lloji_klientit: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Client;
