const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const telefoneInput = document.getElementById('telefone');
        const senhaInput = document.getElementById('senha');
        const submitBtn = document.getElementById('submitBtn');
        const perfilForm = document.getElementById('perfilForm');

        function validarCampos() {
            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const telefone = telefoneInput.value.trim();
            const senha = senhaInput.value.trim();

            if (nome !== '' && email !== '' && telefone !== '' && senha !== '') {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'disabled');
            }
        }

        nomeInput.addEventListener('input', validarCampos);
        emailInput.addEventListener('input', validarCampos);
        telefoneInput.addEventListener('input', validarCampos);
        senhaInput.addEventListener('input', validarCampos);

        // Event listener opcional para revalidar quando a página é carregada.
        window.addEventListener('load', validarCampos);


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
            const formLogin = document.querySelector('form[action="/atualizar-perfil"]');
            if (formLogin) {
                formLogin.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(formLogin);
        
                    try {
                        const response = await fetch('/atualizar-perfil', {
                            method: 'POST',
                            body: new URLSearchParams(formData)
                        });
        
                        if (!response.ok) {
                            const message = await response.text();
                            showToast(message); // Mostrar o pop-up se a resposta não for bem-sucedida
                        } else {
        
                            window.location.href = '/logout';
        
                        }
                    } catch (error) {
                        showToast('Erro ao tentar fazer login'); // Mostrar erro se a solicitação falhar
                    }
                });
            }
        });
        