// ADICIONAR BORDA AO CONTEUDO SELECIONADO NO MENU
const menu = document.querySelectorAll('.lista-cabecalho')
const secoes = document.querySelectorAll('section')

menu.forEach((botoes) => {
    botoes.addEventListener('click', () => {
        removerClasseSelecionado()
        adicionarClasseSelecionado(botoes)
        desativarDisplay()
        ativarDisplay()
    })
})

function removerClasseSelecionado() {
    menu.forEach(botoes => {
        if (botoes.classList.contains('selecionar')) {
            botoes.classList.remove('selecionar')
        }
    })
}

function adicionarClasseSelecionado(botoes) {
    botoes.classList.add('selecionar')
}

//ALTERAR O DISPLAY DA SEÇÃO
function ativarDisplay() {
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].classList.contains('selecionar')) {
            secoes[i].style.display = 'flex'
        }
    }
}

function desativarDisplay() {
    for (var i = 0; i < secoes.length; i++) {
        if (secoes[i].style.display = 'flex') {
            secoes[i].style.display = 'none'
        }
    }
}