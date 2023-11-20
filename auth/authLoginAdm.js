const bd = require('../db/bd');


function verificaAdministrador(username, senha) {
  return new Promise((resolve, reject) => {

    const query = 'SELECT * FROM administrator WHERE email = $1 AND senha = $2';

    bd.query(query, [username, senha], (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.rowCount > 0);
      }
    });
  });
}

module.exports = { verificaAdministrador };