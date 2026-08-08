// --- 1. DADOS INICIAIS (Se não houver nada salvo) ---
const initData = () => {
    if (!localStorage.getItem('gremio_noticias')) {
        localStorage.setItem('gremio_noticias', JSON.stringify([
            { id: 1, titulo: 'Reestruturação da Diretoria', categoria: 'Comunicado Oficial', conteudo: 'A partir desta presente data, o Grêmio Estudantil Visão Coletiva anuncia a reestruturação em sua composição de membros para otimizar os projetos deste ano.' },
            { id: 2, titulo: 'Dia D de Combate ao Bullying', categoria: 'Campanha', conteudo: 'No dia 07 de abril, promoveremos ações de conscientização. Construir um debate saudável na escola e nas redes é responsabilidade de todos nós.' }
        ]));
    }
    if (!localStorage.getItem('gremio_eventos')) {
        localStorage.setItem('gremio_eventos', JSON.stringify([
            { id: 1, titulo: 'Reunião com Assessoria Estadual', data: '2026-03-15', local: 'Auditório' },
            { id: 2, titulo: 'Oficina Jovem Senador 2026', data: '2026-04-10', local: 'Biblioteca' }
        ]));
    }
    if (!localStorage.getItem('gremio_membros')) {
        localStorage.setItem('gremio_membros', JSON.stringify([
            { id: 1, nome: 'João Pedro', cargo: 'Presidência' },
            { id: 2, nome: 'Ana Costa', cargo: 'Dir. de Comunicação' }
        ]));
    }
};

initData();

// Funções utilitárias de Data
const formatarData = (dataString) => {
    const data = new Date(dataString + 'T12:00:00'); 
    const dia = String(data.getDate()).padStart(2, '0');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mes = meses[data.getMonth()];
    return { dia, mes };
};

// --- 2. LÓGICA DO SITE PÚBLICO (Frontend) ---
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

    // Menu Mobile
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            document.getElementById('nav-list').classList.toggle('active');
        });
    }

    // Acessibilidade (Alto Contraste e Texto)
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

// --- 3. LÓGICA DO PAINEL ADMINISTRATIVO E LOGIN ---
if (document.getElementById('login-screen')) {

    // Verificar se já está logado na sessão atual
    const checkLogin = () => {
        if (sessionStorage.getItem('gremio_logado') === 'true') {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'flex';
            renderAdminTables();
        }
    };
    checkLogin();

    // Ação de Login
    document.getElementById('form-login').addEventListener('submit', (e) => {
        e.preventDefault();
        const usuarioInput = document.getElementById('login-usuario').value;
        const senhaInput = document.getElementById('login-senha').value;

        // Credenciais padrão de acesso
        const usuarioCorreto = 'admin';
        const senhaCorreta = 'visãocoletiva';

        if (usuarioInput === usuarioCorreto && senhaInput === senhaCorreta) {
            sessionStorage.setItem('gremio_logado', 'true');
            document.getElementById('login-erro').style.display = 'none';
            checkLogin();
        } else {
            document.getElementById('login-erro').style.display = 'block';
        }
    });

    // Função de Logout
    window.logoutAdmin = () => {
        sessionStorage.removeItem('gremio_logado');
        location.reload();
    };

    // Trocar Abas no Admin
    window.openTab = (tabId) => {
        document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        event.currentTarget.classList.add('active');
    };

    // Renderizar Tabelas Admin
    const renderAdminTables = () => {
        // Tabela Notícias
        const noticias = JSON.parse(localStorage.getItem('gremio_noticias'));
        document.getElementById('tabela-noticias').innerHTML = noticias.map(n => `
            <tr>
                <td>${n.titulo}</td><td>${n.categoria}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editarNoticia(${n.id})">Editar</button>
                    <button class="btn-action btn-delete" onclick="deletarItem('gremio_noticias', ${n.id})">X</button>
                </td>
            </tr>
        `).join('');

        // Tabela Eventos
        const eventos = JSON.parse(localStorage.getItem('gremio_eventos'));
        document.getElementById('tabela-eventos').innerHTML = eventos.map(e => `
            <tr>
                <td>${e.data}</td><td>${e.titulo}</td><td>${e.local}</td>
                <td>
                    <button class="btn-action btn-delete" onclick="deletarItem('gremio_eventos', ${e.id})">X</button>
                </td>
            </tr>
        `).join('');

        // Tabela Membros
        const membros = JSON.parse(localStorage.getItem('gremio_membros'));
        document.getElementById('tabela-membros').innerHTML = membros.map(m => `
            <tr>
                <td>${m.nome}</td><td>${m.cargo}</td>
                <td>
                    <button class="btn-action btn-delete" onclick="deletarItem('gremio_membros', ${m.id})">X</button>
                </td>
            </tr>
        `).join('');
    };

    // Função global de deletar
    window.deletarItem = (chave, id) => {
        if(confirm('Tem certeza que deseja apagar?')) {
            let dados = JSON.parse(localStorage.getItem(chave));
            dados = dados.filter(item => item.id !== id);
            localStorage.setItem(chave, JSON.stringify(dados));
            renderAdminTables();
        }
    };

    // Função de Editar Notícia
    window.editarNoticia = (id) => {
        const noticias = JSON.parse(localStorage.getItem('gremio_noticias'));
        const noticia = noticias.find(n => n.id === id);
        document.getElementById('noticia-id').value = noticia.id;
        document.getElementById('noticia-titulo').value = noticia.titulo;
        document.getElementById('noticia-categoria').value = noticia.categoria;
        document.getElementById('noticia-conteudo').value = noticia.conteudo;
    };

    // Submissão: Nova Notícia / Editar
    document.getElementById('form-noticia').addEventListener('submit', (e) => {
        e.preventDefault();
        let noticias = JSON.parse(localStorage.getItem('gremio_noticias'));
        const idAtual = document.getElementById('noticia-id').value;
        
        const novaNoticia = {
            id: idAtual ? parseInt(idAtual) : Date.now(),
            titulo: document.getElementById('noticia-titulo').value,
            categoria: document.getElementById('noticia-categoria').value,
            conteudo: document.getElementById('noticia-conteudo').value
        };

        if(idAtual) {
            noticias = noticias.map(n => n.id === parseInt(idAtual) ? novaNoticia : n);
        } else {
            noticias.push(novaNoticia);
        }
        
        localStorage.setItem('gremio_noticias', JSON.stringify(noticias));
        e.target.reset();
        document.getElementById('noticia-id').value = '';
        renderAdminTables();
    });

    // Submissão: Novo Evento
    document.getElementById('form-evento').addEventListener('submit', (e) => {
        e.preventDefault();
        const eventos = JSON.parse(localStorage.getItem('gremio_eventos'));
        eventos.push({
            id: Date.now(),
            titulo: document.getElementById('evento-titulo').value,
            data: document.getElementById('evento-data').value,
            local: document.getElementById('evento-local').value
        });
        localStorage.setItem('gremio_eventos', JSON.stringify(eventos));
        e.target.reset();
        renderAdminTables();
    });

    // Submissão: Novo Membro
    document.getElementById('form-membro').addEventListener('submit', (e) => {
        e.preventDefault();
        const membros = JSON.parse(localStorage.getItem('gremio_membros'));
        membros.push({
            id: Date.now(),
            nome: document.getElementById('membro-nome').value,
            cargo: document.getElementById('membro-cargo').value
        });
        localStorage.setItem('gremio_membros', JSON.stringify(membros));
        e.target.reset();
        renderAdminTables();
    });
}
