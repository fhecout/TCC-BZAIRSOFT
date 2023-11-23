// Obtém o valor do parâmetro 'username' da URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

// Use o valor do username por exemplo, exibindo na página
const usernameDisplay = document.createElement('p');
usernameDisplay.textContent = `Token para o usuário: ${username}`;
document.body.appendChild(usernameDisplay);

document.getElementById('username').value = username;


// Intercepta o envio do formulário de validação do código
const formCodigoValidacao = document.querySelector('form[action="/codigoValidacao"]');
formCodigoValidacao.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formCodigoValidacao);

    try {
        const response = await fetch('/codigoValidacao', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (!response.ok) {
            const message = await response.text();
            showToast(message); // Mostrar o pop-up com a mensagem de erro ou sucesso
        } else {
            // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
            window.location.href = `html/horarios.html`;
        }
    } catch (error) {
        showToast('Erro ao processar a validação do código'); // Mostrar erro se a solicitação falhar
    }
});