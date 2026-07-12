// =========================================================================
// CONFIGURAÇÃO OFICIAL DO BANCO DE DADOS (FIREBASE SDK)
// =========================================================================
const firebaseConfig = {
    databaseURL: "https://visao-coletiva-default-rtdb.firebaseio.com"
};

// Inicializa o Firebase e a conexão WebSocket estável
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let cacheTransparencia = [];

document.addEventListener('DOMContentLoaded', () => {
    // Garante que a estrutura padrão inicial existe na nuvem
    verificarEInicializarBancoNuvem();

    // ESCUTA REALTIME TOTAL: Baixa os dados dinamicamente à medida que mudam
    db.ref().on('value', (snapshot) => {
        const dados = snapshot.val() || {};

        renderizarIdentidadeVisual(dados.gre_visual);
        renderizarPortalNoticias(obterLista(dados.gre_noticias));
        renderizarPortalAgenda(obterLista(dados.gre_agenda));
        renderizarPortalProjetos(obterLista(dados.gre_projetos));
        renderizarPortalMembros(obterLista(dados.gre_membros));
        renderizarPortalMural(obterLista(dados.gre_sugestoes));
        renderizarPortalTransparencia(obterLista(dados.gre_transparencia));
        renderizarPortalRodape(dados.gre_rodape);
    });

    configurarFormularioEstudante();
    configurarRolagemSuave();
});

// Auxiliar para garantir que os dados lidos do Firebase operem sempre como arrays estáveis
function obterLista(dados) {
    if (!dados) return [];
    return Array.isArray(dados) ? dados : Object.values(dados);
}

function verificarEInicializarBancoNuvem() {
    db.ref('gre_noticias').once('value', snapshot => {
        if (!snapshot.exists()) {
            db.ref('gre_noticias').set([
                { titulo: "Boas-vindas ao novo Portal do Grêmio!", data: "2026-02-15", texto: "Agora nosso portal está 100% online e sincronizado em tempo real na nuvem.", foto: "" }
            ]);
        }
    });
    db.ref('gre_agenda').once('value', s => {
        if(!s.exists()) db.ref('gre_agenda').set([{ data: "2026-04-07", titulo: "Dia D de Combate ao Bullying", descricao: "Ações de conscientização nas salas." }]);
    });
    db.ref('gre_projetos').once('value', s => {
        if(!s.exists()) db.ref('gre_projetos').set([{ icone: "📢", titulo: "Voz Ativa", descricao: "Assembleias regulares com líderes de turma." }]);
    });
    db.ref('gre_membros').once('value', s => {
        if(!s.exists()) db.ref('gre_membros').set([{ nome: "Diretoria Visão Coletiva", cargo: "Gestão Atual", serie: "Ano Letivo 2026", foto: "" }]);
    });
    db.ref('gre_sugestoes').once('value', s => {
        if(!s.exists()) db.ref('gre_sugestoes').set([{ texto: "Portal oficial lançado com sucesso!", autor: "Grêmio Estudantil", status: "Aprovado" }]);
    });
    db.ref('gre_transparencia').once('value', s => {
        if(!s.exists()) db.ref('gre_transparencia').set([{ titulo: "Estatuto Oficial", descricao: "Regimento interno do Grêmio.", arquivo: "", nomeArquivo: "" }]);
    });
    db.ref('gre_rodape').once('value', s => {
        if(!s.exists()) {
            db.ref('gre_rodape').set({
                descricao: "O Portal do Grêmio Estudantil Visão Coletiva é o canal oficial de transparência e união dos estudantes.",
                instagram: "#",
                email: "contato@visaocoletiva.edu.br",
                localizacao: "Sala do Grêmio",
                atendimento: "Nos intervalos das aulas."
            });
        }
    });
}

function renderizarIdentidadeVisual(visual) {
    if (!visual) return;
    if (visual.logo) {
        const logoElement = document.getElementById('portal-logo');
        if (logoElement) {
            logoElement.innerHTML = `<img src="${visual.logo}" alt="Logotipo do Grêmio" style="max-height: 50px; width: auto; object-fit: contain; display: block;">`;
        }
    }
    if (visual.banner) {
        const heroSection = document.getElementById('hero-banner-section');
        if (heroSection) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(14, 34, 61, 0.75), rgba(14, 34, 61, 0.75)), url(${visual.banner})`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }
}

function renderizarPortalNoticias(noticias) {
    const container = document.getElementById('noticias-container');
    if (!container) return;

    if(noticias.length === 0) {
        container.innerHTML = '<p style="color:var(--texto-claro)">Nenhuma notícia publicada.</p>';
        return;
    }

    let html = '';
    noticias.forEach(item => {
        const partesData = item.data ? item.data.split('-') : [];
        const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : (item.data || '');
        const mediaRender = item.foto 
            ? `<img src="${item.foto}" class="card-news-img" alt="Imagem da notícia">`
            : `<i class="fa-solid fa-bullhorn news-icon"></i>`;

        html += `
            <article class="card">
                ${mediaRender}
                <span class="news-date">${dataFormatada}</span>
                <h3>${item.titulo}</h3>
                <p>${item.texto}</p>
            </article>
        `;
    });
    container.innerHTML = html;
}

function renderizarPortalAgenda(eventos) {
    const container = document.getElementById('agenda-container');
    if (!container) return;

    if(eventos.length === 0) {
        container.innerHTML = '<p style="padding:20px; color:var(--texto-claro)">Nenhum evento agendado.</p>';
        return;
    }

    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    let html = '';

    eventos.forEach(item => {
        const partesData = item.data ? item.data.split('-') : [];
        let dia = "00";
        let mesExtenso = "S/M";
        if(partesData.length === 3) {
            dia = partesData[2];
            mesExtenso = meses[parseInt(partesData[1], 10) - 1] || "S/M";
        }

        html += `
            <div class="agenda-item">
                <div class="agenda-data">
                    ${dia} <span>${mesExtenso}</span>
                </div>
                <div>
                    <h3>${item.titulo}</h3>
                    <p>${item.descricao}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderizarPortalProjetos(projetos) {
    const container = document.getElementById('projetos-container');
    if (!container) return;

    let html = '';
    projetos.forEach(proj => {
        html += `
            <div class="card">
                <h3>${proj.icone} ${proj.titulo}</h3>
                <p>${proj.descricao}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderizarPortalMembros(membros) {
    const container = document.getElementById('diretoria-container');
    if (!container) return;

    let html = '';
    membros.forEach(item => {
        const avatarHtml = item.foto 
            ? `<img src="${item.foto}" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px auto; display: block; border: 3px solid var(--azul-principal);" alt="${item.nome}">`
            : `<div style="width: 110px; height: 110px; border-radius: 50%; background: #e2e8f0; margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--azul-principal); border: 3px solid var(--azul-principal);"><i class="fa-solid fa-user-graduate"></i></div>`;

        html += `
            <div class="card" style="text-align: center; padding: 25px 20px;">
                ${avatarHtml}
                <h3 style="font-size: 1.15rem; margin-bottom: 5px; color: var(--azul-escuro);">${item.nome}</h3>
                <span style="display: inline-block; background: var(--azul-principal); color: white; padding: 3px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; margin-bottom: 8px;">${item.cargo}</span>
                <p style="color: var(--texto-claro); font-size: 0.85rem;"><i class="fa-solid fa-graduation-cap"></i> ${item.serie}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderizarPortalMural(sugestoes) {
    const container = document.getElementById('mural-container');
    if (!container) return;

    const aprovados = CollegeFilter = hostelMessages = sugestoes.filter(s => s.status === 'Aprovado');

    if(aprovados.length === 0) {
        container.innerHTML = '<p style="color:var(--texto-claro)">O mural está aguardando novas mensagens aprovadas.</p>';
        return;
    }

    let html = '';
    aprovados.forEach(item => {
        html += `
            <div class="mensagem-mural">
                <p>${item.texto}</p>
                <span class="autor-mural">— ${item.autor || 'Estudante Anônimo'}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderizarPortalTransparencia(docs) {
    const container = document.getElementById('transparencia-container');
    if (!container) return;
    
    cacheTransparencia = docs; // Salva para o gatilho de download instantâneo

    let html = '';
    docs.forEach((item, index) => {
        const subtexto = item.nomeArquivo 
            ? `<span style="font-size: 0.75rem; color: var(--azul-principal); display:block; margin-top:5px;"><i class="fa-solid fa-paperclip"></i> ${item.nomeArquivo}</span>` 
            : '';

        html += `
            <a href="#" class="transparencia-card" onclick="baixarDocumentoTransparencia(${index}); return false;">
                <i class="fa-solid fa-file-pdf"></i>
                <div>
                    <h3>${item.titulo}</h3>
                    <p style="color: var(--texto-claro); font-size: 0.9rem;">${item.descricao}</p>
                    ${subtexto}
                </div>
            </a>
        `;
    });
    container.innerHTML = html;
}

function baixarDocumentoTransparencia(index) {
    const doc = cacheTransparencia[index];
    if (doc && doc.arquivo) {
        const linkBaixar = document.createElement('a');
        linkBaixar.href = doc.arquivo;
        linkBaixar.download = doc.nomeArquivo || `documento-${index}`;
        document.body.appendChild(linkBaixar);
        linkBaixar.click();
        document.body.removeChild(linkBaixar);
    } else {
        alert('Este documento não possui um arquivo real anexado.');
    }
}

function renderizarPortalRodape(dados) {
    if (!dados) return;

    const descEl = document.getElementById('footer-descricao');
    if(descEl) descEl.textContent = dados.descricao;

    const sociaisContainer = document.getElementById('footer-sociais');
    if(sociaisContainer) {
        sociaisContainer.innerHTML = `<a href="${dados.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`;
    }

    const contatoContainer = document.getElementById('footer-contato');
    if(contatoContainer) {
        contatoContainer.innerHTML = `
            <li><i class="fa-solid fa-envelope" style="margin-right: 8px;"></i> ${dados.email}</li>
            <li><i class="fa-solid fa-location-dot" style="margin-right: 8px;"></i> ${dados.localizacao}</li>
            <li><i class="fa-solid fa-clock" style="margin-right: 8px;"></i> Atendimento: ${dados.atendimento}</li>
        `;
    }
}

function configurarFormularioEstudante() {
    const form = document.getElementById('student-sugestao-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const autorInput = document.getElementById('student-nome').value.trim();
        const tipoSelect = document.getElementById('student-tipo').value;
        const msgTexto = document.getElementById('student-msg').value.trim();

        const novaSugestao = {
            texto: `[${tipoSelect}] ${msgTexto}`,
            autor: autorInput || "Anônimo",
            status: "Pendente"
        };

        db.ref('gre_sugestoes').once('value').then((snapshot) => {
            let bancoSugestoes = obterLista(snapshot.val());
            bancoSugestoes.push(novaSugestao);
            return db.ref('gre_sugestoes').set(bancoSugestoes);
        }).then(() => {
            alert("Obrigado! Sua mensagem foi enviada para aprovação da diretoria.");
            form.reset();
        }).catch(err => console.error("Erro ao salvar:", err));
    });
}

function configurarRolagemSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}
