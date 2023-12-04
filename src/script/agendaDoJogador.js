document.addEventListener('DOMContentLoaded', fetchAgendados);
function fetchAgendados() {
    fetch('/AgendadorJogador', {
        method: 'POST',
        credentials: 'include' // Include cookies for the current domain
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => renderAgendados(data.agendados))
    .catch(error => {
        console.error('Error fetching data:', error);
        // Handle errors, such as by displaying an error message to the user
    });
}

function renderAgendados(agendados) {
    const container = document.getElementById('agendados-container');
    container.innerHTML = ''; // Clear previous content
    agendados.forEach(agendado => {
        let statusText;
        switch (agendado.disp) {
            case 2:
                statusText = 'Horário em análise';
                break;
            case 3:
                statusText = 'Horário Agendado';
                break;
            default:
                statusText = 'Disponibilidade: ' + agendado.disp;
        }
        
        const card = document.createElement('div');
        card.className = 'horario-card';
        card.innerHTML = `
            <p><strong>ID:</strong> ${agendado.horario_id}</p>
            <p><strong>Dia:</strong> ${agendado.dia}</p>
            <p><strong>Horário:</strong> ${agendado.horario}</p>
            <p><strong>Status:</strong> ${statusText}</p>
            <p><strong>CPF:</strong> ${agendado.cliente_cpf}</p>
        `;
        console.log(agendado.dia);
        container.appendChild(card);
    });
}


