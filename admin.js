// =========================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS NA NUVEM - OFICIAL
// =========================================================================
const BANCO_NUVEM_URL = "https://visao-coletiva-default-rtdb.firebaseio.com";

if (sessionStorage.getItem('gre_admin_logado') !== 'true') {
    alert('Acesso negado! Por favor, faça login primeiro.');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    await renderizarTodasAsListasAdmin();
    configurarFormularios();
    await carregarDadosRodapeForm();
});

function fazerLogout() {
    if (confirm("Deseja realmente sair da conta administrativa?")) {
        sessionStorage.removeItem('gre_admin_logado');
        window.location.href = 'login.html';
    }
}

// FUNÇÕES DE COMUNICAÇÃO HTTP COM FIREBASE
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

async function renderizarTodasAsListasAdmin() {
    await renderizarSugestoesAdmin();
    await renderizarListaGenericaAdmin('gre_noticias', 'lista-noticias-admin', (item) => item.titulo);
    await renderizarListaGenericaAdmin('gre_agenda', 'lista-agenda-admin', (item) => `${item.data} - ${item.titulo}`);
    await renderizarListaGenericaAdmin('gre_projetos', 'lista-projetos-admin', (item) => `${item.icone} ${item.titulo}`);
    await renderizarListaGenericaAdmin('gre_membros', 'lista-membros-admin', (item) => `${item.nome} (${item.cargo})`);
    await renderizarListaGenericaAdmin('gre_transparencia', 'lista-transparencia-admin', (item) => item.titulo);
}

async function renderizarListaGenericaAdmin(chaveBanco, idContainer, funcaoTexto) {
    const container = document.getElementById(idContainer);
    if (!container) return;

    const itens = await buscarDadosNuvem(chaveBanco) || [];

    if (itens.length === 0) {
        container.innerHTML = '<p style="color: var(--texto-claro); font-style: italic; font-size:0.9rem;">Nenhum item publicado.</p>';
        return;
    }

    let html = '';
    itens.forEach((item, index) => {
        html += `
            <div class="item-moderacao" style="padding: 10px 15px; margin-bottom: 6px;">
                <div class="info">
                    <span style="font-size: 0.9rem; font-weight:500;">${funcaoTexto(item)}</span>
                </div>
                <div class="acoes">
                    <button onclick="excluirItemPublicado('${chaveBanco}', ${index})" class="btn btn-sm btn-perigo" style="padding: 4px 8px;"><i class="fa-solid fa-trash-can"></i> Excluir</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

async function excluirItemPublicado(chaveBanco, index) {
    if (confirm("Tem certeza que deseja apagar permanentemente este item do portal?")) {
        let itens = await buscarDadosNuvem(chaveBanco) || [];
        itens.splice(index, 1);
        await salvarDadosNuvem(chaveBanco, itens);
        await renderizarTodasAsListasAdmin();
    }
}

async function renderizarSugestoesAdmin() {
    const listaContainer = document.getElementById('lista-sugestoes-pendentes');
    if (!listaContainer) return;

    const sugestoes = await buscarDadosNuvem('gre_sugestoes') || [];
    const pendentes = sugestoes.map((s, index) => ({...s, originalIndex: index})).filter(s => s.status === 'Pendente');

    if (pendentes.length === 0) {
        listaContainer.innerHTML = '<p style="color: var(--texto-claro); font-style: italic;">Nenhuma nova mensagem na Ouvidoria.</p>';
        return;
    }

    let html = '';
    pendentes.forEach(item => {
        html += `
            <div class="item-moderacao">
                <div class="info">
                    <strong style="color: var(--azul-escuro);">${item.autor}</strong>
                    <p style="margin-top: 4px; font-size: 0.95rem; background: #fff; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">${item.texto}</p>
                </div>
                <div class="acoes">
                    <button onclick="moderarMensagem(${item.originalIndex}, 'Aprovado')" class="btn btn-sm btn-sucesso"><i class="fa-solid fa-check"></i> Aprovar</button>
                    <button onclick="moderarMensagem(${item.originalIndex}, 'Recusado')" class="btn btn-sm btn-perigo"><i class="fa-solid fa-trash"></i> Recusar</button>
                </div>
            </div>
        `;
    });
    listaContainer.innerHTML = html;
}

async function moderarMensagem(index, acao) {
    let sugestoes = await buscarDadosNuvem('gre_sugestoes') || [];
    
    if (acao === 'Aprovado') {
        sugestoes[index].status = 'Aprovado';
        alert("Mensagem aprovada e enviada ao Mural do estudante!");
    } else {
        sugestoes.splice(index, 1);
        alert("Mensagem recusada com sucesso.");
    }

    await salvarDadosNuvem('gre_sugestoes', sugestoes);
    await renderizarTodasAsListasAdmin();
}

async function carregarDadosRodapeForm() {
    const rodape = await buscarDadosNuvem('gre_rodape');
    if (!rodape) return;

    if(document.getElementById('rodape-descricao')) document.getElementById('rodape-descricao').value = rodape.descricao || '';
    if(document.getElementById('rodape-instagram')) document.getElementById('rodape-instagram').value = rodape.instagram || '';
    if(document.getElementById('rodape-email')) document.getElementById('rodape-email').value = rodape.email || '';
    if(document.getElementById('rodape-localizacao')) document.getElementById('rodape-localizacao').value = rodape.localizacao || '';
    if(document.getElementById('rodape-atendimento')) document.getElementById('rodape-atendimento').value = rodape.atendimento || '';
}

async function restaurarIdentidadeVisualPadrao() {
    if (confirm("Deseja redefinir a identidade visual do portal e voltar ao design padrão?")) {
        await fetch(`${BANCO_NUVEM_URL}/gre_visual.json`, { method: 'DELETE' });
        alert("Design padrão restaurado!");
        window.location.reload();
    }
}

function configurarFormularios() {
    
    // Form Notícias
    document.getElementById('form-nova-noticia')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const titulo = document.getElementById('noticia-titulo').value.trim();
        const texto = document.getElementById('noticia-texto').value.trim();
        const fotoInput = document.getElementById('noticia-foto');
        const dataHoje = new Date().toISOString().split('T')[0];

        const salvar = async (fotoBase64 = "") => {
            let dados = await buscarDadosNuvem('gre_noticias') || [];
            dados.unshift({ titulo, texto, data: dataHoje, foto: fotoBase64 });
            await salvarDadosNuvem('gre_noticias', dados);
            alert("Notícia publicada na nuvem!");
            this.reset();
            await renderizarTodasAsListasAdmin();
        };

        if (fotoInput.files && fotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = async (ev) => await salvar(ev.target.result);
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            await salvar();
        }
    });

    // Form Agenda
    document.getElementById('form-nova-agenda')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = document.getElementById('agenda-data').value;
        const titulo = document.getElementById('agenda-titulo').value.trim();
        const descricao = document.getElementById('agenda-descricao').value.trim();

        let dados = await buscarDadosNuvem('gre_agenda') || [];
        dados.unshift({ data, titulo, descricao });
        await salvarDadosNuvem('gre_agenda', dados);

        alert("Evento adicionado à agenda global!");
        this.reset();
        await renderizarTodasAsListasAdmin();
    });

    // Form Projetos
    document.getElementById('form-novo-projeto')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const icone = document.getElementById('projeto-icone').value;
        const titulo = document.getElementById('projeto-titulo').value.trim();
        const descricao = document.getElementById('projeto-descricao').value.trim();

        let dados = await buscarDadosNuvem('gre_projetos') || [];
        dados.push({ icone, titulo, descricao });
        await salvarDadosNuvem('gre_projetos', dados);

        alert("Novo projeto cadastrado na nuvem!");
        this.reset();
        await renderizarTodasAsListasAdmin();
    });

    // Form Integrantes Diretoria
    document.getElementById('form-novo-membro')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nome = document.getElementById('membro-nome').value.trim();
        const cargo = document.getElementById('membro-cargo').value.trim();
        const serie = document.getElementById('membro-serie').value.trim();
        const fotoInput = document.getElementById('membro-foto');

        const salvar = async (fotoBase64 = "") => {
            let dados = await buscarDadosNuvem('gre_membros') || [];
            dados.push({ nome, cargo, serie, foto: fotoBase64 });
            await salvarDadosNuvem('gre_membros', dados);

            alert("Novo integrante salvo globalmente!");
            this.reset();
            await renderizarTodasAsListasAdmin();
        };

        if (fotoInput.files && fotoInput.files[0]) {
            const file = fotoInput.files[0];
            if (file.size > 1.2 * 1024 * 1024) {
                alert("A imagem de perfil ultrapassa 1.2MB. Escolha uma foto menor.");
                return;
            }
            const reader = new FileReader();
            reader.onload = async (ev) => await salvar(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            await salvar();
        }
    });

    // Form Identidade Visual (Logo e Banner)
    document.getElementById('form-identidade-visual')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const logoInput = document.getElementById('visual-logo');
        const bannerInput = document.getElementById('visual-banner');

        let visualAtual = await buscarDadosNuvem('gre_visual') || { logo: "", banner: "" };

        const processarLogo = () => {
            return new Promise((resolve) => {
                if (logoInput.files && logoInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { visualAtual.logo = ev.target.result; resolve(); };
                    reader.readAsDataURL(logoInput.files[0]);
                } else { resolve(); }
            });
        };

        const processarBanner = () => {
            return new Promise((resolve) => {
                if (bannerInput.files && bannerInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { visualAtual.banner = ev.target.result; resolve(); };
                    reader.readAsDataURL(bannerInput.files[0]);
                } else { resolve(); }
            });
        };

        Promise.all([processarLogo(), processarBanner()]).then(async () => {
            await salvarDadosNuvem('gre_visual', visualAtual);
            alert("Identidade visual sincronizada na nuvem para todos!");
            this.reset();
        });
    });

    // Form Documentos Transparência
    document.getElementById('form-nova-transparencia')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const titulo = document.getElementById('trans-titulo').value.trim();
        const descricao = document.getElementById('trans-descricao').value.trim();
        const arquivoInput = document.getElementById('trans-arquivo');

        const salvar = async (arquivoBase64 = "", nomeArquivo = "") => {
            let dados = await buscarDadosNuvem('gre_transparencia') || [];
            dados.push({ titulo, descricao, arquivo: arquivoBase64, nomeArquivo });
            await salvarDadosNuvem('gre_transparencia', dados);

            alert("Documento de transparência publicado na nuvem!");
            this.reset();
            await renderizarTodasAsListasAdmin();
        };

        if (arquivoInput.files && arquivoInput.files[0]) {
            const file = arquivoInput.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert("O arquivo é muito grande! Máximo permitido de até 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = async (ev) => await salvar(ev.target.result, file.name);
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, selecione um arquivo.");
        }
    });

    // Form Rodapé e Configurações
    document.getElementById('form-config-rodape')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        const novoRodape = {
            descricao: document.getElementById('rodape-descricao').value.trim(),
            instagram: document.getElementById('rodape-instagram').value.trim() || '#',
            email: document.getElementById('rodape-email').value.trim(),
            localizacao: document.getElementById('rodape-localizacao').value.trim(),
            atendimento: document.getElementById('rodape-atendimento').value.trim()
        };

        await salvarDadosNuvem('gre_rodape', novoRodape);
        alert("Configurações do rodapé gravadas na nuvem!");
    });
}
