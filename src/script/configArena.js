// Função para adicionar uma nova linha de horário
function adicionarLinhaHorario(horario = '', id = null) {
    const tbody = document.querySelector('#horarios-container tbody');
    const tr = document.createElement('tr');
    tr.className = 'horario-linha';
    tr.dataset.id = id; // Armazena o ID no elemento para uso posterior
    tr.innerHTML = `
<td><input type="time" class="horario-input" value="${horario}" ${id ? 'disabled' : ''}></td>
<td><button onclick="removerLinhaHorario(this, ${id})">🗑️</button></td>
`;
    if (!id) { // Se não tiver ID, estamos criando um novo horário
        const input = tr.querySelector('.horario-input');
        input.addEventListener('change', () => salvarHorario(input.value));
    }
    tbody.appendChild(tr);
}

// Função para salvar um novo horário no banco de dados
async function salvarHorario(horario) {
    const response = await fetch('/HorarioDiario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ horario }),
    });

    if (response.ok) {
        // Recarrega os horários após adicionar um novo
        carregarHorarios();
    } else {
        console.error('Erro ao salvar o horário');
    }
}

// Função para remover uma linha de horário
async function removerLinhaHorario(button, id) {
    if (id) {
        const response = await fetch(`/HorarioDiario/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            button.closest('tr').remove();
        } else {
            console.error('Erro ao remover o horário');
        }
    } else {
        button.closest('tr').remove();
    }
}

// Função para carregar horários existentes
async function carregarHorarios() {
    const response = await fetch('/HorarioDiario');
    const horarios = await response.json();
    const tbody = document.querySelector('#horarios-container tbody');
    tbody.innerHTML = ''; // Limpa a tabela antes de recarregar os horários
    horarios.forEach(horario => adicionarLinhaHorario(horario.horario, horario.id));
}

// Chamada inicial para carregar horários
carregarHorarios();