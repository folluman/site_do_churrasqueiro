const menuHamburguer = document.querySelector('.img__menuHamburguer')
const navLinks = document.querySelector('.header__links')
const links = document.querySelectorAll('.nav_links')
const linkIni = document.querySelector('.nav__links')
const siteLogging = document.querySelector('.site__logging')
const siteBody = document.querySelector('.site__body') 
const bannerWelcome = document.querySelector('.carousel-Welcome')

ScrollReveal({ reset: true });

setTimeout(() => {
    siteLogging.classList.add('hidden')
}, 5000)

setTimeout (() => {
    
    siteBody.classList.remove('hidden')
    

    // Modifica a velocidade do carousel
    $('#carouselExample').carousel({
        interval: 2000
    });


    // Habilita e desabilita o Menu hamburguer
    menuHamburguer.addEventListener('click', function() {
        navLinks.classList.toggle('hidden')
     
        if (menuHamburguer.getAttribute('src') == './assets/menu_hamburguer.svg') {
            menuHamburguer.setAttribute('src', './assets/x_Button.svg')
        }
        else {
            menuHamburguer.setAttribute('src', './assets/menu_hamburguer.svg')
        }

        if (!menuHamburguer.classList.contains('hidden')){
    
            links.forEach(i => {
                i.classList.add('hidden')
        
                setTimeout(() => {
        
                    i.classList.remove('hidden')
        
                }, 2000)
            });
                }

        if (window.innerWidth >= 1080) {
            bannerWelcome.style.backgroundImage = "url('./assets/backgroundHomePc1.svg')"
        }
    })

    ScrollReveal().reveal('.home__apresentacao, .sobre__paragrafo, .eventos__texto', { 
        duration: 2000,
        distance: '90px',
     });

     ScrollReveal().reveal('.img__churrasqueiro', { 
        duration: 1000,
        distance: '90px',
     });

     ScrollReveal().reveal('.sep', {
        scale: 0.5,  
        duration: 2000,  
        easing: 'ease-in-out', 
        reset: true  
    });

}, 6000)