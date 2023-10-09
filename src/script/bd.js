//Criando Conexao com o banco de dados, pelo Dbeaver
const Client = require('pg').Client
const db = new Client({
    user:'postgres',
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "tcc"
})

db.connect();

module.exports = db;
