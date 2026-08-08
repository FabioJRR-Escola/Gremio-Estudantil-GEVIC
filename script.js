// --- LÓGICA DO SITE PÚBLICO (Frontend) ---
if (document.getElementById('noticias-grid')) {
    // Renderizar Membros
    const membros = JSON.parse(localStorage.getItem('gremio_membros'));
    const membrosGrid = document.getElementById('membros-grid');
    if (membrosGrid) {
        membrosGrid.innerHTML = membros.map(m => `
            <div class="member-card">
                <div class="member-avatar">${m.nome.charAt(0)}</div>
                <h3>${m.nome}</h3>
                <p>${m.cargo}</p>
            </div>
        `).join('');
    }

    // Renderizar Notícias
    const noticias = JSON.parse(localStorage.getItem('gremio_noticias'));
    const noticiasGrid = document.getElementById('noticias-grid');
    if (noticiasGrid) {
        noticiasGrid.innerHTML = noticias.map(n => `
            <article class="card">
                <div class="card-tag">${n.categoria}</div>
                <h3>${n.titulo}</h3>
                <p>${n.conteudo}</p>
            </article>
        `).join('');
    }

    // Renderizar Eventos
    const eventos = JSON.parse(localStorage.getItem('gremio_eventos'));
    const eventosList = document.getElementById('eventos-list');
    if (eventosList) {
        eventosList.innerHTML = eventos.sort((a,b) => new Date(a.data) - new Date(b.data)).map(e => {
            const { dia, mes } = formatarData(e.data);
            return `
            <div class="event-item">
                <div class="event-date">
                    <span class="day">${dia}</span>
                    <span class="month">${mes}</span>
                </div>
                <div class="event-details">
                    <h3>${e.titulo}</h3>
                    <p>📍 ${e.local}</p>
                </div>
            </div>
        `}).join('');
    }

    // Menu Mobile (Três Barrinhas)
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            document.getElementById('nav-list').classList.toggle('active');
        });
    }

    // Menu Dropdown de Acessibilidade
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

    // Acessibilidade (Alto Contraste e Tamanho de Texto)
    let fontSize = 16;
    const btnInc = document.getElementById('btn-increase-text');
    const btnDec = document.getElementById('btn-decrease-text');
    const btnNorm = document.getElementById('btn-normal-text');
    const btnCont = document.getElementById('btn-contrast');

    if (btnInc) btnInc.addEventListener('click', () => { if(fontSize < 24) { fontSize+=2; document.body.style.fontSize = fontSize+'px'; }});
    if (btnDec) btnDec.addEventListener('click', () => { if(fontSize > 12) { fontSize-=2; document.body.style.fontSize = fontSize+'px'; }});
    if (btnNorm) btnNorm.addEventListener('click', () => { fontSize = 16; document.body.style.fontSize = '16px'; });
    if (btnCont) btnCont.addEventListener('click', () => document.body.classList.toggle('high-contrast'));
}
