document.addEventListener('DOMContentLoaded', () => {
    const tabelaBody = document.getElementById('tabela-body');

    function formatarData(data) {
        const dataObj = new Date(data);
        const dia = dataObj.getDate().toString().padStart(2, '0');
        const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
        const ano = dataObj.getFullYear().toString().substr(-2);
        return `${dia}/${mes}/${ano}`;
    }

    function carregarTabela() {
        fetch('/horarios')
            .then(response => response.json())
            .then(data => {
                tabelaBody.innerHTML = '';

                data.forEach(horario => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${horario.id}</td>
                        <td>${formatarData(horario.dia)}</td>
                        <td>${horario.horario}</td>
                        <td>${horario.disp}</td>
                    `;

                    tabelaBody.appendChild(row);
                });
            })
            .catch(error => console.error('Erro ao carregar dados:', error));
    }

carregarTabela();
});