
let horarios = []; // Variável global para armazenar os horários

document.addEventListener('DOMContentLoaded', function () {
    fetchHorarios();

    document.getElementById('filtroDisponibilidade').addEventListener('change', function () {
        applyFilters();
    });

    document.getElementById('filtroData').addEventListener('change', function () {
        applyFilters();
    });

    async function fetchHorarios() {
        const response = await fetch('/todosHorarios');
        horarios = await response.json();
        applyFilters();
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Janeiro é 0!
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function compareDates(inputDateString, horarioDateString) {
        // Primeiro, transforma a data do input em um objeto Date
        const inputDateParts = inputDateString.split('-');
        const inputDate = new Date(inputDateParts[0], inputDateParts[1] - 1, inputDateParts[2]);

        // Transforma a data do horário (em formato ISO) em um objeto Date
        const horarioDate = new Date(horarioDateString);

        // Compara se as datas são iguais
        return inputDate.getTime() === horarioDate.getTime();
    }

    function applyFilters() {
        const disponibilidadeFiltro = document.getElementById('filtroDisponibilidade').value;
        const dataFiltro = document.getElementById('filtroData').value;
        const filteredHorarios = horarios.filter(horario => {
            const matchesDisponibilidade = disponibilidadeFiltro === 'todos' || horario.disp.toString() === disponibilidadeFiltro;
            const matchesData = !dataFiltro || compareDates(dataFiltro, horario.dia);
            return matchesDisponibilidade && matchesData;
        });
        populateTable(filteredHorarios);
    }

    function populateTable(horarios) {
        const tableBody = document.getElementById('horariosTable').querySelector('tbody');
        tableBody.innerHTML = '';
        horarios.forEach(horario => {
            const disponibilidadeTexto = getDisponibilidadeTexto(horario.disp);
            const row = tableBody.insertRow();
            row.innerHTML = `
            <td>${horario.id}</td>
            <td>${formatDate(horario.dia)}</td>
            <td>${horario.horario}</td>
            <td class="${'disp-' + horario.disp}">${disponibilidadeTexto}</td>
            <td>${horario.cliente_cpf || ''}</td>
            <td>${horario.cliente_nome || ''}</td>

                <td>
                    <button onclick="handleAction('bloquear', ${horario.id})">Bloquear</button>
                    <button onclick="handleAction('agendar', ${horario.id})">Agendar</button>
                    <button onclick="handleAction('liberar', ${horario.id})">Liberar</button>
                    <button onclick="handleAction('desmarcar', ${horario.id})">Desmarcar</button>
                </td>
            `;
        });
    }
});


function getDisponibilidadeTexto(disp) {
    switch (disp) {
        case 1: return 'Disponível';
        case 2: return 'Em Análise';
        case 3: return 'Bloqueado';
        default: return '';
    }
}

let currentId = null;

function handleAction(action, id) {
    function handleAction(action, id, clienteCpf) {
        if (action === 'bloquear' && clienteCpf) {
            // Não fazer nada se o cliente_cpf estiver presente
            return;
        }
        currentId = id;
        showModal(`modal${capitalizeFirstLetter(action)}`);
    }

    currentId = id;
    showModal(`modal${capitalizeFirstLetter(action)}`);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.classList.add('show');

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


async function executeAction(action) {
closeModal(`modal${capitalizeFirstLetter(action)}`);
let endpoint = '';
let actionMessage = '';
switch (action) {
    case 'bloquear':
        endpoint = '/bloquear-horarios';
        actionMessage = 'Horário bloqueado com sucesso!';
        break;
    case 'agendar':
        endpoint = '/agendar-horario';
        actionMessage = 'Horário agendado com sucesso!';
        break;
    case 'liberar':
        endpoint = '/liberarHorarios';
        actionMessage = 'Horário liberado com sucesso!';
        break;
    case 'desmarcar':
        endpoint = '/desmarcar-horario';
        actionMessage = 'Horário desmarcado com sucesso!';
        break;
}

// Armazenar a mensagem para ser exibida após o recarregamento
localStorage.setItem('actionMessage', actionMessage);

const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ horarioId: currentId }),
});

const result = await response.json();
if (result.success) {
    window.location.reload(true);
} else {
    alert('Ação falhou: ' + (result.message || 'Erro desconhecido'));
}
}

// Verificar e exibir a mensagem de notificação após recarregar a página
document.addEventListener('DOMContentLoaded', () => {
const actionMessage = localStorage.getItem('actionMessage');
if (actionMessage) {
    showNotification(actionMessage);
    localStorage.removeItem('actionMessage');
}

fetchHorarios();
});