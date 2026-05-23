const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  faza_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProjectPhase',
      key: 'id'
    }
  },
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  përshkrimi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prioriteti: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data_fillimit: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  data_mbarimit: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  statusi: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Task;
