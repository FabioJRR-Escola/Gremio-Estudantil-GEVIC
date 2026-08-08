// Abrir e fechar o menu no mobile
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
});

// Fechar menu ao clicar em um link (no celular)
const navLinks = document.querySelectorAll('#nav-list li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navList.classList.remove('active');
        }
    });
});

// Rolagem suave (Smooth Scroll) ao clicar nos itens do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
