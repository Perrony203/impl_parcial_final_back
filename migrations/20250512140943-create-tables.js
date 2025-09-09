'use strict';
//Modelo de la base de datos
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tabla Users
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('superadmin', 'daemon'),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Tabla Reports
    await queryInterface.createTable('Reports', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },     
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },      
      createdAt: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Tabla Resitance_attempts
    await queryInterface.createTable('ResistanceAttempts', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },     
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },      
      createdAt: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      victimName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.ENUM('Pending', 'In_proggress', 'Resolved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending'
      },

    });

    // Tabla RewardsPunishments
    await queryInterface.createTable('RewardsPunishments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('reward', 'punishment'),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      daemon: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Tabla ResistanceContent
    await queryInterface.createTable('ResistanceContent', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      mediaUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
 
  down: async (queryInterface, Sequelize) => {
    // Eliminar tablas en orden inverso para evitar errores de FK
    await queryInterface.dropTable('ResistanceContent');
    await queryInterface.dropTable('RewardsPunishments');
    await queryInterface.dropTable('Reports');
    await queryInterface.dropTable('Users');

    // Eliminar enums
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Reports_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_RewardsPunishments_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ResistanceAttempts_state";');
  },
};
