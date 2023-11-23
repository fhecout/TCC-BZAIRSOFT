document.addEventListener('DOMContentLoaded', function () {
    fetch('/clientes')
        .then(response => response.json())
        .then(data => {
            const tabelaClientes = document.getElementById('tabelaClientes');
            data.forEach(cliente => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
  <td>${cliente.id}</td>
  <td>${cliente.nome}</td>
  <td>${cliente.cpf}</td>
`;
                tr.addEventListener('click', () => abrirDetalhes(cliente.id));
                tabelaClientes.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao carregar clientes:', error));
});

function abrirDetalhes(id) {
    window.location.href = `clienteDetalhes.html?id=${id}`;
}

function filterClientes() {
    const input = document.getElementById('searchBox');
    const filter = input.value.toUpperCase();
    const tabelaClientes = document.getElementById('tabelaClientes');
    const tr = tabelaClientes.getElementsByTagName('tr');

    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < tr.length; i++) {
        let tdNome = tr[i].getElementsByTagName("td")[1];
        let tdCpf = tr[i].getElementsByTagName("td")[2];
        if (tdNome || tdCpf) {
            let txtValueNome = tdNome.textContent || tdNome.innerText;
            let txtValueCpf = tdCpf.textContent || tdCpf.innerText;
            if (txtValueNome.toUpperCase().indexOf(filter) > -1 || txtValueCpf.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}