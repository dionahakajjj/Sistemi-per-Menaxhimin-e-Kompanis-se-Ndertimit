const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  projekti_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Project',
      key: 'id'
    }
  },
  klienti_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Client',
      key: 'id'
    }
  },
  shuma: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  përshkrimi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  data_fatures: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  data_pageses: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  statusi: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Invoice;
