// Obtém o valor do parâmetro 'username' da URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

// Use o valor do username por exemplo, exibindo na página
const usernameDisplay = document.createElement('p');
usernameDisplay.textContent = `Token para o usuário: ${username}`;
document.body.appendChild(usernameDisplay);

document.getElementById('username').value = username;