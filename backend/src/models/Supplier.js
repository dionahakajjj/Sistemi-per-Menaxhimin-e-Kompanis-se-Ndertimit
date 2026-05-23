const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kontakti: {
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
  specialiteti: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Supplier;
