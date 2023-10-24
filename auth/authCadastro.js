const bd = require('../db/bd')
const jwt = require('jsonwebtoken');
const { enviarEmailComToken } = require('../email/email');

function VerificaCadastro(cpf, username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT CPF, email FROM usuarios WHERE (cpf = $1 OR email = $2)';

        bd.query(query, [cpf, username], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rowCount > 0)
            }
        });
    });
}


function VerificaEmail(username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT email FROM usuarios WHERE (email = $1)';

        bd.query(query, [username], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rowCount > 0)
                console.log(username)
            }
        });
    });
}

async function cadastrarUsuario(username, cpf, senha, nome, telefone) {
    try {
        const cadastroRegistrado = await VerificaCadastro(cpf, username);

        if (cadastroRegistrado) {
            throw new Error('CPF ou email já cadastrado');
        }

        const codigoValidacao = Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;

        const inserirCadastro = 'INSERT INTO Usuarios (email,senha,nome, cpf, telefone) VALUES ($1,$2,$3,$4,$5)';
        bd.query(inserirCadastro, [username, cpf, senha, nome, telefone], (err, res) => {
            if (err) {
                console.error('Erro ao cadastrar usuário:', err);
            } else {
                console.log('Usuário cadastrado com sucesso');
                EnviarToken(username, codigoValidacao);
            }        
        });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);
    }
}

function EnviarToken(username, codigoValidacao) {
    const incluirTokenQuery = `UPDATE USUARIOS SET tokenUser = $1 WHERE email = $2`;
    bd.query(incluirTokenQuery, [codigoValidacao.toString(), username], (err, res) => {
        if (err) {
            console.error('Erro ao inserir token no banco de dados:', err);
        } else {
            console.log('Token inserido com sucesso');
            // Envia o email com o token para o usuário
            enviarEmailComToken(username, codigoValidacao); // Use a variável 'token' aqui
            console.log(codigoValidacao);
            return username;
        }
    });
}

module.exports = {
    VerificaCadastro,
    cadastrarUsuario,
    VerificaEmail,
    EnviarToken
};