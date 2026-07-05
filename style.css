// Aguarda o carregamento do documento
document.addEventListener('DOMContentLoaded', () => {

    // Efeito de rolagem suave (Smooth Scroll) para as seções do portal
    const linksDeNavegacao = document.querySelectorAll('a[href^="#"]');
    
    linksDeNavegacao.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const secaoAlvo = document.querySelector(this.getAttribute('href'));
            
            if (secaoAlvo) {
                // Rola suavemente compensando a altura do cabeçalho fixo (80px)
                window.scrollTo({
                    top: secaoAlvo.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Função futura para campo de pesquisa (Exemplo lógico inicial)
    const inputPesquisa = document.querySelector('.search-bar input');
    if(inputPesquisa) {
        inputPesquisa.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                alert(`Buscando por: "${inputPesquisa.value}" no portal do Grêmio...`);
            }
        });
    }
});
