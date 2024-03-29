window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      fetch(`/cliente-detalhes/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Detalhes do cliente não encontrados.');
          }
          return response.json();
        })
        .then(data => {
          document.getElementById('clienteId').textContent = data.id;
          document.getElementById('clienteNome').textContent = data.nome;
          document.getElementById('clienteCpf').textContent = data.cpf;
          document.getElementById('clienteEmail').textContent = data.email;
          document.getElementById('clienteTelefone').textContent = data.telefone;
          document.getElementById('clienteTokenValidado').textContent = data.tokenvalidado ? 'Sim' : 'Não';
        })
        .catch(error => {
          console.error('Erro:', error);
          alert('Erro ao carregar detalhes do cliente.');
        });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    const blockButton = document.getElementById('blockButton');
    blockButton.addEventListener('click', function () {
      const playerId = document.getElementById('clienteId').textContent;
      const isBlocked = blockButton.textContent.includes('Desbloquear');

      fetch(`/atualizar-bloqueio-jogador/${playerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bloqueado: !isBlocked }),
      })
        .then(response => response.json())
        .then(data => {
          blockButton.textContent = isBlocked ? 'Bloquear Jogador' : 'Desbloquear Jogador';
        })
        .catch(error => {
          console.error('Erro:', error);
          alert('Erro ao atualizar o status do jogador.');
        });
    });
  });