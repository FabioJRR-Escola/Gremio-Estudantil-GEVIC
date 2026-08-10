document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efeito Sticky no Header
    const headerElement = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            headerElement.classList.add('scrolled');
        } else {
            headerElement.classList.remove('scrolled');
        }
    });

    // 2. Animação de Scroll (Fade In)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });

    // 3. Menu Mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.toggle('active');
        });
    }

    // 4. Acessibilidade
    const btnToggleAcc = document.getElementById('btn-toggle-accessibility');
    const accMenu = document.getElementById('accessibility-menu');
    if (btnToggleAcc && accMenu) {
        btnToggleAcc.addEventListener('click', (e) => {
            e.stopPropagation();
            accMenu.classList.toggle('active');
        });
    }

    let fontSize = 16;
    const btnInc = document.getElementById('btn-increase-text');
    const btnDec = document.getElementById('btn-decrease-text');
    const btnNorm = document.getElementById('btn-normal-text');
    const btnCont = document.getElementById('btn-contrast');

    if (btnInc) btnInc.addEventListener('click', () => { fontSize+=2; document.body.style.fontSize = fontSize+'px'; });
    if (btnDec) btnDec.addEventListener('click', () => { fontSize-=2; document.body.style.fontSize = fontSize+'px'; });
    if (btnNorm) btnNorm.addEventListener('click', () => { fontSize = 16; document.body.style.fontSize = '16px'; });
    if (btnCont) btnCont.addEventListener('click', () => document.body.classList.toggle('high-contrast'));

    // 5. Carrossel de Banners
    const bannerTrack = document.getElementById('banner-track');
    const bannerDotsContainer = document.getElementById('banner-dots');
    
    if (bannerTrack && bannerDotsContainer) {
        const slides = bannerTrack.querySelectorAll('.banner-slide');
        let currentBanner = 0;

        // Cria os pontos (dots) automaticamente
        bannerDotsContainer.innerHTML = Array.from(slides).map((_, i) => `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('');
        const dots = bannerDotsContainer.querySelectorAll('.carousel-dot');

        function showBanner(index) {
            slides.forEach((s, i) => s.classList.toggle('active', i === index));
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            currentBanner = index;
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => showBanner(parseInt(e.target.dataset.index)));
        });

        // Auto play 15s
        setInterval(() => {
            showBanner((currentBanner + 1) % slides.length);
        }, 15000);
    }

    // 6. Carrossel de Membros (Diretoria)
    const membrosViewport = document.getElementById('members-viewport');
    const memberPrev = document.getElementById('member-prev');
    const memberNext = document.getElementById('member-next');

    if (membrosViewport && memberPrev && memberNext) {
        memberPrev.addEventListener('click', () => membrosViewport.scrollBy({ left: -300, behavior: 'smooth' }));
        memberNext.addEventListener('click', () => membrosViewport.scrollBy({ left: 300, behavior: 'smooth' }));
    }
});