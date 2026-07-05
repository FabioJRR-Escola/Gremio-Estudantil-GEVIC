document.addEventListener('DOMContentLoaded', () => {
    verificarEInicializarBanco();

    renderizarPortalNoticias();
    renderizarPortalAgenda();
    renderizarPortalProjetos();
    renderizarPortalMural();
    renderizarPortalTransparencia();
    renderizarPortalRodape(); // Chama a nova função do rodapé

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
    // NOVO: Inicializador das configurações institucionais do rodapé
    if (!localStorage.getItem('gre_rodape')) {
        const rodapePadrao = {
            descricao: "O Portal do Grêmio Estudantil é o principal canal de comunicação, participação e transparência para todos os estudantes.",
            instagram: "#",
            tiktok: "#",
            whatsapp: "#",
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

// NOVO: Renderizador das Configurações Dinâmicas do Rodapé na Home
function renderizarPortalRodape() {
    const dados = JSON.parse(localStorage.getItem('gre_rodape'));
    if (!dados) return;

    // 1. Atualizar descrição descritiva
    const descEl = document.getElementById('footer-descricao');
    if(descEl) descEl.textContent = dados.descricao;

    // 2. Atualizar redes sociais
    const sociaisContainer = document.getElementById('footer-sociais');
    if(sociaisContainer) {
        sociaisContainer.innerHTML = `
            <a href="${dados.instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>
            <a href="${dados.tiktok}" target="_blank"><i class="fa-brands fa-tiktok"></i></a>
            <a href="${dados.whatsapp}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
        `;
    }

    // 3. Atualizar Contato e Informações de Atendimento
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
