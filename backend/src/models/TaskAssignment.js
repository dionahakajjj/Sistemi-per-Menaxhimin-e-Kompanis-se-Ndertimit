const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TaskAssignment = sequelize.define('TaskAssignment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  detyra_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Task',
      key: 'id'
    }
  },
  punetori_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Worker',
      key: 'id'
    }
  },
  data_caktimit: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  orët_punuara: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0
  }
});

module.exports = TaskAssignment;
