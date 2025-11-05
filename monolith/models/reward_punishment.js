'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RewardPunishment extends Model {
    static associate(models) {
      RewardPunishment.belongsTo(models.User, {
        foreignKey: 'daemon'
      });
    }
  }

  RewardPunishment.init(
    {
      type: {
        type: DataTypes.ENUM('reward', 'punishment'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'RewardPunishment',
      tableName: 'RewardsPunishments',
      timestamps: false
    }
  );

  return RewardPunishment;
};
