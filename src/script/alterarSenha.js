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
    const formSenha = document.querySelector('form[action="/alterarSenha"]');
    if (formSenha) {
        formSenha.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formSenha);

            try {
                const response = await fetch('/alterarSenha', {
                    method: 'POST',
                    body: new URLSearchParams(formData)
                });

                if (!response.ok) {
                    const message = await response.text();
                    showToast(message); // Mostrar o pop-up se a resposta não for bem-sucedida
                } else {
                    
                    showToast('Senha Alterada') 
                    

                }
            } catch (error) {
                showToast('Erro ao tentar fazer login'); // Mostrar erro se a solicitação falhar
            }
        });
    }
});
