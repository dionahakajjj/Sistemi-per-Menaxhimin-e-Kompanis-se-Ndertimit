const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MaterialUsage = sequelize.define('MaterialUsage', {
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
  materiali_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Material',
      key: 'id'
    }
  },
  sasia: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_perdorimit: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  faza_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ProjectPhase',
      key: 'id'
    }
  }
});

module.exports = MaterialUsage;
