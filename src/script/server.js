const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const fs = require("fs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");
const { verificarUsuario, verificaSenha } = require("../../auth/authLogin");
const {
  VerificaCadastro,
  cadastrarUsuario,
  VerificaEmail,
  EnviarToken,
  GerarCodigo,
} = require("../../auth/authCadastro");
const { VerificaCodigoValidacao } = require("../../auth/authToken");
const {
  enviarSenha,
  enviarEmailComToken,
  enviarEmailDesmarcar,
} = require("../../email/email");
const { generatePDF } = require("../../pdfs/pdf");
const { verificaAdministrador } = require("../../auth/authLoginADM");
const db = require("../../db/bd");  
const { log } = require("console");
const cron = require("node-cron");





// Definindo o caminho absoluto para a pasta "TCC-BZAIRSOFT"
const absolutePath = path.join(__dirname, "../../../TCC-BZAIRSOFT/src");

// Configurando o diretório público para servir os arquivos estáticos
app.use(express.static(absolutePath));
app.use(express.urlencoded({ extended: true })); // Middleware para tratar dados do formulário
app.use(express.json());

app.use(cookieParser());

function gerarToken(username, cpf) {
  const segredo = "BZAirsoftArenaTCC";
  const token = jwt.sign({ username, cpf }, segredo, { expiresIn: "1h" }); // Define um tempo de expiração para o token (1 hora)
  return token;
}

function formatarData(data) {
  const dataObj = new Date(data);
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
}


// Rota para a página inicial (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(absolutePath, "index.html"));
});

// Rota para a página de login (login.html)
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(absolutePath, "html/cadastro.html"));
});

// Rota para a página de login (login.html)
app.get("/login", (req, res) => {
  res.sendFile(path.join(absolutePath, "html/login.html"));
});

// Rota para a página de login (login.html)
app.get("/bloqueado", (req, res) => {   
  res.sendFile(path.join(absolutePath, "html/bloqueado.html"));
});

// Rota para a página de atualização de perfil
app.get("/atualizarPerfil", async (req, res) => {
  const token = req.cookies.token; // Obtenha o token do cookie

  if (!token) { 
    return res.redirect("/login"); // Redirecione para a página de login se o token não estiver presente
  }

  jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
    // Verifique o token
    if (err) {
      return res.redirect("/login"); // Redirecione para a página de login se o token for inválido
    }
    const username = decoded.username;
    try {
      const results = await db.query(
        "SELECT nome, email, telefone FROM usuarios WHERE email = $1",
        [username]
      );
      const nome = results.rows[0].nome;
      const email = results.rows[0].email;
      const telefone = results.rows[0].telefone;
      // Se o token for válido, continue com a lógica da rota protegida
      fs.readFile(
        path.join(__dirname, "../HTML/atualizarPerfil.html"),
        "utf8",
        (err, data) => {
          if (err) {
            return res.status(500).send("Erro ao ler o arquivo HTML");
          }
          const newData = data
            .replace(
              '<input type="text" id="nome" name="nome" value="InputNome">',
              `<input type="text" id="nome" name="nome" value="${nome}">`
            )
            .replace(
              '<input type="email" id="email" name="email" value="InputEmail">',
              `<input type="email" id="email" name="email" value="${email}">`
            )
            .replace(
              '<input type="text" id="telefone" name="telefone" value="InputTelefone">',
              `<input type="text" id="telefone" name="telefone" value="${telefone}">`
            );
          res.send(newData);
        }
      );
    } catch (error) {
      console.error(
        "Erro ao buscar informações do usuário no banco de dados:",
        error
      );
      return res
        .status(500)
        .send("Erro ao buscar informações do usuário no banco de dados");
    }
  });
});

app.get("/codigoValidacao", (req, res) => {
  const username = req.query.username;
  res.render(path.join(absolutePath, "html/token.html"), {
    username,
    codigoValidacao,
  });
});

app.get("/adm", (req, res) => {
  res.render(path.join(absolutePath, "html/adm.html"));
});

app.get("/gerar-pdf", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM usuarios");

    const outputPath = await generatePDF(results.rows); // Chame a função generatePDF

    // Forneça o PDF diretamente como resposta para download
    res.download(outputPath, "output.pdf", (err) => {
      if (err) {
        console.error("Erro ao baixar o PDF:", err);
        res.status(500).send("Erro ao baixar o PDF.");
      } else {
        console.log("PDF baixado com sucesso:", outputPath);

        // Remova o arquivo PDF após o download
        fs.unlinkSync(outputPath);
        console.log("PDF removido:", outputPath);
      }
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).send("Erro ao gerar PDF.");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token"); // Remova o cookie de token
  res.redirect("/login"); // Redirecione o usuário de volta para a página de login
});

// Rota para servir o arquivo tabela.html
app.get("/tabela.html", (req, res) => {
  res.sendFile(path.join(absolutePath, "tabela.html"));
});

app.get("/horarios", async (req, res) => {
  try {
    const token = req.cookies.token; // Obtenha o token do cookie
    if (!token) {
      return res.redirect("/login"); // Redirecione para a página de login se o token não estiver presente
    }

    jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
      // Verifique o token
      if (err) {
        return res.redirect("/login"); // Redirecione para a página de login se o token for inválido
      }

      const username = decoded.username;
      try {
        const userResult = await db.query(
          "SELECT nome FROM usuarios WHERE email = $1",
          [username]
        );
        const nome = userResult.rows[0].nome;

        const horariosResult = await db.query(
          "SELECT id, dia, horario, disp FROM horarios_disponiveis"
        );
        const horarios = horariosResult.rows;

        const responseData = {
          usuario: nome,
          horarios: horarios,
        };

        // Lendo o arquivo HTML
        fs.readFile(
          path.join(absolutePath, "html/teste.html"),
          "utf8",
          (err, data) => {
            if (err) {
              return res.status(500).send("Erro ao ler o arquivo HTML");
            }
            const newData = data.replace(
              '<div class="usuario"></div>',
              `<div class="usuario">${nome}</div>`
            );
            // Envia a resposta com o HTML atualizado
            res.send(newData);
          }
        );
      } catch (error) {
        console.error("Erro na consulta ao banco de dados:", error);
        res
          .status(500)
          .json({ error: "Erro ao buscar horários ou nome de usuário" });
      }
    });
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    res.status(500).json({ error: "Erro ao verificar o token" });
  }
});

app.post("/cadastro", async (req, res) => {
  const { username, senha, nome, cpf, telefone } = req.body;
  const CadastroExiste = await VerificaCadastro(cpf, username);
  if (CadastroExiste) {
    res.status(401).send("CPF ou Email ja foram informados");
  } else {
    cadastrarUsuario(username, senha, nome, cpf, telefone);
    res.redirect(`html/token.html?username=${username}`);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const usuarioExiste = await verificarUsuario(username);
  const senhaConfere = await verificaSenha(username, password);

  if (usuarioExiste && senhaConfere) {
    const results = await db.query(
      "SELECT tokenvalidado FROM usuarios WHERE email = $1",
      [username]
    );
    const tokenValidado = results.rows[0].tokenvalidado;

    if (tokenValidado) {
      const token = gerarToken(username);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/user");
    } else {
      GerarCodigo(username);
      res.redirect(`html/token.html?username=${username}`);
    }
  } else {
    res.status(401).send("Usuário inválido."); // Enviar resposta com status de erro
  }
});

app.post("/loginAdm", async (req, res) => {
  const { username, senha } = req.body;

  const LoginConfere = await verificaAdministrador(username, senha);

  if (LoginConfere) {
    res.redirect("html/adm.html");
  } else {
    res.send("Usuário inválido.");
  }
});

app.post("/esqueceuSenha", async (req, res) => {
  const { username } = req.body;

  try {
    const cadastroRegistrado = await VerificaEmail(username);

    if (cadastroRegistrado) {
      async function buscarSenhaNoBanco(username) {
        return new Promise((resolve, reject) => {
          const query = "SELECT senha FROM usuarios WHERE email = $1";

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
      const senha = await buscarSenhaNoBanco(username);
      if (senha) {
        enviarSenha(username, senha);

        res.status(200).send("Email Enviado com sucesso");
      } else {
        res.status(404).send("Senha não encontrada no banco de dados.");
      }
    } else {
      res.status(404).send("E-mail não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao processar a solicitação de esqueceuSenha:", error);
    res.status(500).send("Erro ao processar a solicitação de esqueceuSenha.");
  }
});

app.post("/codigoValidacao", async (req, res) => {
  const { codigoValidacao, username } = req.body;

  // Verificar o codigoValidacao usando a função verificaCodigoValidação
  const codigoValidacaoValido = await VerificaCodigoValidacao(
    codigoValidacao,
    username
  );
  if (codigoValidacaoValido) {
    try {
      const query =
        "UPDATE usuarios SET tokenValidado = true WHERE tokenUser = $1 and email = $2";
      const results = await db.query(query, [codigoValidacao, username]);
      const token = gerarToken(username); // Gera um token JWT
      res.cookie("token", token, { httpOnly: true }); // Configuramdo o token como um cookie seguro e httpOnly
      res.redirect("/user");
    } catch (error) {
      console.error("Erro ao atualizar o tokenValidado:", error);
      res.status(500).send("Erro interno ao atualizar o tokenValidado");
    }
  } else {
    res.status(401).send("Token inválido");
  }
});

app.post("/AgendadorJogador", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("Token não fornecido.");
  }

  jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
    if (err) {
      return res.status(401).send("Token inválido.");
    }

    const username = decoded.username;
    const Usuario = await db.query(
      "SELECT cpf, id, nome FROM usuarios WHERE email = $1",
      [username]
    );

    const userId = Usuario.rows[0].id;

    if (Usuario.rowCount === 0) {
      return res.status(404).send("Usuário não encontrado.");
    }

    const result = await db.query(
      `SELECT hu.horario_id, hd.dia, hd.horario, hd.disp, hd.cliente_cpf
      FROM horariosUsuarios hu
      JOIN horarios_disponiveis hd ON hu.horario_id = hd.id
      WHERE hu.usuario_id = $1;
      `,
      [userId]
    );

    const agendados = result.rows.map((item) => {
      // Formate a data aqui
      item.dia = formatarData(item.dia);
      return item;
    });

    res.json({
      agendados,
    });
  });
});

app.post("/horarios", async (req, res) => {
  const { dia } = req.body;

  if (dia === null) {
    res.send("html/horarios.html");
  }

  const agora = new Date();
  const horaAtual = agora.toISOString().slice(11, 19);
  const hoje = new Date().toISOString().slice(0, 10);

  let mensagem = "";

  // Verificar se a data inserida é menor que a data atual
  if (new Date(dia) < new Date(hoje)) {
    mensagem = "INSIRA UMA DATA MAIOR QUE A ATUAL";
  }

  const result = await db.query(
    "SELECT id, horario FROM horarios_disponiveis WHERE dia = $1 and disp=1",
    [dia]
  );

  const horarios = result.rows;

  res.json({
    horarios,
    mensagem,
  });
});

app.get("/pagina-horario", (req, res) => {
  const horarioId = req.query.id;
  const token = req.cookies.token; // Obtenha o token do cookie

  if (!token) {
    return res.status(401).send("Token não fornecido.");
  }

  jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
    if (err) {
      return res.status(401).send("Token inválido.");
    }

    const username = decoded.username;
    const Usuario = await db.query(
      "SELECT cpf, id, nome FROM usuarios WHERE email = $1",
      [username]
    );

    const userNome = Usuario.rows[0].nome;
    const userCPF = Usuario.rows[0].cpf;

    if (Usuario.rowCount === 0) {
      return res.status(404).send("Usuário não encontrado.");
    }

    db.query(
      "SELECT horario, dia, disp, valor, id from horarios_disponiveis where id=$1",
      [horarioId]
    )
      .then((result) => {
        const horario = result.rows[0];

        fs.readFile(
          path.join(absolutePath, "html/pagina-horario.html"),
          "utf8",
          (err, data) => {
            if (err) {
              res.status(500).send("Erro ao ler o arquivo HTML");
              return;
            }

            function formatarDataBrasileira(dataOriginal) {
              const dia = dataOriginal.getDate().toString().padStart(2, "0");
              const mes = (dataOriginal.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const ano = dataOriginal.getFullYear();

              return `${dia}/${mes}/${ano}`;
            }

            const dataOriginal = new Date(horario.dia);
            const dataFormatada = formatarDataBrasileira(dataOriginal);

            const url = `https://gerarqrcodepix.com.br/api/v1?nome=BZAirsoft&cidade=Curitiba&chave=feliperafaeldocouto@hotmail.com&valor=${horario.valor}&saida=br`;

            axios
              .get(url)
              .then((response) => {
                if (response.status === 200) {
                  const conteudo = response.data;
                  const brcode = conteudo.brcode;

                  const novoHTML = data.replace(
                    "<!-- Conteúdo da URL será inserido aqui -->",
                    brcode
                  );
                  const htmlComValores = novoHTML.replace(
                    "valor=00.00",
                    `valor=${horario.valor}`
                  );
                  const valor = htmlComValores.replace(
                    '<div class="valor"></div>',
                    `<div class="valor">Valor:${horario.valor}</div>`
                  );
                  const idHorario = valor.replace(
                    '<div class="idHorario"> ID do Horario: </div>',
                    `<div class="idHorario"> ID do Horario:${horario.id} </div>`
                  );
                  const Whatsapp = idHorario.replace(
                    "https://wa.me//5541999575249?text=Agendamento%20da%20Arena:%20ID:0%20as%20H00:00",
                    `https://wa.me//5541999575249?text=Olá,%20o%20codigo%20do%20meu%20agendamento%20é%20*${horario.id}*%20as%20${horario.horario}%20do%20Dia:%20${dataFormatada},%20segue%20meu%20comprovante%20de%20pagamento!`
                  );
                  const id = Whatsapp.replace(
                    "ID_DO_HORARIO_AQUI",
                    `${horario.id}`
                  );

                  let statusHtml = "";
                  switch (horario.disp) {
                    case 1:
                      statusHtml =
                        '<div class="status-horario status-disponivel">Horário disponível</div>';
                      break;
                    case 2:
                      statusHtml =
                        '<div class="status-horario status-analise">Horário em Análise</div>';
                      break;
                    case 3:
                      statusHtml =
                        '<div class="status-horario status-bloqueado">Horário Bloqueado</div>';
                      break;
                    default:
                      statusHtml =
                        '<div class="status-horario">Status desconhecido</div>';
                  }

                  const finalHtml = id.replace(
                    "Status do horário será inserido aqui",
                    statusHtml
                  );

                  const nomeUsuario = finalHtml.replace(
                    '<div class="nome">Nome:</div>',
                    `<div class="nome">Nome:${userNome}</div>`
                  );
                  const CPFUsuario = nomeUsuario.replace(
                    '<div class="cpf">CPF:</div>',
                    `<div class="cpf">CPF:${userCPF}</div>`
                  );

                  res.send(CPFUsuario);
                } else {
                  console.log("Não foi possível acessar a página.");
                }
              })
              .catch((error) => {
                console.error("Erro ao acessar a página:", error);
              });
          }
        );
      })
      .catch((error) => {
        res.status(500).send("Erro ao buscar informações do horário");
      });
  });

  app.post("/agendar", async (req, res) => {
    const { horarioId } = req.body;
    const token = req.cookies.token; // Obtenha o token do cookie

    if (!token) {
      return res.status(401).send("Token não fornecido.");
    }

    jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
      if (err) {
        return res.status(401).send("Token inválido.");
      }

      const username = decoded.username;

      try {
        // Obtendo o ID do usuário e o estado de bloqueio através do token (username)
        const userResults = await db.query(
          "SELECT cpf, id, bloqueado FROM usuarios WHERE email = $1",
          [username]
        );
        if (userResults.rowCount === 0) {
          return res.status(404).send("Usuário não encontrado.");
        }

        const userId = userResults.rows[0].id;
        const userCPF = userResults.rows[0].cpf;
        const bloqueado = userResults.rows[0].bloqueado;

        // Verifique se o cliente está bloqueado
        if (bloqueado) {
          // Se bloqueado, não mude disp e informe o cliente
          return res.redirect("/bloqueado");
        } else {
          // Se não estiver bloqueado, tente atualizar o horário
          const queryResult = await db.query(
            "UPDATE horarios_disponiveis SET disp = 2, cliente_cpf = $2 WHERE id = $1 AND disp = 1 RETURNING dia, horario",
            [horarioId, userCPF]
          );

          if (queryResult.rowCount > 0) {
            const dia = queryResult.rows[0].dia;
            const horario = queryResult.rows[0].horario;

            await db.query(
              "INSERT INTO HorariosUsuarios (usuario_id, horario_id, dia, horario, cpf) VALUES ($1, $2, $3, $4, $5)",
              [userId, horarioId, dia, horario, userCPF]
            );
            return res.redirect(`/pagina-horario?id=${horarioId}`);
          } else {
            res.redirect('html/AgendadoJogador.html')
          }
        }
      } catch (error) {
        console.error("Erro ao bloquear o horário:", error);
        return res
          .status(500)
          .send("Erro interno do servidor ao bloquear o horário.");
      }
    });
  });
});

// Rota para a página de perfil do usuário
app.get("/perfil", async (req, res) => {
  const token = req.cookies.token; // Obtenha o token do cookie

  if (!token) {
    return res.redirect("/login"); // Redirecione para a página de login se o token não estiver presente
  }
  jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
    // Verifique o token
    if (err) {
      return res.redirect("/login"); // Redirecione para a página de login se o token for inválido
    }
    const username = decoded.username;
    try {
      const results = await db.query(
        "SELECT nome, email, telefone, cpf FROM usuarios WHERE email = $1",
        [username]
      );
      const { nome, email, telefone, cpf } = results.rows[0];

      // Se o token for válido, continue com a lógica da rota protegida
      fs.readFile(
        path.join(absolutePath, "HTML/perfil.html"),
        "utf8",
        (err, data) => {
          if (err) {
            return res.status(500).send("Erro ao ler o arquivo HTML");
          }
          const newData = data
            .replace(
              '<div class="nome"></div>',
              `<div class="nome">${nome}</div>`
            )
            .replace(
              '<div class="email"></div>',
              `<div class="email">${email}</div>`
            )
            .replace(
              '<div class="telefone"></div>',
              `<div class="telefone">${telefone}</div>`
            )
            .replace(
              '<div class="CPF"></div>',
              `<div class="CPF">${cpf}</div>`
            );
          res.send(newData);
        }
      );
    } catch (error) {
      console.error(
        "Erro ao buscar informações do usuário no banco de dados:",
        error
      );
      return res
        .status(500)
        .send("Erro ao buscar informações do usuário no banco de dados");
    }
  });
});

// Rota para a página de perfil do usuário
app.get("/User", async (req, res) => {
  const token = req.cookies.token; // Obtenha o token do cookie

  if (!token) {
    return res.redirect("/login"); // Redirecione para a página de login se o token não estiver presente
  }
  jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
    // Verifique o token
    if (err) {
      return res.redirect("/login"); // Redirecione para a página de login se o token for inválido
    }
    const username = decoded.username;
    try {
      const results = await db.query(
        "SELECT nome FROM usuarios WHERE email = $1",
        [username]
      );
      const { nome } = results.rows[0];

      // Se o token for válido, continue com a lógica da rota protegida
      fs.readFile(
        path.join(absolutePath, "HTML/user.html"),
        "utf8",
        (err, data) => {
          if (err) {
            return res.status(500).send("Erro ao ler o arquivo HTML");
          }
          const newData = data.replace(
            "<h1>Seja Bem-vindo(a) <span>nome Usuario</span>!</h1>",
            `<h1>Seja Bem-vindo(a) <span>${nome}</span>!</h1>`
          );
          res.send(newData);
        }
      );
    } catch (error) {
      console.error(
        "Erro ao buscar informações do usuário no banco de dados:",
        error
      );
      return res
        .status(500)
        .send("Erro ao buscar informações do usuário no banco de dados");
    }
  });
});

// Rota para atualizar as informações do usuário
app.post("/atualizar-perfil", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login"); // Redirecione para a página de login se o token não estiver presente
  }

  jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
    // Verifique o token
    if (err) {
      return res.redirect("/login"); // Redirecione para a página de login se o token for inválido
    }
    const username = decoded.username;

    try {
      // Verificar se a senha está correta antes de permitir a atualização
      const senhaCorreta = await verificaSenha(username, senha);

      if (senhaCorreta) {
        if (!nome || !email || !telefone || !senha) {
          return res.status(400).send("Todos os campos são obrigatórios.");
        }
        // Verificar se o novo e-mail é diferente do e-mail atual
        if (email !== username) {
          const emailJaExiste = await select(null, email);
          if (emailJaExiste) {
            return res
              .status(400)
              .send(
                "O e-mail já está em uso. Por favor, escolha outro e-mail."
              );
          }
        }

        await db.query(
          "UPDATE usuarios SET nome = $1, email = $2, telefone = $3 WHERE email = $4",
          [nome, email, telefone, username]
        );
        res.redirect("/logout");
      } else {
        res
          .status(401)
          .send("Senha incorreta. Não é possível atualizar as informações.");
      }
    } catch (error) {
      console.error("Erro ao atualizar as informações do usuário:", error);
      res.status(500).send("Erro ao atualizar as informações do usuário");
    }
  });
});





// Rota para alterar a senha
app.post("/alterarSenha", async (req, res) => {
  const { senha_atual, nova_senha, confirma_senha } = req.body;
  const token = req.cookies.token; // Obtenha o token do cookie

  if (!token) {
    return res.status(401).send("Token não fornecido.");
  }

  jwt.verify(token, "BZAirsoftArenaTCC", async (err, decoded) => {
    if (err) {
      return res.status(401).send("Token inválido.");
    }

    const username = decoded.username;

    try {

      const result = await db.query(
        "SELECT senha FROM usuarios WHERE email = $1",
        [username]
      );


      if (result.rowCount === 0) {
        return res.status(404).send("Usuário não encontrado.");
      }

      const senhaNoBanco = result.rows[0].senha;

      // Verifique se a senha atual coincide com a senha no banco de dados
      if (senha_atual !== senhaNoBanco) {
        return res.status(401).send("Senha atual incorreta.");
      }

      // Verifique se a nova senha e a confirmação coincidem
      if (nova_senha !== confirma_senha) {
        return res.status(400).send("A nova senha e a confirmação não coincidem.");
      }
 
      const queryResult = await db.query(
        "UPDATE usuarios SET senha = $1 WHERE email = $2",
        [nova_senha, username]
      );
      
      res.status(200).send("Senha alterada com sucesso.");
    } catch (error) {
      console.error("Erro ao alterar a senha:", error);
      return res.status(500).send("Erro interno do servidor ao alterar a senha.");
    }
  });
});






//ADMINISTRAÇÃO

app.post("/gerar-pdf", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM usuarios");

    await generatePDF(results.rows); // Chame a função generatePDF

    const outputPath = __dirname + "/output.pdf";
    res.sendFile(outputPath); // Enviar o arquivo PDF como resposta
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).send("Erro ao gerar PDF.");
  }
});

// Rota para adicionar horários
app.post("/adicionar-horario", async (req, res) => {
  const { dia, horario, valor } = req.body;

  try {
    const query = await db.query(
      "SELECT * FROM horarios_disponiveis WHERE dia = $1 AND horario = $2 AND disp = 1",
      [dia, horario]
    );

    // Verifique se o horário já existe
    if (query.rows.length === 0) {
      // Insira o novo horário na tabela horarios_disponiveis
      await db.query(
        "INSERT INTO horarios_disponiveis (dia, horario, disp, valor) VALUES ($1, $2, 1, $3)",
        [dia, horario, valor]
      );

      // Insira o log da inclusão
      await db.query(
        "INSERT INTO log_alteracoes (acao, dia, horario, valor, data_hora) VALUES ($1, $2, $3, $4, NOW())",
        ["Inclusao", dia, horario, valor]
      );

      // Envie uma resposta de sucesso
      res.send("Horário adicionado com sucesso");
    } else {
      // Envie uma resposta de erro se o horário já existir
      res.send("Horário já está inserido");
    }
  } catch (error) {
    // Envie uma resposta de erro em caso de falha na execução
    res.status(500).send("Erro ao adicionar horário");
  }
});

app.post("/bloquear-horario-Jogador", async (req, res) => {
  const { CPF, observacao, dia, horario, senha, comprovante } = req.body;

  try {
    const senhaNoBanco = await db.query(
      "SELECT * from administrador where senha = $1",
      [senha]
    );

    if (senhaNoBanco.rows.length > 0) {
      // Verifique se o horário com os detalhes fornecidos existe
      const horarioExiste = await db.query(
        "SELECT id FROM horarios_disponiveis WHERE dia = $1 AND horario = $2",
        [dia, horario]
      );

      if (horarioExiste.rows.length === 0) {
        // Se o horário não existe, retorne uma mensagem de erro
        return res.status(404).send("Horário não encontrado.");
      }

      const result = await db.query(
        "UPDATE horarios_disponiveis SET disp = 3, cliente_cpf = $1 WHERE dia = $2 AND horario = $3 ",
        [CPF, dia, horario]
      );
      await db.query(
        "INSERT INTO log_alteracoes (acao, observacao, dia, horario, data_hora) VALUES ($1, $2, $3, $4, NOW())",
        ["Bloqueio de Horário", observacao, dia, horario]
      );

      res.send("Horário bloqueado com sucesso");
    } else {
      res.status(401).send("Senha de admin incorreta.");
    }
  } catch (error) {
    console.error("Erro ao bloquear horário:", error);
    res.status(500).send("Erro ao bloquear horário.");
  }
});


// Rota para gerar relatório com filtro
app.post("/gerar-relatorio", async (req, res) => {
  const { filtro } = req.body;

  try {
    // Execute a consulta SQL com base no filtro e obtenha os resultados
    const result = await db.query(
      "SELECT * FROM horarios_disponiveis WHERE dia = $1",
      [filtro]
    );

    // Gere o relatório com base nos resultados
    let relatorioHTML = "<h2>Relatório</h2>";
    relatorioHTML += "<ul>";
    for (const row of result.rows) {
      relatorioHTML += `<li>Dia: ${row.dia}, Horário: ${row.horario}, Disponível: ${row.disp}</li>`;
    }
    relatorioHTML += "</ul>";

    res.send(relatorioHTML);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).send("Erro ao gerar relatório.");
  }
});

// Rota para gerar relatório em uma planilha Excel
app.post("/gerar-relatorio-excel", async (req, res) => {
  const { filtroInicial, filtroFinal } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM horarios_disponiveis WHERE dia BETWEEN $1 AND $2",
      [filtroInicial, filtroFinal]
    );

    // Crie uma nova planilha Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório");

    // Defina os cabeçalhos da planilha
    worksheet.columns = [
      { header: "Dia", key: "dia", width: 20 },
      { header: "Horário", key: "horario", width: 20 },
      { header: "Disponível", key: "disp", width: 20 },
    ];

    // Preencha a planilha com os dados do banco de dados
    result.rows.forEach((row) => {
      // Formate a data e a hora corretamente
      const diaFormatado = row.dia.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      const horarioFormatado = row.horario; // A hora já está no formato correto

      // Mapeie os valores de "disp" para os textos correspondentes
      let dispText = "";
      switch (row.disp) {
        case 1:
          dispText = "Horário Disponível";
          break;
        case 2:
          dispText = "Horário em Análise";
          break;
        case 3:
          dispText = "Horário Bloqueado";
          break;
        default:
          dispText = "Valor Desconhecido"; // Lide com valores inesperados, se houver
      }

      worksheet.addRow({
        dia: diaFormatado,
        horario: horarioFormatado,
        disp: dispText, // Use o texto correspondente
      });
    });

    // Crie um buffer contendo a planilha Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Defina o cabeçalho da resposta para indicar que é um arquivo Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.xlsx");

    // Envie a planilha Excel como resposta
    res.send(buffer);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).send("Erro ao gerar relatório.");
  }
});

// Rota para gerar relatório em uma planilha Excel com informações de log, dias e horários
app.post("/gerar-relatorio-log-excel", async (req, res) => {
  const { filtroInicial, filtroFinal } = req.body;

  try {
    // Selecione os registros do log e junte com a tabela de horários disponíveis
    const result = await db.query(
      `
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
    `,
      [filtroInicial, filtroFinal]
    );

    // Crie uma nova planilha Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório de Log");

    // Defina os cabeçalhos da planilha
    worksheet.columns = [
      { header: "Ação", key: "acao", width: 20 },
      { header: "Observação", key: "observacao", width: 20 },
      { header: "Dia", key: "dia", width: 20 },
      { header: "Horário", key: "horario", width: 20 },
      { header: "Data/Hora", key: "data_hora", width: 20 },
    ];

    // Preencha a planilha com os dados do banco de dados
    result.rows.forEach((row) => {
      worksheet.addRow({
        acao: row.acao,
        observacao: row.observacao,
        dia: row.dia.toISOString().split("T")[0], // Formato YYYY-MM-DD
        horario: row.horario,
        data_hora: row.data_hora.toISOString(), // Formato ISO para data/hora
      });
    });

    // Crie um buffer contendo a planilha Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Defina o cabeçalho da resposta para indicar que é um arquivo Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=relatorio-log-com-horarios.xlsx"
    );

    // Envie a planilha Excel como resposta
    res.send(buffer);
  } catch (error) {
    console.error("Erro ao gerar relatório de log:", error);
    res.status(500).send("Erro ao gerar relatório de log.");
  }
});

app.get("/horarios-agendados", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT id, cliente_cpf, dia, horario FROM horarios_disponiveis WHERE disp = 2"
    );
    res.json(results.rows);
  } catch (error) {
    console.error("Erro ao obter horários agendados:", error);
    res.status(500).send("Erro ao obter horários agendados.");
  }
});

app.post("/bloquearhorario", async (req, res) => {
  try {
    const horarioId = req.body.id;
    await db.query("UPDATE horarios_disponiveis SET disp = 3 WHERE id = $1", [
      horarioId,
    ]);
    console.log(req.body);
    console.log(horarioId);
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao bloquear horário:", error);
    res.status(500).send("Erro ao bloquear horário.");
  }
});

app.post("/liberarHorario", async (req, res) => {
  try {
    const horarioId = req.body.horarioId;
    await db.query("UPDATE horarios_disponiveis SET disp = 1 WHERE id = $1", [
      horarioId,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao Liberar horário:", error);
    res.status(500).send("Erro ao Liberar horário.");
  }
});

// PAGINA DE CLIENTES

app.get("/clientes", async (req, res) => {
  try {
    const results = await db.query("SELECT id, nome, cpf FROM usuarios");
    res.json(results.rows);
  } catch (error) {
    console.error("Erro ao obter a lista de clientes:", error);
    res.status(500).send("Erro ao obter a lista de clientes.");
  }
});

app.get("/cliente-detalhes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query("SELECT * FROM usuarios WHERE id = $1", [
      id,
    ]);
    if (results.rows.length > 0) {
      res.json(results.rows[0]);
    } else {
      res.status(404).send("Cliente não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao obter os detalhes do cliente:", error);
    res.status(500).send("Erro ao obter os detalhes do cliente.");
  }
});

app.patch("/atualizar-bloqueio-jogador/:id", async (req, res) => {
  const idJogador = req.params.id;
  const { bloqueado } = req.body; // Isso deve ser true ou false com base no status da caixa de seleção na interface

  // Valida o status bloqueado
  if (typeof bloqueado !== "boolean") {
    return res.status(400).json({ error: "Status de bloqueado inválido." });
  }

  try {
    const resultado = await db.query(
      "UPDATE usuarios SET bloqueado = $1 WHERE id = $2 RETURNING *",
      [bloqueado, idJogador]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Jogador não encontrado." });
    }

    res.json({
      mensagem: `Jogador ${
        bloqueado ? "bloqueado" : "desbloqueado"
      } com sucesso!`,
      dados: resultado.rows[0],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao atualizar o status de bloqueio do jogador." });
  }
});

// Obter todos os horários
app.get("/todosHorarios", async (req, res) => {
  try {
    const results = await db.query(
      `SELECT h.id, h.cliente_cpf, h.dia, h.horario, h.disp, u.nome as cliente_nome 
       FROM horarios_disponiveis h
       LEFT JOIN usuarios u ON h.cliente_cpf = u.cpf`
    );

    const horarios = results.rows.map((horario) => {
      return {
        ...horario,
        botoes: {
          bloquear: horario.disp === 1,
          agendar: horario.disp === 1,
          liberar: horario.disp === 3,
          desmarcar: horario.cliente_cpf != null,
        },
      };
    });

    res.json(horarios);
  } catch (error) {
    console.error("Erro ao obter horários:", error);
    res.status(500).send("Erro ao obter horários.");
  }
});

// Bloquear horário
app.post("/bloquear-horarios", async (req, res) => {
  try {
    const { horarioId } = req.body;

    await db.query(
      "UPDATE horarios_disponiveis SET disp = 3 WHERE id = $1 and disp = 1",
      [horarioId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao liberar horário:", error);
    res.status(500).send("Erro ao liberar horário.");
  }
});

// Agendar horário
app.post("/agendar-horario", async (req, res) => {
  try {
    const { horarioId, clienteCpf } = req.body;

    await db.query(
      "UPDATE horarios_disponiveis SET disp = 3 WHERE id = $1 and disp=2",
      [horarioId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao agendar horário:", error);
    res.status(500).send("Erro ao agendar horário.");
  }
});

// Liberar horário
app.post("/liberarHorarios", async (req, res) => {
  try {
    const { horarioId } = req.body;
    await db.query(
      "UPDATE horarios_disponiveis SET disp = 1, cliente_cpf = NULL WHERE id = $1 and disp=3 and cliente_cpf IS NULL",
      [horarioId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao liberar horário:", error);
    res.status(500).send("Erro ao liberar horário.");
  }
});

// Desmarcar horario
app.post("/desmarcar-horario", async (req, res) => {
  try {
    const { horarioId } = req.body;

    // Primeiro obtenha as informações do horario e do cliente
    const queryResult = await db.query(
      "SELECT cliente_cpf, dia, horario FROM horarios_disponiveis WHERE id = $1",
      [horarioId]
    );

    if (queryResult.rows.length > 0) {
      // Desmarca o horÃ¡rio
      await db.query(
        "UPDATE horarios_disponiveis SET cliente_cpf = NULL, disp = 1  WHERE id = $1",
        [horarioId]
      );

      // Enviar e-mail para o cliente aposs desmarcar o horario
      const clienteEmail = await db.query(
        "SELECT email FROM usuarios WHERE cpf = $1",
        [queryResult.rows[0].cliente_cpf]
      );

      if (clienteEmail.rows.length > 0) {
        enviarEmailDesmarcar(clienteEmail.rows[0].email, queryResult.rows[0]);
      }

      res.json({ success: true });
    } else {
      res.status(404).send("Horario nÃ£o encontrado.");
    }
  } catch (error) {
    console.error("Erro ao desmarcar horario:", error);
    res.status(500).send("Erro ao desmarcar horÃ¡rio.");
  }
});

// Pagina de configuração

// Rota para obter horários configurados
app.get("/HorarioDiario", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM horarios_configurados");
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Erro no servidor ao obter horários.");
  }
});

// Rota para adicionar um novo horário
app.post("/HorarioDiario", async (req, res) => {
  try {
    const { horario } = req.body;
    await db.query("INSERT INTO horarios_configurados (horario) VALUES ($1)", [
      horario,
    ]);
    res.status(201).send("Horário adicionado com sucesso.");
  } catch (error) {
    res.status(500).send("Erro no servidor ao adicionar horário.");
  }
});

app.delete("/HorarioDiario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM horarios_configurados WHERE id = $1", [id]);
    res.send("Horário removido com sucesso.");
  } catch (error) {
    res.status(500).send("Erro no servidor ao remover horário.");
  }
});

// Função que busca e insere horários
async function inserirHorariosDisponiveis() {
  try {
    const result = await db.query("SELECT * FROM horarios_configurados");
    const horarios = result.rows;
    for (let horario of horarios) {
      await db.query(
        "INSERT INTO horarios_disponiveis (horario, dia, disp, valor) VALUES ($1, CURRENT_DATE, 1, 250)",
        [horario.horario]
      );
    }
    console.log("Horários diários inseridos com sucesso.");
  } catch (error) {
    console.error("Erro ao inserir horários diários:", error);
  }
}

//Os minutos vem primeiro, e depois horas.
// Agendar a tarefa para rodar todos os dias às 11:50 da manhã
cron.schedule(
  "0 0 * * *",
  () => {
    console.log("Executando a tarefa de inserir horários disponíveis...");
    inserirHorariosDisponiveis();
  },
  {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  }
);

// Definindo a Rota do servidor
app.listen(3000, () => {
  console.log("Servidor Em execução em http://localhost:3000");
});
