'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResistanceAttempt extends Model {
    static associate(models) {      
      ResistanceAttempt.belongsTo(models.User, {
        foreignKey: 'createdBy'
      });
      ResistanceAttempt.belongsTo(models.Victim, {
        foreignKey: 'victimId'
      });
    }
  }

  ResistanceAttempt.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM('Pending', 'In_progress', 'Resolved', 'Rejected'),
        defaultValue: 'Pending',
        allowNull: false,
      },      
    },
    {
      sequelize,
      modelName: 'ResistanceAttempt',
      tableName: 'ResistanceAttempts',      
    }
  );

  return ResistanceAttempt;
};