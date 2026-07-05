document.addEventListener('DOMContentLoaded', () => {
    inicializarDados();
    configurarMenuAbas();
    renderizarTudo();

    // Captura envio dos formulários
    configurarFormularios();
});

// BANCO DE DADOS LOCAL SIMULADO (Se vazio, preenche com padrões)
function inicializarDados() {
    if (!localStorage.getItem('gre_noticias')) {
        const noticiasPadrao = [
            { titulo: "Festa Julina arrecada mais de R$ 5.000", data: "2026-07-15", texto: "O evento foi um sucesso de público...", foto: "" },
            { titulo: "Inscrições para Olimpíada de Matemática", data: "2026-07-10", texto: "O Grêmio oferecerá grupos de estudo...", foto: "" }
        ];
        localStorage.setItem('gre_noticias', JSON.stringify(noticiasPadrao));
    }
    if (!localStorage.getItem('gre_agenda')) {
        const agendaPadrao = [
            { data: "2026-07-20", titulo: "Reunião Geral com Representantes", descricao: "Discussão sobre o novo regimento interno." }
        ];
        localStorage.setItem('gre_agenda', JSON.stringify(agendaPadrao));
    }
    if (!localStorage.getItem('gre_projetos')) {
        const projetosPadrao = [
            { icone: "📚", titulo: "Biblioteca Viva", descricao: "Clubes de leitura quinzenais e arrecadação." }
        ];
        localStorage.setItem('gre_projetos', JSON.stringify(projetosPadrao));
    }
    if (!localStorage.getItem('gre_sugestoes')) {
        const sugestoesPadrao = [
            { texto: "Gostaria de mais bancos no pátio próximo às quadras.", autor: "João P., 1º Ano C", status: "Aprovado" },
            { texto: "Sugestão de termos sabonete líquido nos banheiros.", autor: "Anônimo", status: "Pendente" }
        ];
        localStorage.setItem('gre_sugestoes', JSON.stringify(sugestoesPadrao));
    }
    if (!localStorage.getItem('gre_transparencia')) {
        const transparenciaPadrao = [
            { titulo: "Estatuto do Grêmio", descricao: "Documento oficial com as regras da instituição." }
        ];
        localStorage.setItem('gre_transparencia', JSON.stringify(transparenciaPadrao));
    }
}

// NAVEGAÇÃO ENTRE ABAS DO PAINEL
function configurarMenuAbas() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            item.classList.add('active');
            const tabId = item.getAttribute('data-tab');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });
}

// OPERAÇÕES DE MODAL
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { 
    document.getElementById(id).style.display = 'none'; 
    document.querySelectorAll('form').forEach(f => f.reset());
    document.getElementById('noticia-index').value = "";
    document.getElementById('agenda-index').value = "";
    document.getElementById('projeto-index').value = "";
    document.getElementById('transparencia-index').value = "";
    document.getElementById('preview-foto').innerHTML = "";
}

// RENDERIZAÇÃO DAS TABELAS ADMINISTRATIVAS
function renderizarTudo() {
    renderNoticias();
    renderAgenda();
    renderProjetos();
    renderSugestoes();
    renderTransparencia();
}

function renderNoticias() {
    const dados = JSON.parse(localStorage.getItem('gre_noticias'));
    let html = '';
    dados.forEach((item, index) => {
        const imgTag = item.foto ? `<img src="${item.foto}" class="img-table">` : `<i class="fa-regular fa-image" style="font-size:1.5rem; color:#ccc;"></i>`;
        html += `<tr>
            <td>${imgTag}</td>
            <td><strong>${item.titulo}</strong></td>
            <td>${item.data}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarNoticia(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-action btn-delete" onclick="deletarItem('gre_noticias', ${index}, renderNoticias)"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    document.getElementById('lista-noticias').innerHTML = html;
}

function renderAgenda() {
    const dados = JSON.parse(localStorage.getItem('gre_agenda'));
    let html = '';
    dados.forEach((item, index) => {
        html += `<tr>
            <td>${item.data}</td>
            <td><strong>${item.titulo}</strong></td>
            <td>${item.descricao}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarAgenda(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-action btn-delete" onclick="deletarItem('gre_agenda', ${index}, renderAgenda)"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    document.getElementById('lista-agenda').innerHTML = html;
}

function renderProjetos() {
    const dados = JSON.parse(localStorage.getItem('gre_projetos'));
    let html = '';
    dados.forEach((item, index) => {
        html += `<tr>
            <td style="font-size:1.5rem">${item.icone}</td>
            <td><strong>${item.titulo}</strong></td>
            <td>${item.descricao}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarProjeto(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-action btn-delete" onclick="deletarItem('gre_projetos', ${index}, renderProjetos)"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    document.getElementById('lista-projetos').innerHTML = html;
}

function renderSugestoes() {
    const dados = JSON.parse(localStorage.getItem('gre_sugestoes'));
    let html = '';
    dados.forEach((item, index) => {
        const badgeColor = item.status === 'Aprovado' ? '#4CAF50' : '#FFA000';
        html += `<tr>
            <td>"${item.texto}"</td>
            <td>${item.autor}</td>
            <td><span style="background:${badgeColor}; color:#fff; padding:4px 8px; border-radius:12px; font-size:0.75rem;">${item.status}</span></td>
            <td>
                ${item.status === 'Pendente' ? `<button class="btn-action btn-approve" onclick="aprovarSugestao(${index})"><i class="fa-solid fa-check"></i> Aprovar no Mural</button>` : ''}
                <button class="btn-action btn-delete" onclick="deletarItem('gre_sugestoes', ${index}, renderSugestoes)"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    document.getElementById('lista-sugestoes').innerHTML = html;
}

function renderTransparencia() {
    const dados = JSON.parse(localStorage.getItem('gre_transparencia'));
    let html = '';
    dados.forEach((item, index) => {
        html += `<tr>
            <td><strong>${item.titulo}</strong></td>
            <td>${item.descricao}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editarTransparencia(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-action btn-delete" onclick="deletarItem('gre_transparencia', ${index}, renderTransparencia)"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    document.getElementById('lista-transparencia').innerHTML = html;
}

// DELETAR ITEM GENÉRICO
function deletarItem(chaveStorage, index, callbackRender) {
    if(confirm("Tem certeza que deseja remover este item?")) {
        let dados = JSON.parse(localStorage.getItem(chaveStorage));
        dados.splice(index, 1);
        localStorage.setItem(chaveStorage, JSON.stringify(dados));
        callbackRender();
    }
}

// APROVAR MENSAGEM NO MURAL
function aprovarSugestao(index) {
    let dados = JSON.parse(localStorage.getItem('gre_sugestoes'));
    dados[index].status = 'Aprovado';
    localStorage.setItem('gre_sugestoes', JSON.stringify(dados));
    renderSugestoes();
}

// EDIÇÃO - CARREGAR DADOS NO FORMULÁRIO DO MODAL
function editarNoticia(index) {
    const dados = JSON.parse(localStorage.getItem('gre_noticias'))[index];
    document.getElementById('noticia-index').value = index;
    document.getElementById('noticia-titulo').value = dados.titulo;
    document.getElementById('noticia-data').value = dados.data;
    document.getElementById('noticia-texto').value = dados.texto;
    if(dados.foto) {
        document.getElementById('preview-foto').innerHTML = `<img src="${dados.foto}" style="width:100px; border-radius:4px;">`;
    }
    openModal('modal-noticia');
}

function editarAgenda(index) {
    const dados = JSON.parse(localStorage.getItem('gre_agenda'))[index];
    document.getElementById('agenda-index').value = index;
    document.getElementById('agenda-data').value = dados.data;
    document.getElementById('agenda-titulo').value = dados.titulo;
    document.getElementById('agenda-descricao').value = dados.descricao;
    openModal('modal-agenda');
}

function editarProjeto(index) {
    const dados = JSON.parse(localStorage.getItem('gre_projetos'))[index];
    document.getElementById('projeto-index').value = index;
    document.getElementById('projeto-icone').value = dados.icone;
    document.getElementById('projeto-titulo').value = dados.titulo;
    document.getElementById('projeto-descricao').value = dados.descricao;
    openModal('modal-projeto');
}

function editarTransparencia(index) {
    const dados = JSON.parse(localStorage.getItem('gre_transparencia'))[index];
    document.getElementById('transparencia-index').value = index;
    document.getElementById('transparencia-titulo').value = dados.titulo;
    document.getElementById('transparencia-descricao').value = dados.descricao;
    openModal('modal-transparencia');
}

// ENVIOS E ADIÇÕES DE FORMULÁRIO (SALVAR / ATUALIZAR)
function configurarFormularios() {
    
    // Form Notícia + Upload de Foto em Base64
    document.getElementById('form-noticia').addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('noticia-index').value;
        const titulo = document.getElementById('noticia-titulo').value;
        const data = document.getElementById('noticia-data').value;
        const texto = document.getElementById('noticia-texto').value;
        const fotoInput = document.getElementById('noticia-foto').files[0];

        const executarSalvamento = (fotoBase64 = "") => {
            let dados = JSON.parse(localStorage.getItem('gre_noticias'));
            const novaNoticia = { titulo, data, texto, foto: fotoBase64 || (index !== "" ? dados[index].foto : "") };

            if(index !== "") dados[index] = novaNoticia; // Editar
            else dados.push(novaNoticia); // Criar novo

            localStorage.setItem('gre_noticias', JSON.stringify(dados));
            renderNoticias();
            closeModal('modal-noticia');
        };

        if (fotoInput) {
            const reader = new FileReader();
            reader.onloadend = function() { executarSalvamento(reader.result); };
            reader.readAsDataURL(fotoInput); // Transforma imagem em string de texto
        } else {
            executarSalvamento();
        }
    });

    // Form Agenda
    document.getElementById('form-agenda').addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('agenda-index').value;
        let dados = JSON.parse(localStorage.getItem('gre_agenda'));
        const novoEvento = {
            data: document.getElementById('agenda-data').value,
            titulo: document.getElementById('agenda-titulo').value,
            descricao: document.getElementById('agenda-descricao').value
        };
        if(index !== "") dados[index] = novoEvento; else dados.push(novoEvento);
        localStorage.setItem('gre_agenda', JSON.stringify(dados));
        renderAgenda();
        closeModal('modal-agenda');
    });

    // Form Projeto
    document.getElementById('form-projeto').addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('projeto-index').value;
        let dados = JSON.parse(localStorage.getItem('gre_projetos'));
        const novoProjeto = {
            icone: document.getElementById('projeto-icone').value,
            titulo: document.getElementById('projeto-titulo').value,
            descricao: document.getElementById('projeto-descricao').value
        };
        if(index !== "") dados[index] = novoProjeto; else dados.push(novoProjeto);
        localStorage.setItem('gre_projetos', JSON.stringify(dados));
        renderProjetos();
        closeModal('modal-projeto');
    });

    // Form Transparência
    document.getElementById('form-transparencia').addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('transparencia-index').value;
        let dados = JSON.parse(localStorage.getItem('gre_transparencia'));
        const novoDoc = {
            titulo: document.getElementById('transparencia-titulo').value,
            descricao: document.getElementById('transparencia-descricao').value
        };
        if(index !== "") dados[index] = novoDoc; else dados.push(novoDoc);
        localStorage.setItem('gre_transparencia', JSON.stringify(dados));
        renderTransparencia();
        closeModal('modal-transparencia');
    });
}
