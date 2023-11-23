function getDataAtual() {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Define o valor do campo de data para a data atual
document.getElementById("dia").value = getDataAtual();

const form = document.getElementById("form");
const horariosDiv = document.getElementById("horarios");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const modalOverlay = document.getElementById("modal-overlay");
const fecharModal = document.getElementById("fechar-modal");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    horariosDiv.innerHTML = ""; // Limpa os horários anteriores
  
    const response = await fetch("/horarios", {
      method: "POST",
      body: new URLSearchParams(new FormData(form)),
    });
  
    const data = await response.json();
  
    // Verifica se há uma mensagem de erro e a exibe
    if (data.mensagem) {
      showToast(data.mensagem); // Utiliza a função showToast para exibir a mensagem de erro
    } else {
      // Cria botões para os horários disponíveis
      data.horarios.forEach((horario) => {
        if (horario && typeof horario.horario === "string") {
          const button = document.createElement("button");
          button.textContent = horario.horario;
          button.addEventListener("click", () => {
            loadAndShowModal("/pagina-horario?id=" + horario.id);
          });
          horariosDiv.appendChild(button);
        }
      });
    }
  });
  
  // Função showToast
  function showToast(message) {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = message;
      document.body.appendChild(toast);
      toast.classList.add("show");
  
      setTimeout(() => {
          toast.remove();
      }, 3000); // O pop-up será removido após 3 segundos
  }

fecharModal.addEventListener("click", () => {
  // Fechar o modal ao clicar no botão "Fechar"
  modal.style.display = "none";
  modalOverlay.style.display = "none";
});

// Função para carregar e exibir o modal com o conteúdo da segunda página
async function loadAndShowModal(url) {
  const response = await fetch(url);
  const htmlContent = await response.text();
  modalContent.innerHTML = htmlContent;
  modal.style.display = "flex";
  modalOverlay.style.display = "flex";

  // Adicione um evento de clique para copiar o conteúdo ao abrir o modal
  const copiarBotao = document.getElementById("copiarBotao");
  copiarBotao.addEventListener("click", function () {
    var conteudoDiv = document.getElementById("conteudo");
    var range = document.createRange();
    range.selectNodeContents(conteudoDiv);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    alert("Conteúdo copiado para a área de transferência");
  });
}

// Função para carregar os horários disponíveis ao carregar a página
async function carregarHorariosAtuais() {
  const diaAtual = getDataAtual();

  const response = await fetch("/horarios", {
    method: "POST",
    body: new URLSearchParams({ dia: diaAtual }), // Envie o dia atual para o servidor
  });

  const data = await response.json();

  horariosDiv.innerHTML = "";

  data.horarios.forEach((horario) => {
    if (horario && typeof horario.horario === "string") {
      const button = document.createElement("button");
      button.textContent = horario.horario;
      button.addEventListener("click", () => {
        // Carregar e exibir o modal ao clicar no botão
        loadAndShowModal("/pagina-horario?id= " + horario.id);
      });
      horariosDiv.appendChild(button);
    }
  });
}
// Chame a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarHorariosAtuais);
