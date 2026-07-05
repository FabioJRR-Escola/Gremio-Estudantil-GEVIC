if (sessionStorage.getItem('gre_admin_logado') !== 'true') {
    alert('Acesso negado! Por favor, faça login primeiro.');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarTodasAsListasAdmin();
    configurarFormularios();
    carregarDadosRodapeForm();
});

function fazerLogout() {
    if (confirm("Deseja realmente sair da conta administrativa?")) {
        sessionStorage.removeItem('gre_admin_logado');
        window.location.href = 'login.html';
    }
}

function renderizarTodasAsListasAdmin() {
    renderizarSugestoesAdmin();
    renderizarListaGenericaAdmin('gre_noticias', 'lista-noticias-admin', (item) => item.titulo);
    renderizarListaGenericaAdmin('gre_agenda', 'lista-agenda-admin', (item) => `${item.data} - ${item.titulo}`);
    renderizarListaGenericaAdmin('gre_projetos', 'lista-projetos-admin', (item) => `${item.icone} ${item.titulo}`);
    renderizarListaGenericaAdmin('gre_membros', 'lista-membros-admin', (item) => `${item.nome} (${item.cargo})`);
    renderizarListaGenericaAdmin('gre_transparencia', 'lista-transparencia-admin', (item) => item.titulo);
}

function renderizarListaGenericaAdmin(chaveBanco, idContainer, funcaoTexto) {
    const container = document.getElementById(idContainer);
    if (!container) return;

    const itens = JSON.parse(localStorage.getItem(chaveBanco)) || [];

    if (itens.length === 0) {
        container.innerHTML = '<p style="color: var(--texto-claro); font-style: italic; font-size:0.9rem;">Nenhum item publicado nesta categoria.</p>';
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
                    <button onclick="excluirItemPublicado('${chaveBanco}', ${index}, '${idContainer}')" class="btn btn-sm btn-perigo" style="padding: 4px 8px;"><i class="fa-solid fa-trash-can"></i> Excluir</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function excluirItemPublicado(chaveBanco, index, idContainer) {
    if (confirm("Tem certeza que deseja apagar permanentemente este item do portal?")) {
        let itens = JSON.parse(localStorage.getItem(chaveBanco)) || [];
        itens.splice(index, 1);
        localStorage.setItem(chaveBanco, JSON.stringify(itens));
        renderizarTodasAsListasAdmin();
    }
}

function renderizarSugestoesAdmin() {
    const listaContainer = document.getElementById('lista-sugestoes-pendentes');
    if (!listaContainer) return;

    const sugestoes = JSON.parse(localStorage.getItem('gre_sugestoes')) || [];
    const pendentes = sugestoes.map((s, index) => ({...s, originalIndex: index})).filter(s => s.status === 'Pendente');

    if (pendentes.length === 0) {
        listaContainer.innerHTML = '<p style="color: var(--texto-claro); font-style: italic;">Nenhuma nova mensagem pendente de análise.</p>';
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

function moderarMensagem(index, acao) {
    let sugestoes = JSON.parse(localStorage.getItem('gre_sugestoes')) || [];
    
    if (acao === 'Aprovado') {
        sugestoes[index].status = 'Aprovado';
        alert("Mensagem aprovada! Ela já está visível no Mural do Portal.");
    } else {
        sugestoes.splice(index, 1);
        alert("Mensagem descartada com sucesso.");
    }

    localStorage.setItem('gre_sugestoes', JSON.stringify(sugestoes));
    renderizarTodasAsListasAdmin();
}

function carregarDadosRodapeForm() {
    const rodape = JSON.parse(localStorage.getItem('gre_rodape'));
    if (!rodape) return;

    if(document.getElementById('rodape-descricao')) document.getElementById('rodape-descricao').value = rodape.descricao || '';
    if(document.getElementById('rodape-instagram')) document.getElementById('rodape-instagram').value = rodape.instagram || '';
    if(document.getElementById('rodape-email')) document.getElementById('rodape-email').value = rodape.email || '';
    if(document.getElementById('rodape-localizacao')) document.getElementById('rodape-localizacao').value = rodape.localizacao || '';
    if(document.getElementById('rodape-atendimento')) document.getElementById('rodape-atendimento').value = rodape.atendimento || '';
}

function restaurarIdentidadeVisualPadrao() {
    if (confirm("Deseja realmente redefinir a identidade visual do portal e voltar ao design padrão?")) {
        localStorage.removeItem('gre_visual');
        alert("Design padrão restaurado!");
        window.location.reload();
    }
}

function configurarFormularios() {
    
    // 1. Notícias
    document.getElementById('form-nova-noticia')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const titulo = document.getElementById('noticia-titulo').value.trim();
        const texto = document.getElementById('noticia-texto').value.trim();
        const fotoInput = document.getElementById('noticia-foto');
        const dataHoje = new Date().toISOString().split('T')[0];

        const salvar = (fotoBase64 = "") => {
            let dados = JSON.parse(localStorage.getItem('gre_noticias')) || [];
            dados.unshift({ titulo, texto, data: dataHoje, foto: fotoBase64 });
            localStorage.setItem('gre_noticias', JSON.stringify(dados));
            alert("Notícia publicada com sucesso!");
            this.reset();
            renderizarTodasAsListasAdmin();
        };

        if (fotoInput.files && fotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => salvar(ev.target.result);
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            salvar();
        }
    });

    // 2. Agenda
    document.getElementById('form-nova-agenda')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = document.getElementById('agenda-data').value;
        const titulo = document.getElementById('agenda-titulo').value.trim();
        const descricao = document.getElementById('agenda-descricao').value.trim();

        let dados = JSON.parse(localStorage.getItem('gre_agenda')) || [];
        dados.unshift({ data, titulo, descricao });
        localStorage.setItem('gre_agenda', JSON.stringify(dados));

        alert("Evento adicionado à agenda com sucesso!");
        this.reset();
        renderizarTodasAsListasAdmin();
    });

    // 3. Projetos
    document.getElementById('form-novo-projeto')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const icone = document.getElementById('projeto-icone').value;
        const titulo = document.getElementById('projeto-titulo').value.trim();
        const descricao = document.getElementById('projeto-descricao').value.trim();

        let dados = JSON.parse(localStorage.getItem('gre_projetos')) || [];
        dados.push({ icone, titulo, descricao });
        localStorage.setItem('gre_projetos', JSON.stringify(dados));

        alert("Novo projeto cadastrado com sucesso!");
        this.reset();
        renderizarTodasAsListasAdmin();
    });

    // Membros da Diretoria
    document.getElementById('form-novo-membro')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('membro-nome').value.trim();
        const cargo = document.getElementById('membro-cargo').value.trim();
        const serie = document.getElementById('membro-serie').value.trim();
        const fotoInput = document.getElementById('membro-foto');

        const salvar = (fotoBase64 = "") => {
            let dados = JSON.parse(localStorage.getItem('gre_membros')) || [];
            dados.push({ nome, cargo, serie, foto: fotoBase64 });
            localStorage.setItem('gre_membros', JSON.stringify(dados));

            alert("Novo integrante da diretoria salvo com sucesso!");
            this.reset();
            renderizarTodasAsListasAdmin();
        };

        if (fotoInput.files && fotoInput.files[0]) {
            const file = fotoInput.files[0];
            if (file.size > 1.5 * 1024 * 1024) {
                alert("A imagem de perfil é pesada! Escolha uma menor ou comprimida (Até 1.5MB).");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => salvar(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            salvar();
        }
    });

    // NOVO: Processamento do Form da Identidade Visual (Logo + Banner)
    document.getElementById('form-identidade-visual')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const logoInput = document.getElementById('visual-logo');
        const bannerInput = document.getElementById('visual-banner');

        let visualAtual = JSON.parse(localStorage.getItem('gre_visual')) || { logo: "", banner: "" };

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

        Promise.all([processarLogo(), processarBanner()]).then(() => {
            localStorage.setItem('gre_visual', JSON.stringify(visualAtual));
            alert("Identidade visual sincronizada! As alterações já estão aplicadas na Home.");
            this.reset();
        });
    });

    // 4. Transparência
    document.getElementById('form-nova-transparencia')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const titulo = document.getElementById('trans-titulo').value.trim();
        const descricao = document.getElementById('trans-descricao').value.trim();
        const arquivoInput = document.getElementById('trans-arquivo');

        const salvar = (arquivoBase64 = "", nomeArquivo = "") => {
            let dados = JSON.parse(localStorage.getItem('gre_transparencia')) || [];
            dados.push({ titulo, descricao, arquivo: arquivoBase64, nomeArquivo });
            localStorage.setItem('gre_transparencia', JSON.stringify(dados));

            alert("Documento de transparência publicado com sucesso!");
            this.reset();
            renderizarTodasAsListasAdmin();
        };

        if (arquivoInput.files && arquivoInput.files[0]) {
            const file = arquivoInput.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert("O arquivo é muito grande! Por favor, anexe um PDF ou imagem de até 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => salvar(ev.target.result, file.name);
            reader.readAsDataURL(file);
        } else {
            salvar();
        }
    });

    // 6. Formulário do Rodapé
    document.getElementById('form-config-rodape')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const novoRodape = {
            descricao: document.getElementById('rodape-descricao').value.trim(),
            instagram: document.getElementById('rodape-instagram').value.trim() || '#',
            email: document.getElementById('rodape-email').value.trim(),
            localizacao: document.getElementById('rodape-localizacao').value.trim(),
            atendimento: document.getElementById('rodape-atendimento').value.trim()
        };

        localStorage.setItem('gre_rodape', JSON.stringify(novoRodape));
        alert("Configurações do rodapé updated!");
    });
}
