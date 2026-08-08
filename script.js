document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile (Três Barrinhas)
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.toggle('active');
        });

        // Fecha o menu ao clicar em qualquer link interno
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });

        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
            }
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

    // Ferramentas de Acessibilidade (Alto Contraste e Tamanho de Texto)
    let fontSize = 16;
    const btnInc = document.getElementById('btn-increase-text');
    const btnDec = document.getElementById('btn-decrease-text');
    const btnNorm = document.getElementById('btn-normal-text');
    const btnCont = document.getElementById('btn-contrast');

    if (btnInc) btnInc.addEventListener('click', () => { if(fontSize < 24) { fontSize+=2; document.body.style.fontSize = fontSize+'px'; }});
    if (btnDec) btnDec.addEventListener('click', () => { if(fontSize > 12) { fontSize-=2; document.body.style.fontSize = fontSize+'px'; }});
    if (btnNorm) btnNorm.addEventListener('click', () => { fontSize = 16; document.body.style.fontSize = '16px'; });
    if (btnCont) btnCont.addEventListener('click', () => document.body.classList.toggle('high-contrast'));

    // Renderização de Dados Dinâmicos (Membros, Notícias e Eventos)
    if (document.getElementById('noticias-grid')) {
        const membros = JSON.parse(localStorage.getItem('gremio_membros')) || [];
        const membrosGrid = document.getElementById('membros-grid');
        if (membrosGrid && membros.length > 0) {
            membrosGrid.innerHTML = membros.map(m => `
                <div class="member-card">
                    <div class="member-avatar">${m.nome.charAt(0)}</div>
                    <h3>${m.nome}</h3>
                    <p>${m.cargo}</p>
                </div>
            `).join('');
        }

        const noticias = JSON.parse(localStorage.getItem('gremio_noticias')) || [];
        const noticiasGrid = document.getElementById('noticias-grid');
        if (noticiasGrid && noticias.length > 0) {
            noticiasGrid.innerHTML = noticias.map(n => `
                <article class="card">
                    <div class="card-tag">${n.categoria}</div>
                    <h3>${n.titulo}</h3>
                    <p>${n.conteudo}</p>
                </article>
            `).join('');
        }

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
    }
});