// Importa o objeto 'db' que representa a conexão com o banco de dados
const bd = require('../db/bd');

// Função para verificar se um usuário com o email fornecido existe no banco de dados
function verificarUsuario(username) {
  return new Promise((resolve, reject) => {
    // Consulta SQL para selecionar um usuário com o email fornecido
    const query = 'SELECT * FROM usuarios WHERE email = $1';

    // Executa a consulta usando o método 'query' do objeto 'db'
    bd.query(query, [username], (err, res) => {
      if (err) {
        // Em caso de erro, rejeita a Promise com o erro
        reject(err);
      } else {
        // Resolve a Promise com um valor booleano indicando se o usuário existe
        resolve(res.rowCount > 0);
      }
    });
  });
}

// Função para verificar se um usuário com o email e senha fornecidos existe no banco de dados
function verificaSenha(username, senha) {
  return new Promise((resolve, reject) => {
    
    // Consulta SQL para selecionar um usuário com o email e senha fornecidos
    const query = 'SELECT * FROM usuarios WHERE email = $1 AND senha = $2';

    // Executa a consulta usando o método 'query' do objeto 'db'
    bd.query(query, [username, senha], (err, res) => {
      if (err) {
        // Em caso de erro, rejeita a Promise com o erro
        reject(err);
      } else {
        // Resolve a Promise com um valor booleano indicando se o usuário e senha estão corretos
        resolve(res.rowCount > 0);
      }
    });
  });
}

// Exporta as funções para uso em outros módulos
module.exports = {
  verificarUsuario,
  verificaSenha
};
