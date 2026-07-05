document.addEventListener('DOMContentLoaded', () => {
    verificarEInicializarBanco();

    renderizarPortalNoticias();
    renderizarPortalAgenda();
    renderizarPortalProjetos();
    renderizarPortalMembros();
    renderizarPortalMural();
    renderizarPortalTransparencia();
    renderizarPortalRodape();

    configurarFormularioEstudante();
    configurarRolagemSuave();
});

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
    if (!localStorage.getItem('gre_membros')) {
        const membrosPadrao = [
            { nome: "Ana Clara Silva", cargo: "Presidente", serie: "3º Ano A", foto: "" },
            { nome: "Lucas Andrade", cargo: "Vice-Presidente", serie: "2º Ano B", foto: "" },
            { nome: "Beatriz Souza", cargo: "Secretária Geral", serie: "3º Ano C", foto: "" },
            { nome: "Mateus Rocha", cargo: "Diretor de Esportes", serie: "1º Ano Técnico", foto: "" }
        ];
        localStorage.setItem('gre_membros', JSON.stringify(membrosPadrao));
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
            { titulo: "Estatuto do Grêmio", descricao: "Estatuto oficial assinado em vigência.", arquivo: "", nomeArquivo: "" },
            { titulo: "Prestação de Contas", descricao: "Balanço financeiro detalhado deste ano.", arquivo: "", nomeArquivo: "" }
        ];
        localStorage.setItem('gre_transparencia', JSON.stringify(transPadrao));
    }
    // Removido TikTok e WhatsApp dos padrões
    if (!localStorage.getItem('gre_rodape')) {
        const rodapePadrao = {
            descricao: "O Portal do Grêmio Estudantil é o principal canal de comunicação, participação e transparência para todos os estudantes.",
            instagram: "#",
            email: "contato@visaocoletiva.edu.br",
            localizacao: "Sala do Grêmio (Pátio Principal)",
            atendimento: "Seg a Sex, nos intervalos."
        };
        localStorage.setItem('gre_rodape', JSON.stringify(rodapePadrao));
    }
}

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
        const partesData = item.data.split('-');
        const dataFormatada = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : item.data;
        
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
        const partesData = item.data.split('-');
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

function renderizarPortalProjetos() {
    const projetos = JSON.parse(localStorage.getItem('gre_projetos')) || [];
    const container = document.getElementById('projetos-container');
    if (!container) return;

    let html = '';
    for(let i=0; i < projetos.length; i++){
        html += `
            <div class="card">
                <h3>${projetos[i].icone} ${projetos[i].titulo}</h3>
                <p>${projetos[i].descricao}</p>
            </div>
        `;
    }
    container.innerHTML = html;
}

function renderizarPortalMembros() {
    const membros = JSON.parse(localStorage.getItem('gre_membros')) || [];
    const container = document.getElementById('diretoria-container');
    if (!container) return;

    if(membros.length === 0) {
        container.innerHTML = '<p style="color:var(--texto-claro); grid-column: 1/-1; text-align:center;">Informações da gestão em processo de atualização.</p>';
        return;
    }

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

function renderizarPortalTransparencia() {
    const docs = JSON.parse(localStorage.getItem('gre_transparencia')) || [];
    const container = document.getElementById('transparencia-container');
    if (!container) return;

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
    const docs = JSON.parse(localStorage.getItem('gre_transparencia')) || [];
    const doc = docs[index];
    
    if (doc && doc.arquivo) {
        const linkBaixar = document.createElement('a');
        linkBaixar.href = doc.arquivo;
        linkBaixar.download = doc.nomeArquivo || `documento-${index}`;
        document.body.appendChild(linkBaixar);
        linkBaixar.click();
        document.body.removeChild(linkBaixar);
    } else {
        alert('Este é um documento padrão de teste e não possui um arquivo real anexado.');
    }
}

// Apenas o link do Instagram é impresso agora
function renderizarPortalRodape() {
    const dados = JSON.parse(localStorage.getItem('gre_rodape'));
    if (!dados) return;

    const descEl = document.getElementById('footer-descricao');
    if(descEl) descEl.textContent = dados.descricao;

    const sociaisContainer = document.getElementById('footer-sociais');
    if(sociaisContainer) {
        sociaisContainer.innerHTML = `
            <a href="${dados.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>
        `;
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

        let bancoSugestoes = JSON.parse(localStorage.getItem('gre_sugestoes')) || [];
        bancoSugestoes.push(novaSugestao);
        localStorage.setItem('gre_sugestoes', JSON.stringify(bancoSugestoes));

        alert("Obrigado! Sua sugestão foi encaminhada com sucesso para análise da diretoria do Grêmio.");
        form.reset();
    });
}

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
