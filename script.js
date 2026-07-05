document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a persistência local padrão se estiver acessando a primeira vez
    verificarEInicializarBanco();

    // Renderiza os componentes dinamicamente a partir dos dados gravados
    renderizarPortalNoticias();
    renderizarPortalAgenda();
    renderizarPortalProjetos();
    renderizarPortalMural();
    renderizarPortalTransparencia();

    // Configura o formulário de envio de sugestões dos alunos
    configurarFormularioEstudante();

    // Configura efeito suave nas âncoras da página
    configurarRolagemSuave();
});

// GARANTE QUE EXISTAM DADOS PARA IMPRIMIR EM CASO DE PRIMEIRA VISITA
function verificarEInicializarBanco() {
    if (!localStorage.getItem('gre_noticias')) {
        const dadosPadrao = [
            { titulo: "Festa Julina arrecada mais de R$ 5.000", data: "2026-07-15", texto: "O evento foi um sucesso de público estudantil.", foto: "" },
            { titulo: "Inscrições para Olimpíada de Matemática", data: "2026-07-10", texto: "Participe dos grupos de estudo organizados pelo Grêmio.", foto: "" }
        ];
        localStorage.setItem('gre_noticias', JSON.stringify(dadosPadrao));
    }
    if (!localStorage.getItem('gre_agenda')) {
        const agendaPadrao = [
            { data: "2026-07-20", titulo: "Reunião Geral de Representantes", descricao: "Pauta sobre eventos do segundo semestre." }
        ];
        localStorage.setItem('gre_agenda', JSON.stringify(agendaPadrao));
    }
    if (!localStorage.getItem('gre_projetos')) {
        const projetosPadrao = [
            { icone: "📚", titulo: "Biblioteca Viva", descricao: "Clubes de leitura semanais e novos acervos." },
            { icone: "🌱", titulo: "Escola Sustentável", descricao: "Coleta seletiva e horta orgânica ativa." }
        ];
        localStorage.setItem('gre_projetos', JSON.stringify(projetosPadrao));
    }
    if (!localStorage.getItem('gre_sugestoes')) {
        const muralPadrao = [
            { texto: "Parabéns pela organização da Festa Julina!", autor: "Mariana T., 3ºB", status: "Aprovado" },
            { texto: "Gostaria de mais bancos no pátio.", autor: "João P., 1ºC", status: "Aprovado" }
        ];
        localStorage.setItem('gre_sugestoes', JSON.stringify(muralPadrao));
    }
    if (!localStorage.getItem('gre_transparencia')) {
        const transPadrao = [
            { titulo: "Estatuto do Grêmio", descricao: "Estatuto oficial assinado em vigência." },
            { titulo: "Prestação de Contas", descricao: "Balanço financeiro detalhado deste ano." }
        ];
        localStorage.setItem('gre_transparencia', JSON.stringify(transPadrao));
    }
}

// 1. RENDERIZAÇÃO DE NOTÍCIAS (Distingue se tem foto Base64 ou se usa o ícone padrão)
function renderizarPortalNoticias() {
    const noticias = JSON.parse(localStorage.getItem('gre_noticias')) || [];
    const container = document.getElementById('noticias-container');
    if (!container) return;

    if(noticias.length === 0) {
        container.innerHTML = '<p style="color:var(--texto-claro)">Nenhuma notícia publicada.</p>';
        return;
    }

    let html = '';
    noticias.forEach(item => {
        // Formata data padrão ISO (AAAA-MM-DD) para formato legível (DD/MM/AAAA)
        const partesData = item.data.split('-');
        const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : item.data;
        
        // Verifica se há foto enviada via admin
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

// 2. RENDERIZAÇÃO DA AGENDA
function renderizarPortalAgenda() {
    const eventos = JSON.parse(localStorage.getItem('gre_agenda')) || [];
    const container = document.getElementById('agenda-container');
    if (!container) return;

    if(eventos.length === 0) {
        container.innerHTML = '<p style="padding:20px; color:var(--texto-claro)">Nenhum evento agendado.</p>';
        return;
    }

    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    let html = '';

    eventos.forEach(item => {
        const partesData = item.data.split('-'); // [AAAA, MM, DD]
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

// 3. RENDERIZAÇÃO DOS PROJETOS
function renderizarPortalProjetos() {
    const projetos = JSON.parse(localStorage.getItem('gre_projetos')) || [];
    const container = document.getElementById('projetos-container');
    if (!container) return;

    let html = '';
    projetos.forEach(item => {
        html += `
            <div class="card">
                <h3>${item.icone} ${item.titulo}</h3>
                <p>${item.descricao}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// 4. RENDERIZAÇÃO DO MURAL (Mostra apenas os itens com status 'Aprovado')
function renderizarPortalMural() {
    const sugestoes = JSON.parse(localStorage.getItem('gre_sugestoes')) || [];
    const container = document.getElementById('mural-container');
    if (!container) return;

    const aprovados = sugestoes.filter(s => s.status === 'Aprovado');

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

// 5. RENDERIZAÇÃO DA TRANSPARÊNCIA
function renderizarPortalTransparencia() {
    const docs = JSON.parse(localStorage.getItem('gre_transparencia')) || [];
    const container = document.getElementById('transparencia-container');
    if (!container) return;

    let html = '';
    docs.forEach(item => {
        html += `
            <a href="#" class="transparencia-card" onclick="alert('Fazendo download fictício do documento: ${item.titulo}'); return false;">
                <i class="fa-solid fa-file-pdf"></i>
                <div>
                    <h3>${item.titulo}</h3>
                    <p style="color: var(--texto-claro); font-size: 0.9rem;">${item.descricao}</p>
                </div>
            </a>
        `;
    });
    container.innerHTML = html;
}

// CAPTURA A SUGESTÃO DO ESTUDANTE E DEIXA "PENDENTE" PARA O ADMIN APROVAR
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
            status: "Pendente" // Enviado para aprovação do Presidente
        };

        let bancoSugestoes = JSON.parse(localStorage.getItem('gre_sugestoes')) || [];
        bancoSugestoes.push(novaSugestao);
        localStorage.setItem('gre_sugestoes', JSON.stringify(bancoSugestoes));

        alert("Obrigado! Sua sugestão foi encaminhada com sucesso para análise da diretoria do Grêmio.");
        form.reset();
    });
}

// INTERATIVIDADE DA SEÇÃO DE CATEGORIAS (Foca no formulário mudando o tipo)
function focarFormulario(tipo) {
    const select = document.getElementById('student-tipo');
    const textarea = document.getElementById('student-msg');
    if(select && textarea) {
        select.value = tipo === 'Enquete' ? 'Sugestão' : tipo;
        textarea.focus();
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function configurarRolagemSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}
