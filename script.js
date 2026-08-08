// --- FUNCIONALIDADE DO MENU MOBILE ---
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');

mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
});

const navLinks = document.querySelectorAll('#nav-list li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navList.classList.remove('active');
        }
    });
});

// --- SCROLL SUAVE ---
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

// --- FUNÇÕES DE ACESSIBILIDADE ---
let currentFontSize = 16;
const bodyElement = document.body;

// Aumentar Texto
document.getElementById('btn-increase-text').addEventListener('click', () => {
    if (currentFontSize < 24) {
        currentFontSize += 2;
        bodyElement.style.fontSize = currentFontSize + 'px';
    }
});

// Diminuir Texto
document.getElementById('btn-decrease-text').addEventListener('click', () => {
    if (currentFontSize > 12) {
        currentFontSize -= 2;
        bodyElement.style.fontSize = currentFontSize + 'px';
    }
});

// Tamanho Normal
document.getElementById('btn-normal-text').addEventListener('click', () => {
    currentFontSize = 16;
    bodyElement.style.fontSize = currentFontSize + 'px';
});

// Alternar Alto Contraste
document.getElementById('btn-contrast').addEventListener('click', () => {
    bodyElement.classList.toggle('high-contrast');
});
