const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const { verificarUsuario, verificaSenha } = require('../auth/authlogin');
const { VerificaCadastro, cadastrarUsuario, VerificaEmail } = require('../auth/authCadastro');
const { VerificaCodigoValidacao } = require('../auth/authtoken');
const { enviarSenha } = require('./email');
const { generatePDF } = require('./pdf');
const db = require('./bd');
const fs = require('fs');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');


// Definindo o caminho absoluto para a pasta "TCC-BZAIRSOFT"
const absolutePath = path.join(__dirname, '../../../TCC-BZAIRSOFT');

// Configurando o diretório público para servir os arquivos estáticos
app.use(express.static(absolutePath));
app.use(express.urlencoded({ extended: true })); // Middleware para tratar dados do formulário

app.use(cookieParser());


function gerarToken(username) {
  const segredo = 'BZAirsoftArenaTCC';
  const token = jwt.sign({ username }, segredo, { expiresIn: '1h' }); // Define um tempo de expiração para o token (1 hora)
  return token;
}


// Rota para a página inicial (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(absolutePath, 'index.html'));
});

// Rota para a página de login (login.html)
app.get('/login', (req, res) => {
  res.sendFile(path.join(absolutePath, 'login.html'));
});

// Rota para a página de teste depois do login (teste.html)
app.get('/teste', (req, res) => {
  const token = req.cookies.token; // Obtenha o token do cookie

  if (!token) {
    return res.redirect('/login'); // Redirecione para a página de login se o token não estiver presente
  }

  jwt.verify(token, 'BZAirsoftArenaTCC', (err, decoded) => { // Verifique o token
    if (err) {
      return res.redirect('/login'); // Redirecione para a página de login se o token for inválido
    }

    // Se o token for válido, continue com a lógica da rota protegida
    res.sendFile(path.join(absolutePath, 'teste.html'));
  });
});



app.get('/codigoValidacao', (req, res) => {
  const username = req.query.username;
  res.render(path.join(absolutePath, 'token.html'), { username, codigoValidacao });
});

app.get('/adm', (req, res) => {
  res.render(path.join(absolutePath, 'adm.html'));
});

app.get('/gerar-pdf', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM usuarios');

    const outputPath = await generatePDF(results.rows); // Chame a função generatePDF

    // Forneça o PDF diretamente como resposta para download
    res.download(outputPath, 'output.pdf', err => {
      if (err) {
        console.error('Erro ao baixar o PDF:', err);
        res.status(500).send('Erro ao baixar o PDF.');
      } else {
        console.log('PDF baixado com sucesso:', outputPath);

        // Remova o arquivo PDF após o download
        fs.unlinkSync(outputPath);
        console.log('PDF removido:', outputPath);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar PDF.');
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token'); // Remova o cookie de token
  res.redirect('/login'); // Redirecione o usuário de volta para a página de login
});

// Rota para servir o arquivo tabela.html
app.get('/tabela.html', (req, res) => {
  res.sendFile(path.join(absolutePath, 'tabela.html'));
});

app.get('/horarios', async (req, res) => {
  try {
    // Realiza a consulta no banco de dados
    const results = await db.query('SELECT id, dia, horario, disp FROM horarios_disponiveis');
    // Retorna os resultados em formato JSON
    res.json(results.rows);
  } catch (error) {
    console.error('Erro na consulta ao banco de dados:', error);
    res.status(500).json({ error: 'Erro ao buscar horários' });
  }
});










app.post('/cadastro', async (req, res) => {
  const { username, senha, nome, cpf } = req.body;
  const CadastroExiste = await VerificaCadastro(cpf, username);
  if (CadastroExiste) {
    res.send('CPF ou Email ja foram informados')
  } else {
    cadastrarUsuario(username, senha, nome, cpf);
    res.redirect(`/token.html?username=${username}`);
  }
}
)






// Rota para processar o envio do formulário de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const usuarioExiste = await verificarUsuario(username);
  const senhaConfere = await verificaSenha(username, password);
  // Verificar se o usuário existe usando a função do módulo "authlogin.js"
  if (usuarioExiste && senhaConfere) {
    const token = gerarToken(username); // Gera um token JWT
    res.cookie('token', token, { httpOnly: true }); // Configuramdo o token como um cookie seguro e httpOnly
    res.redirect('/horarios.html');
  } else {
    // Caso contrário, exibir uma mensagem de erro na página de login
    res.send('Usuário inválido.');
  }
});







app.post('/esqueceuSenha', async (req, res) => {
  const { username } = req.body

  try {
    const cadastroRegistrado = await VerificaEmail(username);

    if (cadastroRegistrado) {
      async function buscarSenhaNoBanco(username) {
        return new Promise((resolve, reject) => {
          const query = 'SELECT senha FROM usuarios WHERE email = $1';

          db.query(query, [username], (err, res) => {
            if (err) {
              reject(err);
            } else {
              if (res.rows.length > 0) {
                const senha = res.rows[0].senha;
                resolve(senha);
              } else {
                resolve(null); // Retorna null se o e-mail não for encontrado
              }
            }
          });
        });
      }
      const senha = await buscarSenhaNoBanco(username)
      if (senha) {
        enviarSenha(username, senha);

        res.status(200).send('Email Enviado com sucesso')

      } else {
        res.status(404).send('Senha não encontrada no banco de dados.');
      }
    } else {
      res.status(404).send('E-mail não encontrado no banco de dados.');
    }
  } catch (error) {
    console.error('Erro ao processar a solicitação de esqueceuSenha:', error);
    res.status(500).send('Erro ao processar a solicitação de esqueceuSenha.');
  }
});


app.post('/codigoValidacao', async (req, res) => {
  const { codigoValidacao, username } = req.body;

  // Verificar o codigoValidacao usando a função verificaCodigoValidação
  const codigoValidacaoValido = await VerificaCodigoValidacao(codigoValidacao, username);

  if (codigoValidacaoValido) {
    try {
      const query = 'UPDATE usuarios SET tokenValidado = true WHERE tokenUser = $1 and email = $2';
      const results = await db.query(query, [codigoValidacao, username]);
      const token = gerarToken(username); // Gera um token JWT
      res.cookie('token', token, { httpOnly: true }); // Configuramdo o token como um cookie seguro e httpOnly 
      res.redirect('/teste.html');
    } catch (error) {
      console.error('Erro ao atualizar o tokenValidado:', error);
      res.status(500).send('Erro interno ao atualizar o tokenValidado');
    }
  } else {
    res.send('codigoValidacao inválido ou não corresponde ao usuário');
  }
});








app.post('/horarios', async (req, res) => {
  const { dia } = req.body;


  if (dia === null) {
    res.send('/horarios.html')
  }

  const result = await db.query(
    'SELECT id, horario FROM horarios_disponiveis WHERE dia = $1 and disp=true',
    [dia]
  );

  const horarios = result.rows;

  res.json({
    horarios
  });
});








app.get('/pagina-horario', (req, res) => {
  const horarioId = req.query.id;

  db.query('SELECT horario, dia, disp, valor, id from horarios_disponiveis where id=$1', [horarioId])
    .then(result => {
      const horario = result.rows[0]; // Assume que você está pegando apenas um resultado

      // Lê o arquivo HTML
      fs.readFile(path.join(absolutePath, 'pagina-horario.html'), 'utf8', (err, data) => {
        if (err) {
          res.status(500).send('Erro ao ler o arquivo HTML');
          return;
        }

        function formatarDataBrasileira(dataOriginal) {
          const dia = dataOriginal.getDate().toString().padStart(2, '0'); // Dia com zero à esquerda
          const mes = (dataOriginal.getMonth() + 1).toString().padStart(2, '0'); // Mês com zero à esquerda
          const ano = dataOriginal.getFullYear();

          return `${dia}/${mes}/${ano}`;
        }

        const dataOriginal = new Date(horario.dia);
        const dataFormatada = formatarDataBrasileira(dataOriginal);





        const url = `https://gerarqrcodepix.com.br/api/v1?nome=BZAirsoft&cidade=Curitiba&chave=feliperafaeldocouto@hotmail.com&valor=${horario.valor}&saida=br`;

        axios.get(url)
          .then((response) => {
            // Verifica se a resposta é bem-sucedida (status 200)
            if (response.status === 200) {
              const conteudo = response.data; // Obtenha todo o conteúdo da resposta
              const brcode = conteudo.brcode; // Obtenha a parte 'brcode' da resposta

              // Substitui o marcador no HTML com o conteúdo da URL
              const novoHTML = data.replace('<!-- Conteúdo da URL será inserido aqui -->', brcode);

              // Substitui o valor no HTML com o valor do banco de dados
              const htmlComValores = novoHTML.replace('valor=00.00', `valor=${horario.valor}`);

              const valor = htmlComValores.replace('<div class="valor"></div>', `<div class="valor">Valor:${horario.valor}</div>`)

              const idHorario = valor.replace('<div class="idHorario"> ID do Horario: </div>', `<div class="idHorario"> ID do Horario:${horario.id} </div>`)

              const Whatsapp = idHorario.replace('https://wa.me//5541999575249?text=Agendamento%20da%20Arena:%20ID:0%20as%20H00:00', `https://wa.me//5541999575249?text=Olá,%20o%20codigo%20do%20meu%20agendamento%20é%20*${horario.id}*%20as%20${horario.horario}%20do%20Dia:%20${dataFormatada},%20segue%20meu%20comprovante%20de%20pagamento!`)


              // Envia o HTML atualizado para o cliente
              res.send(Whatsapp);
            } else {
              console.log('Não foi possível acessar a página.');
            }
          })
          .catch((error) => {
            console.error('Erro ao acessar a página:', error);
          });
      });
    })
    .catch(error => {
      res.status(500).send('Erro ao buscar informações do horário');
    });
});





//ADMINISTRAÇÃO



app.post('/gerar-pdf', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM usuarios');

    await generatePDF(results.rows); // Chame a função generatePDF

    const outputPath = __dirname + '/output.pdf';
    res.sendFile(outputPath); // Enviar o arquivo PDF como resposta
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar PDF.');
  }
});








// Rota para adicionar horários
app.post('/adicionar-horario', async (req, res) => {
  const { dia, horario, valor } = req.body;

  try {
    const query = await db.query('select * from horarios_disponiveis where dia = $1 and horario = $2 and disp=true', [dia, horario])
    if (!query) {
      // Insira o novo horário na tabela horarios_disponiveis
      await db.query('INSERT INTO horarios_disponiveis (dia, horario, disp, valor) VALUES ($1, $2, true, $3)', [dia, horario, valor]);
      await db.query('INSERT INTO log_alteracoes (acao, dia, horario, valor , data_hora) VALUES ($1, $2, $3, $4, NOW())', ['Inclusao', dia, horario, valor]);
    } else {
      res.send('Horario ja esta inserido')
    }

    res.redirect('/adm.html'); // Redirecione de volta para a página de administração
  } catch (error) {
    console.error('Erro ao adicionar horário:', error);
    res.status(500).send('Erro ao adicionar horário.');
  }
});






// Rota para gerar relatório com filtro
app.post('/gerar-relatorio', async (req, res) => {
  const { filtro } = req.body;

  try {
    // Execute a consulta SQL com base no filtro e obtenha os resultados
    const result = await db.query('SELECT * FROM horarios_disponiveis WHERE dia = $1', [filtro]);

    // Gere o relatório com base nos resultados
    let relatorioHTML = '<h2>Relatório</h2>';
    relatorioHTML += '<ul>';
    for (const row of result.rows) {
      relatorioHTML += `<li>Dia: ${row.dia}, Horário: ${row.horario}, Disponível: ${row.disp}</li>`;
    }
    relatorioHTML += '</ul>';

    res.send(relatorioHTML);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).send('Erro ao gerar relatório.');
  }
});








// Rota para gerar relatório em uma planilha Excel
app.post('/gerar-relatorio-excel', async (req, res) => {
  const { filtroInicial, filtroFinal } = req.body;

  try {
    const result = await db.query('SELECT * FROM horarios_disponiveis WHERE dia BETWEEN $1 AND $2', [filtroInicial, filtroFinal]);

    // Crie uma nova planilha Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    // Defina os cabeçalhos da planilha
    worksheet.columns = [
      { header: 'Dia', key: 'dia', width: 20 },
      { header: 'Horário', key: 'horario', width: 20 },
      { header: 'Disponível', key: 'disp', width: 15 },
    ];

    // Preencha a planilha com os dados do banco de dados
    result.rows.forEach(row => {
      // Formate a data e a hora corretamente
      const diaFormatado = row.dia.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const horarioFormatado = row.horario; // A hora já está no formato correto

      worksheet.addRow({
        dia: diaFormatado,
        horario: horarioFormatado,
        disp: row.disp ? 'Sim' : 'Não', // Converta true/false em Sim/Não
      });
    });

    // Crie um buffer contendo a planilha Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Defina o cabeçalho da resposta para indicar que é um arquivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');

    // Envie a planilha Excel como resposta
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).send('Erro ao gerar relatório.');
  }
});





// Rota para gerar relatório em uma planilha Excel com informações de log, dias e horários
app.post('/gerar-relatorio-log-excel', async (req, res) => {
  const { filtroInicial, filtroFinal } = req.body;

  try {
    // Selecione os registros do log e junte com a tabela de horários disponíveis
    const result = await db.query(`
      SELECT
        log.acao,
        log.observacao,
        horarios.dia,
        horarios.horario,
        log.data_hora
      FROM log_alteracoes log
      INNER JOIN horarios_disponiveis horarios
      ON log.dia = horarios.dia AND log.horario = horarios.horario
      WHERE horarios.dia BETWEEN $1 AND $2
    `, [filtroInicial, filtroFinal]);

    // Crie uma nova planilha Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Log');

    // Defina os cabeçalhos da planilha
    worksheet.columns = [
      { header: 'Ação', key: 'acao', width: 20 },
      { header: 'Observação', key: 'observacao', width: 20 },
      { header: 'Dia', key: 'dia', width: 20 },
      { header: 'Horário', key: 'horario', width: 20 },
      { header: 'Data/Hora', key: 'data_hora', width: 20 },
    ];

    // Preencha a planilha com os dados do banco de dados
    result.rows.forEach(row => {
      worksheet.addRow({
        acao: row.acao,
        observacao: row.observacao,
        dia: row.dia.toISOString().split('T')[0], // Formato YYYY-MM-DD
        horario: row.horario,
        data_hora: row.data_hora.toISOString(), // Formato ISO para data/hora
      });
    });

    // Crie um buffer contendo a planilha Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Defina o cabeçalho da resposta para indicar que é um arquivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-log-com-horarios.xlsx');

    // Envie a planilha Excel como resposta
    res.send(buffer);
  } catch (error) {
    console.error('Erro ao gerar relatório de log:', error);
    res.status(500).send('Erro ao gerar relatório de log.');
  }
});







app.post('/bloquear-horario-Jogador', async (req, res) => {
  const { CPF, observacao, dia, horario, senha } = req.body;

  try {

    const senhaNoBanco = await db.query('SELECT * from administrador where senha = $1', [senha]);


    if (senhaNoBanco.rows.length > 0) {
      console.log('Senha válida. Antes da atualização e inserção no banco de dados.');
      const query = await db.query('select * from horarios_disponiveis where dia = $1 and horario = $2 and disp=false', [dia, horario])
      if (!query) {
        const result = await db.query('UPDATE horarios_disponiveis SET disp = false WHERE cpf = $1 and observacao = $2 AND dia = $3 AND horario = $4', [CPF, observacao, dia, horario]);
        await db.query('INSERT INTO log_alteracoes (acao, observacao, dia, horario, data_hora) VALUES ($1, $2, $3, $4, NOW())', ['Bloqueio de Horário', observacao, dia, horario]);
      }

    } else {
      res.status(401).send('Senha de admin incorreta.');
    }
  } catch (error) {
    console.error('Erro ao bloquear horário:', error);
    res.status(500).send('Erro ao bloquear horário.');
  }
});




// Definindo a Rota do servidor
app.listen(3000, () => {
  console.log('Servidor Em execução em http://localhost:3000');
});
