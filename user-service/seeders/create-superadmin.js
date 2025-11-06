'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Insert superadmin user
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Andrei Mes Manur',
        email: 'superadmin@badplan.com',
        password: hashedPassword,
        role: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the superadmin user
    await queryInterface.bulkDelete('Users', {
      email: 'superadmin@badplan.com'
    }, {});
  }
};
