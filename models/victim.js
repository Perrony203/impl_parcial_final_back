'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Victim extends Model {
    static associate(models) {
      Victim.hasMany(models.ResistanceAttempt, {
        foreignKey: 'victimId'
      });
    }
  }

  Victim.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      dangerLevel: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
    },
    {
      sequelize,
      modelName: 'Victim',
      tableName: 'Victims',
    }
  );

  return Victim;
};
