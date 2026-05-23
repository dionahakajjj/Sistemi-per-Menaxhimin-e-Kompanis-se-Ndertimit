const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectPhase = sequelize.define('ProjectPhase', {
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
  emri: {
    type: DataTypes.STRING,
    allowNull: false
  },
  përshkrimi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rendi: {
    type: DataTypes.INTEGER,
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
  },
  përqindja: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  }
});

module.exports = ProjectPhase;
