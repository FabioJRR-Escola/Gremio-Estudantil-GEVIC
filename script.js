document.addEventListener('DOMContentLoaded', () => {
    // 1. Controle do Menu Hamburguer
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Alternância de Campos Anônimos na Ouvidoria
    const anonymousCheck = document.getElementById('anonymousCheck');
    const personalFields = document.getElementById('personalFields');
    const nomeInput = document.getElementById('nome');

    if (anonymousCheck && personalFields) {
        anonymousCheck.addEventListener('change', (e) => {
            if (e.target.checked) {
                personalFields.style.opacity = '0.4';
                personalFields.style.pointerEvents = 'none';
                nomeInput.value = '';
            } else {
                personalFields.style.opacity = '1';
                personalFields.style.pointerEvents = 'auto';
            }
        });
    }

    // 3. Simulação de Envio do Formulário
    const ouvidoriaForm = document.getElementById('ouvidoriaForm');
    const formStatus = document.getElementById('formStatus');

    if (ouvidoriaForm) {
        ouvidoriaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            formStatus.style.color = '#0077b6';
            formStatus.textContent = 'Enviando sua mensagem para o Grêmio Visão Coletiva...';

            setTimeout(() => {
                formStatus.style.color = '#38b000';
                formStatus.textContent = 'Mensagem enviada com sucesso! Agradecemos sua colaboração.';
                ouvidoriaForm.reset();

                if (anonymousCheck.checked) {
                    personalFields.style.opacity = '1';
                    personalFields.style.pointerEvents = 'auto';
                }
            }, 1200);
        });
    }
});
