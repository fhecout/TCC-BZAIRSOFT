const nodemailer = require("nodemailer");

// Configuração do transporter para envio de email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "feliperafaeldocouto0306@gmail.com", // Substitua pelo seu email
    pass: "csilprzftfdwqbhy", // Substitua pela sua senha
  },
});

// Função para enviar o email com o token
function enviarEmailComToken(destinatario, codigoValidacao) {
  const mailOptions = {
    from: "feliperafaeldocouto0306@gmail.com", // Substitua pelo seu email
    to: destinatario,
    subject: "Confirmação de Cadastro",
    text: `Seu token de confirmação: ${codigoValidacao}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o email:", error);
    } else {
      console.log("Email enviado:", info.response);
    }
  });
}

// Função para enviar o email com a senha
function enviarSenha(destinatario, senha) {
  const mailOptionsSenha = {
    from: "feliperafaeldocouto0306@gmail.com",
    to: destinatario,
    subject: "Senha enviada por email do login da BZAirsoft",
    text: `Sua senha é ${senha}`,
  };

  transporter.sendMail(mailOptionsSenha, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o email com senha:", error);
    } else {
      console.log("Email com senha enviado:", info.response);
    }
  });
}

function enviarEmailDesmarcar(destinatario, horario) {
  // Formata a data
  const data = new Date(horario.dia);
  const dataFormatada = data.toLocaleDateString("pt-BR");

  // Assume que horario.horario é uma string 'hh:mm:ss'
  const horaFormatada = horario.horario.substring(0, 5); // pega apenas 'hh:mm'

  const mailOptionsDesmarcar = {
    from: "feliperafaeldocouto0306@gmail.com", // Substitua pelo seu email
    to: destinatario,
    subject: "Horário Desmarcado",
    text: `O seu horário no dia ${dataFormatada} às ${horaFormatada} foi desmarcado, para saber mais, ligue no número da Arena.`,
  };

  transporter.sendMail(mailOptionsDesmarcar, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o email desmarcando horario:", error);
    } else {
      console.log("Email com senha enviado:", info.response);
    }
  });
}

module.exports = { enviarEmailComToken, enviarSenha, enviarEmailDesmarcar };
