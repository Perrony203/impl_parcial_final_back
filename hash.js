const bcrypt = require('bcrypt');

(async () => {
  const password = 'qwe123'; // cámbiala por la que quieras
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hash generado:', hash);
})();