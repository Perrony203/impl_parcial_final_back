'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // No associations in this microservice
      // ResistanceAttempt and RewardPunishment are in another service
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('superadmin', 'daemon'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    }
  );

  return User;
};
