'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ResistanceContent', 'mediaUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ResistanceContent', 'mediaUrl', {
      type: Sequelize.STRING, // vuelve a VARCHAR(255) por defecto
      allowNull: true,
    });
  }
};