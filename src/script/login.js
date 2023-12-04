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
    const formLogin = document.querySelector('form[action="/login"]');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formLogin);

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    body: new URLSearchParams(formData)
                });

                if (!response.ok) {
                    const message = await response.text();
                    showToast(message); // Mostrar o pop-up se a resposta não for bem-sucedida
                } else {

                    window.location.href = '/user';

                }
            } catch (error) {
                showToast('Erro ao tentar fazer login'); // Mostrar erro se a solicitação falhar
            }
        });
    }
});


function showPassword(){
    var passwordInput = document.getElementById('senha')
    var buttonShowPassword = document.getElementById('btn-show')

    if(passwordInput.type === 'password'){
        passwordInput.setAttribute('type', 'text')
        buttonShowPassword.classList.replace('fa-eye-slash', 'fa-eye')
    } else {
        passwordInput.setAttribute('type', 'password')
        buttonShowPassword.classList.replace('fa-eye', 'fa-eye-slash')
    }
}
