//evento de clique ao botão "Bloquear Horario para jogador"
document.getElementById("exibir-senha").addEventListener("click", function () {
  // Exibe o campo de senha quando o botão é clicado
  document.getElementById("senha-container").style.display = "block";
});

// Função para mostrar um pop-up
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  toast.classList.add("show");

  // Remover o pop-up após 3 segundos
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Intercepta o envio do formulário de adicionar horário
const formAdicionarHorario = document.querySelector(
  'form[action="/adicionar-horario"]'
);
formAdicionarHorario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formAdicionarHorario);

  try {
    const response = await fetch("/adicionar-horario", {
      method: "POST",
      body: new URLSearchParams(formData),
    });
    const message = await response.text();
    showToast(message); // Mostrar o pop-up com a mensagem recebida
  } catch (error) {
    showToast("Erro ao enviar o formulário"); // Mostrar erro se a solicitação falhar
  }
});

const formBloquearHorario = document.getElementById("bloquear-horario-form");
formBloquearHorario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formBloquearHorario);

  try {
    const response = await fetch("/bloquear-horario-Jogador", {
      method: "POST",
      body: new URLSearchParams(formData),
    });
    const message = await response.text();
    showToast(message); // Mostrar o pop-up com a mensagem recebida
  } catch (error) {
    showToast("Erro ao enviar o formulário de bloqueio de horário"); // Mostrar erro se a solicitação falhar
  }
});

// Intercepta o envio do formulário de geração de PDF
const formGerarPDF = document.querySelector('form[action="/gerar-pdf"]');
formGerarPDF.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/gerar-pdf", { method: "POST" });

    if (!response.ok) {
      const message = await response.text();
      showToast(message); // Mostrar o pop-up com a mensagem de erro
    } else {
      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank"); // Abrir o PDF gerado em uma nova aba
    }
  } catch (error) {
    showToast("Erro ao gerar PDF"); // Mostrar erro se a solicitação falhar
  }
});

// // Intercepta o envio do formulário de geração de relatório
// const formGerarRelatorio = document.querySelector('form[action="/gerar-relatorio"]');
// formGerarRelatorio.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = new FormData(formGerarRelatorio);

//     try {
//         const response = await fetch('/gerar-relatorio', {
//             method: 'POST',
//             body: new URLSearchParams(formData)
//         });

//         if (!response.ok) {
//             const message = await response.text();
//             showToast(message); // Mostrar o pop-up com a mensagem de erro
//         } else {
//             const relatorioHtml = await response.text();
//             // Aqui você pode manipular o relatório HTML como desejar
//         }
//     } catch (error) {
//         showToast('Erro ao gerar relatório'); // Mostrar erro se a solicitação falhar
//     }
// });



// Intercepta o envio do formulário de geração de relatório em Excel
const formGerarRelatorioExcel = document.querySelector('form[action="/gerar-relatorio-excel"]');
formGerarRelatorioExcel.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formGerarRelatorioExcel);

    try {
        const response = await fetch('/gerar-relatorio-excel', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (!response.ok) {
            const message = await response.text();
            showToast(message); // Mostrar o pop-up com a mensagem de erro
        } else {
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            window.open(downloadUrl); // Abrir ou baixar o arquivo Excel
            showToast('Download Efetuado com Sucesso')
        }
    } catch (error) {
        showToast('Erro ao gerar relatório em Excel'); // Mostrar erro se a solicitação falhar
    }
});

// Intercepta o envio do formulário de geração de relatório em Excel
const formGerarRelatorioExcelLog = document.querySelector('form[action="/gerar-relatorio-log-excel"]');
formGerarRelatorioExcelLog.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formGerarRelatorioExcelLog);

    try {
        const response = await fetch('/gerar-relatorio-log-excel', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (!response.ok) {
            const message = await response.text();
            showToast(message); // Mostrar o pop-up com a mensagem de erro
        } else {
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            window.open(downloadUrl); // Abrir ou baixar o arquivo Excel
            showToast('Download Efetuado com Sucesso')
        }
    } catch (error) {
        showToast('Erro ao gerar relatório em Excel'); // Mostrar erro se a solicitação falhar
    }
});






