// ==================== TRAVA DE SEGURANÇA IMEDIATA ====================
// Executa na hora que o arquivo carrega, impedindo que a página renderize se não houver login.
if (sessionStorage.getItem('gre_admin_logado') !== 'true') {
    alert('Acesso negado! Por favor, faça login primeiro.');
    window.location.href = 'login.html';
}

// ==================== INICIALIZAÇÃO DO PAINEL ====================
document.addEventListener('DOMContentLoaded', () => {
    renderizarSugestoesAdmin();
    configurarFormularios();
});

// Função para encerrar a sessão
function fazerLogout() {
    if (confirm("Deseja realmente sair da conta administrativa?")) {
        sessionStorage.removeItem('gre_admin_logado');
        window.location.href = 'login.html';
    }
}

// ==================== GERENCIAMENTO DA OUVIDORIA ====================
function renderizarSugestoesAdmin() {
    const listaContainer = document.getElementById('lista-sugestoes-pendentes');
    if (!listaContainer) return;

    const sugestoes = JSON.parse(localStorage.getItem('gre_sugestoes')) || [];
    // Mapeia mantendo o índice original para não excluir a mensagem errada após aplicar o filtro
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
        sugestoes.splice(index, 1); // Remove definitivamente se for recusada
        alert("Mensagem descartada com sucesso.");
    }

    localStorage.setItem('gre_sugestoes', JSON.stringify(sugestoes));
    renderizarSugestoesAdmin();
}

// ==================== PROCESSAMENTO DOS FORMULÁRIOS ====================
function configurarFormularios() {
    
    // 1. Envio de Notícias (Com conversão de foto para string Base64)
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
        };

        if (fotoInput.files && fotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => salvar(ev.target.result);
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            salvar();
        }
    });

    // 2. Envio de Agenda
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
    });

    // 3. Envio de Projetos
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
    });

    // 4. Envio de Transparência
    document.getElementById('form-nova-transparencia')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const titulo = document.getElementById('trans-titulo').value.trim();
        const descricao = document.getElementById('trans-descricao').value.trim();

        let dados = JSON.parse(localStorage.getItem('gre_transparencia')) || [];
        dados.push({ titulo, descricao });
        localStorage.setItem('gre_transparencia', JSON.stringify(dados));

        alert("Documento de transparência publicado com sucesso!");
        this.reset();
    });
}
