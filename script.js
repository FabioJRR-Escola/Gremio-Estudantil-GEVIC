// =========================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS NA NUVEM - OFICIAL
// =========================================================================
const BANCO_NUVEM_URL = "https://visao-coletiva-default-rtdb.firebaseio.com";

document.addEventListener('DOMContentLoaded', async () => {
    // Garante que a estrutura padrão existe antes de ligar o ouvinte
    await verificarEInicializarBancoNuvem();

    // Liga a conexão em tempo real (substitui o carregamento estático inicial)
    ativarOuvinteTempoReal();

    configurarFormularioEstudante();
    configurarRolagemSuave();
});

// ESCUTA A NUVEM EM TEMPO REAL (MÁGICA DA ATUALIZAÇÃO INSTANTÂNEA)
function ativarOuvinteTempoReal() {
    // Abre um canal de comunicação contínuo com o Firebase
    const fonteEventos = new EventSource(`${BANCO_NUVEM_URL}/.json`);

    fonteEventos.addEventListener('put', async (evento) => {
        const dadosAlterados = JSON.parse(evento.data);
        const caminho = dadosAlterados.path;

        // O Firebase envia '/' no primeiro carregamento ou quando o banco muda todo.
        // Se mudar apenas uma tabela específica (ex: /gre_noticias), atualiza só ela instantaneamente.
        if (caminho === '/' || caminho === '/gre_visual') await renderizarIdentidadeVisual();
        if (caminho === '/' || caminho === '/gre_noticias') await renderizarPortalNoticias();
        if (caminho === '/' || caminho === '/gre_agenda') await renderizarPortalAgenda();
        if (caminho === '/' || caminho === '/gre_projetos') await renderizarPortalProjetos();
        if (caminho === '/' || caminho === '/gre_membros') await renderizarPortalMembros();
        if (caminho === '/' || caminho === '/gre_sugestoes') await renderizarPortalMural();
        if (caminho === '/' || caminho === '/gre_transparencia') await renderizarPortalTransparencia();
        if (caminho === '/' || caminho === '/gre_rodape') await renderizarPortalRodape();
    });

    fonteEventos.onerror = (erro) => {
        console.error("Erro na conexão em tempo real, tentando reconectar...", erro);
    };
}

// FUNÇÕES AUXILIARES DE CONEXÃO
async function buscarDadosNuvem(chave) {
    try {
        const resposta = await fetch(`${BANCO_NUVEM_URL}/${chave}.json`);
        return await resposta.json();
    } catch (erro) {
        console.error(`Erro ao buscar ${chave}:`, erro);
        return null;
    }
}

async function salvarDadosNuvem(chave, dados) {
    try {
        await fetch(`${BANCO_NUVEM_URL}/${chave}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
    } catch (erro) {
        console.error(`Erro ao salvar ${chave}:`, erro);
    }
}

async function verificarEInicializarBancoNuvem() {
    const noticias = await buscarDadosNuvem('gre_noticias');
    if (!noticias) {
        const dadosPadrao = [
            { titulo: "Boas-vindas ao novo Portal do Grêmio!", data: "2026-02-15", texto: "Agora nosso portal está 100% online e sincronizado em tempo real na nuvem.", foto: "" }
        ];
        await salvarDadosNuvem('gre_noticias', dadosPadrao);
    }
    const agenda = await buscarDadosNuvem('gre_agenda');
    if (!agenda) {
        await salvarDadosNuvem('gre_agenda', [{ data: "2026-04-07", titulo: "Dia D de Combate ao Bullying", descricao: "Ações de conscientização nas salas." }]);
    }
    const projetos = await buscarDadosNuvem('gre_projetos');
    if (!projetos) {
        await salvarDadosNuvem('gre_projetos', [{ icone: "📢", titulo: "Voz Ativa", descricao: "Assembleias regulares com líderes de turma." }]);
    }
    const membros = await buscarDadosNuvem('gre_membros');
    if (!membros) {
        await salvarDadosNuvem('gre_membros', [{ nome: "Diretoria Visão Coletiva", cargo: "Gestão Atual", serie: "Ano Letivo 2026", foto: "" }]);
    }
    const sugestoes = await buscarDadosNuvem('gre_sugestoes');
    if (!sugestoes) {
        await salvarDadosNuvem('gre_sugestoes', [{ texto: "Portal oficial lançado com sucesso!", autor: "Grêmio Estudantil", status: "Aprovado" }]);
    }
    const transparencia = await buscarDadosNuvem('gre_transparencia');
    if (!transparencia) {
        await salvarDadosNuvem('gre_transparencia', [{ titulo: "Estatuto Oficial", descricao: "Regimento interno do Grêmio.", arquivo: "", nomeArquivo: "" }]);
    }
    const rodape = await buscarDadosNuvem('gre_rodape');
    if (!rodape) {
        const rodapePadrao = {
            descricao: "O Portal do Grêmio Estudantil Visão Coletiva é o canal oficial de transparência e união dos estudantes.",
            instagram: "#",
            email: "contato@visaocoletiva.edu.br",
            localizacao: "Sala do Grêmio",
            atendimento: "Nos intervalos das aulas."
        };
        await salvarDadosNuvem('gre_rodape', rodapePadrao);
    }
}

async function renderizarIdentidadeVisual() {
    const visual = await buscarDadosNuvem('gre_visual');
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

async function renderizarPortalNoticias() {
    const noticias = await buscarDadosNuvem('gre_noticias') || [];
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

async function renderizarPortalAgenda() {
    const eventos = await buscarDadosNuvem('gre_agenda') || [];
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

async function renderizarPortalProjetos() {
    const projetos = await buscarDadosNuvem('gre_projetos') || [];
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

async function renderizarPortalMembros() {
    const membros = await buscarDadosNuvem('gre_membros') || [];
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

async function renderizarPortalMural() {
    const sugestoes = await buscarDadosNuvem('gre_sugestoes') || [];
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

async function renderizarPortalTransparencia() {
    const docs = await buscarDadosNuvem('gre_transparencia') || [];
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

async function baixarDocumentoTransparencia(index) {
    const docs = await buscarDadosNuvem('gre_transparencia') || [];
    const doc = docs[index];
    
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

async function renderizarPortalRodape() {
    const dados = await buscarDadosNuvem('gre_rodape');
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const autorInput = document.getElementById('student-nome').value.trim();
        const tipoSelect = document.getElementById('student-tipo').value;
        const msgTexto = document.getElementById('student-msg').value.trim();

        const novaSugestao = {
            texto: `[${tipoSelect}] ${msgTexto}`,
            autor: autorInput || "Anônimo",
            status: "Pendente"
        };

        let bancoSugestoes = await buscarDadosNuvem('gre_sugestoes') || [];
        bancoSugestoes.push(novaSugestao);
        await salvarDadosNuvem('gre_sugestoes', bancoSugestoes);

        alert("Obrigado! Sua mensagem foi enviada para aprovação da diretoria.");
        form.reset();
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
