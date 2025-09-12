'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResistanceContent extends Model {
    static associate(models) {
      // No tiene relaciones directas
    }
  }

  ResistanceContent.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      mediaUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ResistanceContent',
      tableName: 'ResistanceContent',
    }
  );

  return ResistanceContent;
};