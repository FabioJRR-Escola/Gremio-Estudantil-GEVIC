document.addEventListener('DOMContentLoaded', () => {
    // --- 1. EFEITO STICKY SHRINK NO HEADER ---
    const headerElement = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            headerElement.classList.add('scrolled');
        } else {
            headerElement.classList.remove('scrolled');
        }
    });

    // --- 2. ANIMAÇÕES DE FADE-IN NAS SEÇÕES ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });

    // --- 3. MENU MOBILE ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.toggle('active');
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
            }
        });
    }

    // --- 4. ACESSIBILIDADE ---
    const btnToggleAcc = document.getElementById('btn-toggle-accessibility');
    const accMenu = document.getElementById('accessibility-menu');
    if (btnToggleAcc && accMenu) {
        btnToggleAcc.addEventListener('click', (e) => {
            e.stopPropagation();
            accMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            accMenu.classList.remove('active');
        });
        accMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    let fontSize = 16;
    const btnInc = document.getElementById('btn-increase-text');
    const btnDec = document.getElementById('btn-decrease-text');
    const btnNorm = document.getElementById('btn-normal-text');
    const btnCont = document.getElementById('btn-contrast');

    if (btnInc) btnInc.addEventListener('click', () => { if(fontSize < 24) { fontSize+=2; document.body.style.fontSize = fontSize+'px'; }});
    if (btnDec) btnDec.addEventListener('click', () => { if(fontSize > 12) { fontSize-=2; document.body.style.fontSize = fontSize+'px'; }});
    if (btnNorm) btnNorm.addEventListener('click', () => { fontSize = 16; document.body.style.fontSize = '16px'; });
    if (btnCont) btnCont.addEventListener('click', () => document.body.classList.toggle('high-contrast'));

        // --- 5. CARROSSEL DE BANNERS (SWIPE + 15 SEGUNDOS, SEM TEXTO) ---
    const bannerTrack = document.getElementById('banner-track');
    const bannerContainer = document.getElementById('banner-container');
    const bannerDotsContainer = document.getElementById('banner-dots');

    // Agora o banner padrão tem apenas a imagem
    let bannersPadrao = [
        { imagem: '1780189057214.png' } 
    ];
    
    // Puxa os banners salvos no admin
    let bannersSalvos = JSON.parse(localStorage.getItem('gremio_banners')) || [];
    let todosBanners = [...bannersPadrao, ...bannersSalvos];

    if (bannerTrack && bannerContainer) {
        // Injeta apenas a tag <img>
        bannerTrack.innerHTML = todosBanners.map((b, index) => `
            <div class="banner-slide ${index === 0 ? 'active' : ''}">
                <img src="${b.imagem}" alt="Banner Institucional" class="banner-img">
            </div>
        `).join('');

        if (todosBanners.length > 1 && bannerDotsContainer) {
            bannerDotsContainer.innerHTML = todosBanners.map((_, index) => `
                <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
            `).join('');
        }

        let currentBanner = 0;
        const slides = bannerTrack.querySelectorAll('.banner-slide');
        const dots = bannerDotsContainer ? bannerDotsContainer.querySelectorAll('.carousel-dot') : [];

        function showBanner(index) {
            slides.forEach((slide, i) => { slide.classList.toggle('active', i === index); });
            dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); });
            currentBanner = index;
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                showBanner(parseInt(e.target.dataset.index));
            });
        });

        // Temporizador de 15 segundos
        let bannerInterval = setInterval(() => {
            let nextIndex = (currentBanner + 1) % slides.length;
            showBanner(nextIndex);
        }, 15000);

        // Pausar auto-play ao interagir
        bannerContainer.addEventListener('mouseenter', () => clearInterval(bannerInterval));
        bannerContainer.addEventListener('mouseleave', () => {
            if (slides.length > 1) {
                bannerInterval = setInterval(() => {
                    let nextIndex = (currentBanner + 1) % slides.length;
                    showBanner(nextIndex);
                }, 15000);
            }
        });

        // Suporte a arrastar (Touch / Mouse Swipe) nos banners
        let startX = 0;
        let isDraggingBanner = false;

        bannerContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDraggingBanner = true; }, {passive: true});
        bannerContainer.addEventListener('touchend', (e) => {
            if (!isDraggingBanner) return;
            handleBannerSwipe(startX, e.changedTouches[0].clientX);
            isDraggingBanner = false;
        });
        bannerContainer.addEventListener('mousedown', (e) => { startX = e.clientX; isDraggingBanner = true; });
        bannerContainer.addEventListener('mouseup', (e) => {
            if (!isDraggingBanner) return;
            handleBannerSwipe(startX, e.clientX);
            isDraggingBanner = false;
        });

        function handleBannerSwipe(startX, endX) {
            let threshold = 50;
            if (startX - endX > threshold) {
                showBanner((currentBanner + 1) % slides.length);
            } else if (endX - startX > threshold) {
                showBanner((currentBanner - 1 + slides.length) % slides.length);
            }
        }
    }

    // --- 6. RENDERIZAÇÃO E CARROSSEL DE MEMBROS ---
    if (document.getElementById('noticias-grid')) {
        const membros = JSON.parse(localStorage.getItem('gremio_membros')) || [];
        const membrosGrid = document.getElementById('membros-grid');
        const membrosViewport = document.getElementById('members-viewport');

        if (membrosGrid && membros.length > 0) {
            membrosGrid.innerHTML = membros.map(m => `
                <div class="member-card">
                    <div class="member-avatar">
                        ${m.foto ? `<img src="${m.foto}" alt="${m.nome}">` : m.nome.charAt(0)}
                    </div>
                    <h3>${m.nome}</h3>
                    <p>${m.cargo}</p>
                    ${m.bio ? `<p class="member-bio">${m.bio}</p>` : ''}
                </div>
            `).join('');

            const memberPrev = document.getElementById('member-prev');
            const memberNext = document.getElementById('member-next');
            if (memberPrev && memberNext && membrosViewport) {
                memberPrev.addEventListener('click', () => membrosViewport.scrollBy({ left: -260, behavior: 'smooth' }));
                memberNext.addEventListener('click', () => membrosViewport.scrollBy({ left: 260, behavior: 'smooth' }));
            }

            // Suporte a arrastar no carrossel de membros
            if (membrosViewport) {
                let isDown = false;
                let startX;
                let scrollLeft;

                membrosViewport.addEventListener('mousedown', (e) => {
                    isDown = true;
                    membrosViewport.classList.add('active');
                    startX = e.pageX - membrosViewport.offsetLeft;
                    scrollLeft = membrosViewport.scrollLeft;
                });
                membrosViewport.addEventListener('mouseleave', () => { isDown = false; membrosViewport.classList.remove('active'); });
                membrosViewport.addEventListener('mouseup', () => { isDown = false; membrosViewport.classList.remove('active'); });
                membrosViewport.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - membrosViewport.offsetLeft;
                    const walk = (x - startX) * 2;
                    membrosViewport.scrollLeft = scrollLeft - walk;
                });
            }
        } else if (membrosGrid) {
            membrosGrid.innerHTML = `<p style="text-align:center; width:100%; color:#64748b; font-size:0.9rem;">Nenhum membro cadastrado na diretoria ainda.</p>`;
        }

        // --- 7. RENDERIZAÇÃO DE NOTÍCIAS ---
        const noticias = JSON.parse(localStorage.getItem('gremio_noticias')) || [];
        const noticiasGrid = document.getElementById('noticias-grid');
        if (noticiasGrid && noticias.length > 0) {
            noticiasGrid.innerHTML = noticias.map(n => `
                <article class="card">
                    <div>
                        ${n.imagem ? `<img src="${n.imagem}" alt="${n.titulo}" class="card-img">` : ''}
                        <div class="card-tag">${n.categoria || 'Geral'}</div>
                        <h3>${n.titulo}</h3>
                        ${n.data ? `<div class="card-meta"><i class="fa-solid fa-calendar"></i> ${n.data}</div>` : ''}
                        <p>${n.conteudo}</p>
                    </div>
                </article>
            `).join('');
        }

        // --- 8. RENDERIZAÇÃO DE EVENTOS ---
        const eventos = JSON.parse(localStorage.getItem('gremio_eventos')) || [];
        const eventosList = document.getElementById('eventos-list');
        if (eventosList && eventos.length > 0) {
            const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            eventosList.innerHTML = eventos.sort((a,b) => new Date(a.data) - new Date(b.data)).map(e => {
                const d = new Date(e.data + 'T00:00:00');
                const dia = isNaN(d.getDate()) ? '01' : String(d.getDate()).padStart(2, '0');
                const mes = isNaN(d.getMonth()) ? 'JAN' : meses[d.getMonth()];
                return `
                <div class="event-item">
                    <div class="event-main-info">
                        ${e.imagem ? `<img src="${e.imagem}" alt="${e.titulo}" class="event-img">` : ''}
                        <div class="event-date">
                            <span class="day">${dia}</span>
                            <span class="month">${mes}</span>
                        </div>
                        <div class="event-details">
                            <h3>${e.titulo}</h3>
                            <p><i class="fa-solid fa-location-dot"></i> ${e.local || 'Local a definir'}</p>
                            ${e.descricao ? `<p>${e.descricao}</p>` : ''}
                        </div>
                    </div>
                </div>
            `}).join('');
        }
    }
});