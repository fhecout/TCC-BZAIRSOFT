// PEGAR OS ELEMENTOS DO CONTAINER 
// VER SE O MOUSE ESTÁ EM CIMA
// VERIFICAR SE TEM ALGUM BG ADICIONADO
// ADICIONAR BG
// ADICIONAR BG TEXTO


const imagens = document.querySelectorAll('.imagem')
imagens.forEach((imagem, index) => {
    imagem.addEventListener('mouseover', () => {
        const carrossel = document.querySelector('.container')
        const tituloCarrossel = document.querySelectorAll('.titulo-carrossel')

        excluirBG(carrossel)
        excluirLinkAtivo(tituloCarrossel)
        adicionarBG(carrossel, index, tituloCarrossel)
    })
})


function excluirBG(carrossel){
    if(carrossel.classList.contains('backGround1')) {
        carrossel.classList.remove('backGround1')
    }
    
    if(carrossel.classList.contains('backGround2')) {
        carrossel.classList.remove('backGround2')
    }
    
    if(carrossel.classList.contains('backGround3')) {
        carrossel.classList.remove('backGround3')
    }
}

function excluirLinkAtivo(tituloCarrossel){
    if(tituloCarrossel[0].classList.contains('link-ativo')){
        tituloCarrossel[0].classList.remove('link-ativo')
        tituloCarrossel[0].style.color = 'var(--cor-laranja)'
    }

    if(tituloCarrossel[1].classList.contains('link-ativo')){
        tituloCarrossel[1].classList.remove('link-ativo')
        tituloCarrossel[1].style.color = 'var(--cor-laranja)'
    }

    if(tituloCarrossel[2].classList.contains('link-ativo')){
        tituloCarrossel[2].classList.remove('link-ativo')
        tituloCarrossel[2].style.color = 'var(--cor-laranja)'
    }
}

function adicionarBG(carrossel, index, tituloCarrossel){
    carrossel.classList.add(`backGround${index + 1 }`)
    tituloCarrossel[index].classList.add('link-ativo')
    tituloCarrossel[index].style.color = 'var(--cor-branca)'
}

carrosselResponsivo = document.querySelector('.carrossel-responsivo')
linksCarrosselResponsivo = document.querySelectorAll('.link-responsivo')

setInterval(() => {
    setTimeout(() => {
        excluirBgResponsivo(carrosselResponsivo)
        excluirLinkResponsivo(linksCarrosselResponsivo)
        carrosselResponsivo.classList.add('backgroundResponsivo2')
        linksCarrosselResponsivo[1].style.display = 'block'
    }, 2000);

    setTimeout(() => {
        excluirBgResponsivo(carrosselResponsivo)
        excluirLinkResponsivo(linksCarrosselResponsivo)
        carrosselResponsivo.classList.add('backgroundResponsivo3')
        linksCarrosselResponsivo[2].style.display = 'block'
    }, 3000);

    setTimeout(() => {
        excluirBgResponsivo(carrosselResponsivo)
        excluirLinkResponsivo(linksCarrosselResponsivo)
        carrosselResponsivo.classList.add('backgroundResponsivo1')
        linksCarrosselResponsivo[0].style.display = 'block'
    }, 4000);

}, 4000);

function excluirBgResponsivo(carrosselResponsivo){
    if(carrosselResponsivo.classList.contains('backgroundResponsivo1')) {
        carrosselResponsivo.classList.remove('backgroundResponsivo1')
    }

    if(carrosselResponsivo.classList.contains('backgroundResponsivo2')) {
        carrosselResponsivo.classList.remove('backgroundResponsivo2')
    }

    if(carrosselResponsivo.classList.contains('backgroundResponsivo3')) {
        carrosselResponsivo.classList.remove('backgroundResponsivo3')
    }
}

function excluirLinkResponsivo(linksCarrosselResponsivo){
    if(linksCarrosselResponsivo[0].style.display !== 'none'){
        linksCarrosselResponsivo[0].style.display = 'none'
    }

    if(linksCarrosselResponsivo[1].style.display !== 'none'){
        linksCarrosselResponsivo[1].style.display = 'none'
    }

    if(linksCarrosselResponsivo[2].style.display !== 'none'){
        linksCarrosselResponsivo[2].style.display = 'none'
    }
}




 

