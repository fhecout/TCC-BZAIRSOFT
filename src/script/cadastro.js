// const e = require("express");

function formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function calcularDigitoVerificador(cpf) {
    const numeros = cpf.slice(0, 9).split('').map(Number);
    const primeiroDigito = calcularDigito(numeros, 10);
    numeros.push(primeiroDigito);
    const segundoDigito = calcularDigito(numeros, 11);
    return `${primeiroDigito}${segundoDigito}`;
}

function calcularDigito(numeros, peso) {
    const total = numeros.reduce((acc, num) => acc + num * peso--, 0);
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
}

const cpfInput = document.getElementById('cpf');
const digitoVerificador = document.getElementById('digito-verificador');

cpfInput.addEventListener('input', () => {
    const cpf = cpfInput.value;
    const cpfFormatado = formatCPF(cpf);
    const digito = calcularDigitoVerificador(cpf);
    cpfInput.value = cpfFormatado;
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

const inputsCadastro = document.querySelectorAll('input')
const buttonCadastro = document.getElementById('buttonCadastro')
console.log(inputsCadastro);
// console.log(buttonCadastro);
const tiposInput = [" Nome"," CPF", " E-Mail", " Telefone", " Senha"]
const inputsVazios = []



// console.log(`Os campos:${inputsVazios} não foram preenchidos!`);


// buttonCadastro.addEventListener('click', (event) => {
//     for(let i = 0; i < inputsCadastro.length; i++){       
//         if(inputsCadastro[i].value === ""){
//             inputsVazios.push(tiposInput[i])
//         }
//     }
    
//     if(inputsVazios.length > 0){
//         event.preventDefault()
//         showToast(`Os campos:${inputsVazios} não foram preenchidos!`)
//     }
// })


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


document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.querySelector('form[action="/cadastro"]');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formLogin);

            try {
                const response = await fetch('/cadastro', {
                    method: 'POST',
                    body: new URLSearchParams(formData)
                });

                if (!response.ok) {
                    const message = await response.text();
                    showToast(message); // Mostrar o pop-up se a resposta não for bem-sucedida
                } else {
                    const data = await response.json();
                    window.location.href = `html/token.html?username=${data.username}`; // Redirecionar com o nome de usuário correto
                }
            } catch (error) {
                showToast('Erro ao tentar fazer login'); // Mostrar erro se a solicitação falhar
            }
        });
    }
});

