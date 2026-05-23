const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  përshkrimi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  klienti_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Client',
      key: 'id'
    }
  },
  lokacioni: {
    type: DataTypes.STRING,
    allowNull: true
  },
  buxheti: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  data_fillimit: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
});

module.exports = Project;
