document.addEventListener('DOMContentLoaded', () => {
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

    // CARROSSEL DE BANNERS
    const bannerTrack = document.getElementById('banner-track');
    const bannerPrev = document.getElementById('banner-prev');
    const bannerNext = document.getElementById('banner-next');
    const bannerDotsContainer = document.getElementById('banner-dots');

    // Banners padrão + banners salvos no LocalStorage
    let bannersPadrao = [
        { imagem: '1780189057214.png', descricao: 'O portal oficial de comunicação institucional, transparência e defesa dos direitos dos estudantes do CECM Santos Dumont E.F.M.' }
    ];
    let bannersSalvos = JSON.parse(localStorage.getItem('gremio_banners')) || [];
    let todosBanners = [...bannersPadrao, ...bannersSalvos];

    if (bannerTrack) {
        bannerTrack.innerHTML = todosBanners.map((b, index) => `
            <div class="banner-slide ${index === 0 ? 'active' : ''}">
                <img src="${b.imagem}" alt="Banner Institucional" class="slogan-img">
                ${b.descricao ? `<p class="hero-description">${b.descricao}</p>` : ''}
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
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentBanner = index;
        }

        if (bannerNext) {
            bannerNext.addEventListener('click', () => {
                let nextIndex = (currentBanner + 1) % slides.length;
                showBanner(nextIndex);
            });
        }

        if (bannerPrev) {
            bannerPrev.addEventListener('click', () => {
                let prevIndex = (currentBanner - 1 + slides.length) % slides.length;
                showBanner(prevIndex);
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                showBanner(parseInt(e.target.dataset.index));
            });
        });

        // Auto-play do carrossel de banners a cada 5 segundos
        if (slides.length > 1) {
            setInterval(() => {
                let nextIndex = (currentBanner + 1) % slides.length;
                showBanner(nextIndex);
            }, 5000);
        }
    }

    if (document.getElementById('noticias-grid')) {
        // Renderizar Membros em Carrossel
        const membros = JSON.parse(localStorage.getItem('gremio_membros')) || [];
        const membrosGrid = document.getElementById('membros-grid');
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

            // Controle de navegação do carrossel de membros
            const memberPrev = document.getElementById('member-prev');
            const memberNext = document.getElementById('member-next');
            if (memberPrev && memberNext) {
                memberPrev.addEventListener('click', () => {
                    membrosGrid.scrollBy({ left: -250, behavior: 'smooth' });
                });
                memberNext.addEventListener('click', () => {
                    membrosGrid.scrollBy({ left: 250, behavior: 'smooth' });
                });
            }
        } else if (membrosGrid) {
            membrosGrid.innerHTML = `<p style="text-align:center; width:100%; color:#64748b; font-size:0.9rem;">Nenhum membro cadastrado na diretoria ainda.</p>`;
        }

        // Renderizar Notícias com imagem anexada
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

        // Renderizar Eventos com imagem anexada
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