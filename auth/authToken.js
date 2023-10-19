const bd = require('../db/bd');

function VerificaCodigoValidacao(codigoValidacao, username) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT email, tokenuser FROM USUARIOS WHERE tokenuser = $1 AND email = $2';
        bd.query(query, [codigoValidacao, username], (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res.rowCount > 0) {
                    resolve(true); // codigoValidacao válido para o usuário correspondente
                } else {
                    console.log(codigoValidacao, username);
                    resolve(false); // codigoValidacao inválido ou não corresponde ao usuário
                }
            }
        });
    });
}

module.exports = {
    VerificaCodigoValidacao
};
