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

    // CARROSSEL DE BANNERS (15 SEGUNDOS + ARRASTAR / SWIPE)
    const bannerTrack = document.getElementById('banner-track');
    const bannerContainer = document.getElementById('banner-container');
    const bannerPrev = document.getElementById('banner-prev');
    const bannerNext = document.getElementById('banner-next');
    const bannerDotsContainer = document.getElementById('banner-dots');

    let bannersPadrao = [
        { imagem: '1780189057214.png', descricao: 'O portal oficial de comunicação institucional, transparência e defesa dos direitos dos estudantes do CECM Santos Dumont E.F.M.' }
    ];
    let bannersSalvos = JSON.parse(localStorage.getItem('gremio_banners')) || [];
    let todosBanners = [...bannersPadrao, ...bannersSalvos];

    if (bannerTrack && bannerContainer) {
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

        // Auto-play de 15 segundos
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

        bannerContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDraggingBanner = true;
        });

        bannerContainer.addEventListener('touchmove', (e) => {
            if (!isDraggingBanner) return;
        });

        bannerContainer.addEventListener('touchend', (e) => {
            if (!isDraggingBanner) return;
            let endX = e.changedTouches[0].clientX;
            handleBannerSwipe(startX, endX);
            isDraggingBanner = false;
        });

        bannerContainer.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDraggingBanner = true;
        });

        bannerContainer.addEventListener('mouseup', (e) => {
            if (!isDraggingBanner) return;
            let endX = e.clientX;
            handleBannerSwipe(startX, endX);
            isDraggingBanner = false;
        });

        function handleBannerSwipe(startX, endX) {
            let threshold = 50;
            if (startX - endX > threshold) {
                // Arrastou para a esquerda (próximo)
                let nextIndex = (currentBanner + 1) % slides.length;
                showBanner(nextIndex);
            } else if (endX - startX > threshold) {
                // Arrastou para a direita (anterior)
                let prevIndex = (currentBanner - 1 + slides.length) % slides.length;
                showBanner(prevIndex);
            }
        }
    }

    if (document.getElementById('noticias-grid')) {
        // Renderizar Membros em Carrossel Arrastável
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

            // Navegação por botões discretos
            const memberPrev = document.getElementById('member-prev');
            const memberNext = document.getElementById('member-next');
            if (memberPrev && memberNext && membrosViewport) {
                memberPrev.addEventListener('click', () => {
                    membrosViewport.scrollBy({ left: -260, behavior: 'smooth' });
                });
                memberNext.addEventListener('click', () => {
                    membrosViewport.scrollBy({ left: 260, behavior: 'smooth' });
                });
            }

            // Suporte a arrastar com o mouse (Drag to scroll)
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

                membrosViewport.addEventListener('mouseleave', () => {
                    isDown = false;
                    membrosViewport.classList.remove('active');
                });

                membrosViewport.addEventListener('mouseup', () => {
                    isDown = false;
                    membrosViewport.classList.remove('active');
                });

                membrosViewport.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - membrosViewport.offsetLeft;
                    const walk = (x - startX) * 2; // Velocidade do arraste
                    membrosViewport.scrollLeft = scrollLeft - walk;
                });
            }
        } else if (membrosGrid) {
            membrosGrid.innerHTML = `<p style="text-align:center; width:100%; color:#64748b; font-size:0.9rem;">Nenhum membro cadastrado na diretoria ainda.</p>`;
        }

        // Renderizar Notícias
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

        // Renderizar Eventos
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