// =========================================================
// ED BARBECUE - SCRIPTS DO SITE
// =========================================================

const raiz = document.documentElement
// AVISA O CSS QUE O SCRIPT RODOU DE VERDADE
raiz.classList.add('js-ok')
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ESCONDE A TELA DE CARREGAMENTO QUANDO O SITE TERMINA DE CARREGAR
const inicioCarregamento = performance.now()

function finalizarCarregamento() {
    if (raiz.classList.contains('carregado')) return
    const tempoMinimo = 700
    const espera = Math.max(0, tempoMinimo - (performance.now() - inicioCarregamento))
    setTimeout(() => raiz.classList.add('carregado'), espera)
}

// LIBERA O SITE ASSIM QUE O CONTEUDO ESTIVER PRONTO (NAO ESPERA TODAS AS IMAGENS)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finalizarCarregamento)
} else {
    finalizarCarregamento()
}
// SEGURANCA: SE ALGO DEMORAR DEMAIS, LIBERA O SITE MESMO ASSIM
setTimeout(finalizarCarregamento, 1500)

// CABECALHO MUDA DE COR AO ROLAR + MOSTRA BOTAO DO WHATSAPP
const header = document.getElementById('header')
const whatsappFlutuante = document.querySelector('.whatsapp-flutuante')

function aoRolar() {
    const rolou = window.scrollY > 40
    header.classList.toggle('header--rolado', rolou)
    whatsappFlutuante.classList.toggle('visivel', window.scrollY > window.innerHeight * 0.6)
}

window.addEventListener('scroll', aoRolar, { passive: true })
aoRolar()

// MENU DO CELULAR
const menuBotao = document.getElementById('menu-botao')
const linksMenu = document.querySelectorAll('.nav a')

function alternarMenu(abrir) {
    const aberto = typeof abrir === 'boolean' ? abrir : !document.body.classList.contains('menu-aberto')
    document.body.classList.toggle('menu-aberto', aberto)
    document.body.classList.toggle('travado', aberto)
    menuBotao.setAttribute('aria-expanded', aberto)
    menuBotao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu')
}

menuBotao.addEventListener('click', () => alternarMenu())
linksMenu.forEach(link => link.addEventListener('click', () => alternarMenu(false)))
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-aberto')) alternarMenu(false)
})

// DESTACA NO MENU A SECAO QUE ESTA NA TELA
const linksNav = document.querySelectorAll('.nav__link')
const secoesMenu = [...linksNav].map(link => document.querySelector(link.getAttribute('href')))

const observadorMenu = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return
        linksNav.forEach(link => {
            link.classList.toggle('ativo', link.getAttribute('href') === '#' + entrada.target.id)
        })
    })
}, { rootMargin: '-45% 0px -50% 0px' })

secoesMenu.forEach(secao => secao && observadorMenu.observe(secao))

// REVELA OS ELEMENTOS QUANDO APARECEM NA TELA
const observadorRevelar = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return
        entrada.target.classList.add('revelado')
        observadorRevelar.unobserve(entrada.target)
    })
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

document.querySelectorAll('[data-revelar]').forEach(el => observadorRevelar.observe(el))

// CONTADOR ANIMADO (15+ ANOS)
const observadorContador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return
        const el = entrada.target
        const final = Number(el.dataset.contador)
        const duracao = reduzirMovimento ? 0 : 1600
        const inicio = performance.now()

        function passo(agora) {
            const progresso = duracao ? Math.min((agora - inicio) / duracao, 1) : 1
            const suave = 1 - Math.pow(1 - progresso, 3)
            el.textContent = Math.round(final * suave)
            if (progresso < 1) requestAnimationFrame(passo)
        }

        requestAnimationFrame(passo)
        observadorContador.unobserve(el)
    })
}, { threshold: 0.6 })

document.querySelectorAll('[data-contador]').forEach(el => observadorContador.observe(el))

// LUZ DOS CARTOES SEGUE O MOUSE
document.querySelectorAll('.cartao').forEach(cartao => {
    cartao.addEventListener('pointermove', e => {
        const r = cartao.getBoundingClientRect()
        cartao.style.setProperty('--mouse-x', `${e.clientX - r.left}px`)
        cartao.style.setProperty('--mouse-y', `${e.clientY - r.top}px`)
    })
})

// CHURRASQUEIRO DO TOPO SE MEXE COM O MOUSE
const chef = document.getElementById('hero-chef')
const hero = document.querySelector('.hero')

if (!reduzirMovimento && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        chef.style.transform = `translate(${x * -12}px, ${y * -8}px) rotate(${x * -1.5}deg)`
    })
    hero.addEventListener('pointerleave', () => { chef.style.transform = '' })
}

// BRASAS SUBINDO NO FUNDO DO TOPO
const canvas = document.getElementById('brasas')

if (canvas && !reduzirMovimento) {
    const ctx = canvas.getContext('2d')
    let largura, altura, particulas = [], animando = false, idAnimacao

    function redimensionar() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        largura = canvas.offsetWidth
        altura = canvas.offsetHeight
        canvas.width = largura * dpr
        canvas.height = altura * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        const quantidade = Math.round(Math.min(70, largura / 18))
        particulas = Array.from({ length: quantidade }, () => criarParticula(true))
    }

    function criarParticula(espalhar) {
        return {
            x: Math.random() * largura,
            y: espalhar ? Math.random() * altura : altura + 10,
            raio: Math.random() * 2.2 + 0.6,
            velocidade: Math.random() * 0.8 + 0.3,
            balanco: Math.random() * Math.PI * 2,
            vida: Math.random() * 0.6 + 0.4
        }
    }

    function desenhar() {
        ctx.clearRect(0, 0, largura, altura)
        particulas.forEach((p, i) => {
            p.y -= p.velocidade
            p.balanco += 0.02
            p.x += Math.sin(p.balanco) * 0.4
            const alpha = Math.max(0, (p.y / altura)) * p.vida

            ctx.beginPath()
            ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, ${120 + Math.round(p.raio * 30)}, 40, ${alpha})`
            ctx.shadowBlur = 12
            ctx.shadowColor = 'rgba(255, 107, 26, .9)'
            ctx.fill()

            if (p.y < -10) particulas[i] = criarParticula(false)
        })
        idAnimacao = requestAnimationFrame(desenhar)
    }

    // SO ANIMA QUANDO O TOPO ESTA VISIVEL (ECONOMIZA BATERIA)
    new IntersectionObserver(([entrada]) => {
        if (entrada.isIntersecting && !animando) {
            animando = true
            desenhar()
        } else if (!entrada.isIntersecting && animando) {
            animando = false
            cancelAnimationFrame(idAnimacao)
        }
    }).observe(canvas)

    let tempoResize
    window.addEventListener('resize', () => {
        clearTimeout(tempoResize)
        tempoResize = setTimeout(redimensionar, 200)
    })
    redimensionar()
}

// =========================================================
// GALERIA - FILTRO, VER MAIS E FOTO AMPLIADA
// =========================================================
const itensGaleria = [...document.querySelectorAll('.galeria__item')]
const botoesFiltro = document.querySelectorAll('.filtro')
const botaoVerMais = document.getElementById('ver-mais')
const FOTOS_INICIAIS = window.innerWidth < 520 ? 8 : 12

let filtroAtual = 'todos'
let mostrarTodas = false

function atualizarGaleria() {
    const filtradas = itensGaleria.filter(item => filtroAtual === 'todos' || item.dataset.categoria === filtroAtual)

    itensGaleria.forEach(item => item.classList.add('escondido'))
    filtradas.forEach((item, i) => {
        const visivel = mostrarTodas || i < FOTOS_INICIAIS
        item.classList.toggle('escondido', !visivel)
        // REINICIA A ANIMACAO DE ENTRADA DA FOTO
        item.style.animation = 'none'
        item.offsetHeight
        item.style.animation = ''
        item.style.animationDelay = `${Math.min(i, 12) * 40}ms`
    })

    botaoVerMais.parentElement.hidden = mostrarTodas || filtradas.length <= FOTOS_INICIAIS
}

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesFiltro.forEach(b => {
            b.classList.toggle('ativo', b === botao)
            b.setAttribute('aria-pressed', b === botao)
        })
        filtroAtual = botao.dataset.filtro
        mostrarTodas = false
        atualizarGaleria()
    })
})

botaoVerMais.addEventListener('click', () => {
    mostrarTodas = true
    atualizarGaleria()
})

atualizarGaleria()

// LIGHTBOX
const lightbox = document.getElementById('lightbox')
const lightboxImagem = document.getElementById('lightbox-imagem')
const lightboxLegenda = document.getElementById('lightbox-legenda')
let indiceAtual = 0

function fotosVisiveis() {
    return itensGaleria.filter(item => !item.classList.contains('escondido')).map(item => item.querySelector('a'))
}

function mostrarFoto(indice) {
    const fotos = fotosVisiveis()
    indiceAtual = (indice + fotos.length) % fotos.length
    const link = fotos[indiceAtual]
    lightboxImagem.src = link.getAttribute('href')
    lightboxImagem.alt = link.querySelector('img').alt
    lightboxLegenda.textContent = link.dataset.legenda
    // REINICIA A ANIMACAO A CADA TROCA DE FOTO
    lightboxImagem.style.animation = 'none'
    lightboxImagem.offsetHeight
    lightboxImagem.style.animation = ''
}

document.getElementById('galeria-grade').addEventListener('click', e => {
    const link = e.target.closest('.galeria__link')
    if (!link) return
    // NAVEGADOR ANTIGO SEM SUPORTE: ABRE A FOTO NORMALMENTE
    if (typeof lightbox.showModal !== 'function') return
    e.preventDefault()
    mostrarFoto(fotosVisiveis().indexOf(link))
    lightbox.showModal()
    document.body.classList.add('travado')
})

lightbox.addEventListener('close', () => document.body.classList.remove('travado'))
document.getElementById('lightbox-fechar').addEventListener('click', () => lightbox.close())
document.getElementById('lightbox-anterior').addEventListener('click', () => mostrarFoto(indiceAtual - 1))
document.getElementById('lightbox-proxima').addEventListener('click', () => mostrarFoto(indiceAtual + 1))

// FECHA AO CLICAR FORA DA FOTO
lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.close()
})

// SETAS DO TECLADO
lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') mostrarFoto(indiceAtual - 1)
    if (e.key === 'ArrowRight') mostrarFoto(indiceAtual + 1)
})

// ARRASTAR PARA OS LADOS NO CELULAR
let toqueInicioX = 0
lightbox.addEventListener('touchstart', e => { toqueInicioX = e.touches[0].clientX }, { passive: true })
lightbox.addEventListener('touchend', e => {
    const diferenca = e.changedTouches[0].clientX - toqueInicioX
    if (Math.abs(diferenca) > 50) mostrarFoto(indiceAtual + (diferenca < 0 ? 1 : -1))
})

// ANO ATUAL NO RODAPE
document.getElementById('ano').textContent = new Date().getFullYear()
