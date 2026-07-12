// =========================================================================
// CONFIGURAÇÃO OFICIAL DO BANCO DE DADOS (FIREBASE SDK)
// =========================================================================
const firebaseConfig = {
    databaseURL: "https://visao-coletiva-default-rtdb.firebaseio.com"
};

if (sessionStorage.getItem('gre_admin_logado') !== 'true') {
    alert('Acesso negado! Por favor, faça login primeiro.');
    window.location.href = 'login.html';
}

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados iniciais do rodapé nos inputs apenas uma vez para não atrapalhar a digitação
    db.ref('gre_rodape').once('value', snapshot => {
        carregarDadosRodapeForm(snapshot.val());
    });

    // ESCUTA EM TEMPO REAL COMPLETA PARA PAINEL ADMIN
    db.ref().on('value', (snapshot) => {
        const dados = snapshot.val() || {};
        
        renderizarSugestoesAdmin(obterLista(dados.gre_sugestoes));
        renderizarListaGenericaAdmin('gre_noticias', 'lista-noticias-admin', obterLista(dados.gre_noticias), (item) => item.titulo);
        renderizarListaGenericaAdmin('gre_agenda', 'lista-agenda-admin', obterLista(dados.gre_agenda), (item) => `${item.data} - ${item.titulo}`);
        renderizarListaGenericaAdmin('gre_projetos', 'lista-projetos-admin', obterLista(dados.gre_projetos), (item) => `${item.icone} ${item.titulo}`);
        renderizarListaGenericaAdmin('gre_membros', 'lista-membros-admin', obterLista(dados.gre_membros), (item) => `${item.nome} (${item.cargo})`);
        renderizarListaGenericaAdmin('gre_transparencia', 'lista-transparencia-admin', obterLista(dados.gre_transparencia), (item) => item.titulo);
    });
    
    configurarFormularios();
});

function obterLista(dados) {
    if (!dados) return [];
    return Array.isArray(dados) ? dados : Object.values(dados);
}

function fazerLogout() {
    if (confirm("Deseja realmente sair da conta administrativa?")) {
        sessionStorage.removeItem('gre_admin_logado');
        window.location.href = 'login.html';
    }
}

function renderizarListaGenericaAdmin(chaveBanco, idContainer, itens, funcaoTexto) {
    const container = document.getElementById(idContainer);
    if (!container) return;

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

function excluirItemPublicado(chaveBanco, index) {
    if (confirm("Tem certeza que deseja apagar permanentemente este item do portal?")) {
        db.ref(chaveBanco).once('value').then(snapshot => {
            let itens = obterLista(snapshot.val());
            itens.splice(index, 1);
            return db.ref(chaveBanco).set(itens);
        }).catch(err => console.error(err));
    }
}

function renderizarSugestoesAdmin(sugestoes) {
    const listaContainer = document.getElementById('lista-sugestoes-pendentes');
    if (!listaContainer) return;

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

function moderarMensagem(index, acao) {
    db.ref('gre_sugestoes').once('value').then(snapshot => {
        let sugestoes = obterLista(snapshot.val());
        if (acao === 'Aprovado') {
            sugestoes[index].status = 'Aprovado';
            alert("Mensagem aprovada e enviada ao Mural do estudante!");
        } else {
            sugestoes.splice(index, 1);
            alert("Mensagem recusada.");
        }
        return db.ref('gre_sugestoes').set(sugestoes);
    }).catch(err => console.error(err));
}

function carregarDadosRodapeForm(rodape) {
    if (!rodape) return;
    if(document.getElementById('rodape-descricao')) document.getElementById('rodape-descricao').value = rodape.descricao || '';
    if(document.getElementById('rodape-instagram')) document.getElementById('rodape-instagram').value = rodape.instagram || '';
    if(document.getElementById('rodape-email')) document.getElementById('rodape-email').value = rodape.email || '';
    if(document.getElementById('rodape-localizacao')) document.getElementById('rodape-localizacao').value = rodape.localizacao || '';
    if(document.getElementById('rodape-atendimento')) document.getElementById('rodape-atendimento').value = rodape.atendimento || '';
}

function restaurarIdentidadeVisualPadrao() {
    if (confirm("Deseja redefinir a identidade visual do portal e voltar ao design padrão?")) {
        db.ref('gre_visual').remove().then(() => {
            alert("Design padrão restaurado!");
            window.location.reload();
        });
    }
}

function configurarFormularios() {
    
    // Form Notícias
    document.getElementById('form-nova-noticia')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const titulo = document.getElementById('noticia-titulo').value.trim();
        const texto = document.getElementById('noticia-texto').value.trim();
        const fotoInput = document.getElementById('noticia-foto');
        const dataHoje = new Date().toISOString().split('T')[0];

        const salvar = (fotoBase64 = "") => {
            db.ref('gre_noticias').once('value').then(snapshot => {
                let dados = obterLista(snapshot.val());
                dados.unshift({ titulo, texto, data: dataHoje, foto: fotoBase64 });
                return db.ref('gre_noticias').set(dados);
            }).then(() => {
                alert("Notícia publicada com sincronização rápida!");
                form.reset();
            }).catch(err => console.error(err));
        };

        if (fotoInput.files && fotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => salvar(ev.target.result);
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            salvar();
        }
    });

    // Form Agenda
    document.getElementById('form-nova-agenda')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const data = document.getElementById('agenda-data').value;
        const titulo = document.getElementById('agenda-titulo').value.trim();
        const descricao = document.getElementById('agenda-descricao').value.trim();

        db.ref('gre_agenda').once('value').then(snapshot => {
            let dados = obterLista(snapshot.val());
            dados.unshift({ data, titulo, descricao });
            return db.ref('gre_agenda').set(dados);
        }).then(() => {
            alert("Evento adicionado à agenda global!");
            form.reset();
        }).catch(err => console.error(err));
    });

    // Form Projetos
    document.getElementById('form-novo-projeto')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const icone = document.getElementById('projeto-icone').value;
        const titulo = document.getElementById('projeto-titulo').value.trim();
        const descricao = document.getElementById('projeto-descricao').value.trim();

        db.ref('gre_projetos').once('value').then(snapshot => {
            let dados = obterLista(snapshot.val());
            dados.push({ icone, titulo, descricao });
            return db.ref('gre_projetos').set(dados);
        }).then(() => {
            alert("Novo projeto cadastrado!");
            form.reset();
        }).catch(err => console.error(err));
    });

    // Form Integrantes Diretoria
    document.getElementById('form-novo-membro')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const nome = document.getElementById('membro-nome').value.trim();
        const cargo = document.getElementById('membro-cargo').value.trim();
        const serie = document.getElementById('membro-serie').value.trim();
        const fotoInput = document.getElementById('membro-foto');

        const salvar = (fotoBase64 = "") => {
            db.ref('gre_membros').once('value').then(snapshot => {
                let dados = obterLista(snapshot.val());
                dados.push({ nome, cargo, serie, foto: fotoBase64 });
                return db.ref('gre_membros').set(dados);
            }).then(() => {
                alert("Novo integrante salvo!");
                form.reset();
            }).catch(err => console.error(err));
        };

        if (fotoInput.files && fotoInput.files[0]) {
            const file = fotoInput.files[0];
            if (file.size > 1.2 * 1024 * 1024) {
                alert("A imagem de perfil ultrapassa 1.2MB. Escolha uma foto menor.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => salvar(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            salvar();
        }
    });

    // Form Identidade Visual (Logo e Banner)
    document.getElementById('form-identidade-visual')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const logoInput = document.getElementById('visual-logo');
        const bannerInput = document.getElementById('visual-banner');

        db.ref('gre_visual').once('value').then(snapshot => {
            let visualAtual = snapshot.val() || { logo: "", banner: "" };

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
                db.ref('gre_visual').set(visualAtual).then(() => {
                    alert("Identidade visual sincronizada instantaneamente!");
                    form.reset();
                });
            });
        });
    });

    // Form Documentos Transparência
    document.getElementById('form-nova-transparencia')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const titulo = document.getElementById('trans-titulo').value.trim();
        const descricao = document.getElementById('trans-descricao').value.trim();
        const arquivoInput = document.getElementById('trans-arquivo');

        const salvar = (arquivoBase64 = "", nomeArquivo = "") => {
            db.ref('gre_transparencia').once('value').then(snapshot => {
                let dados = obterLista(snapshot.val());
                dados.push({ titulo, descricao, arquivo: arquivoBase64, nomeArquivo });
                return db.ref('gre_transparencia').set(dados);
            }).then(() => {
                alert("Documento de transparência publicado!");
                form.reset();
            }).catch(err => console.error(err));
        };

        if (arquivoInput.files && arquivoInput.files[0]) {
            const file = arquivoInput.files[0];
            if (file.size > 2 * 1024 * 1024) {
                alert("O arquivo é muito grande! Máximo permitido de até 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => salvar(ev.target.result, file.name);
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, selecione um arquivo.");
        }
    });

    // Form Rodapé e Configurações
    document.getElementById('form-config-rodape')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const novoRodape = {
            descricao: document.getElementById('rodape-descricao').value.trim(),
            instagram: document.getElementById('rodape-instagram').value.trim() || '#',
            email: document.getElementById('rodape-email').value.trim(),
            localizacao: document.getElementById('rodape-localizacao').value.trim(),
            atendimento: document.getElementById('rodape-atendimento').value.trim()
        };

        db.ref('gre_rodape').set(novoRodape).then(() => {
            alert("Configurações do rodapé gravadas em tempo real!");
        });
    });
}
