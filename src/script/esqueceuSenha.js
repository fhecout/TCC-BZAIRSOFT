// Função para mostrar um pop-up
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.classList.add('show');

    // Remover o pop-up após 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Intercepta o envio do formulário de esqueceu senha
const formEsqueceuSenha = document.querySelector('form[action="/esqueceuSenha"]');
formEsqueceuSenha.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formEsqueceuSenha);

    try {
        const response = await fetch('/esqueceuSenha', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });

        if (!response.ok) {
            const message = await response.text();
            showToast(message); // Mostrar o pop-up com a mensagem de erro
        } else {
            showToast('Email enviado com sucesso'); // Mostrar mensagem de sucesso
        }
    } catch (error) {
        showToast('Erro ao processar a solicitação'); // Mostrar erro se a solicitação falhar
    }
});