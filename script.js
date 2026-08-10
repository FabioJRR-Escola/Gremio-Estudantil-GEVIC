document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       MENU MOBILE
    ======================================================== */

    const mobileMenu = document.getElementById("mobile-menu");
    const navList = document.getElementById("nav-list");

    if (mobileMenu && navList) {

        mobileMenu.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen =
                navList.classList.toggle("active");

            mobileMenu.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        // Fecha o menu ao clicar em um link

        navList
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    navList.classList.remove("active");

                    mobileMenu.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                });

            });

    }



    /* ========================================================
       PESQUISA
    ======================================================== */

    const searchButton =
        document.getElementById("btn-search");

    const searchPanel =
        document.getElementById("search-panel");

    const searchForm =
        document.getElementById("search-form");

    const searchInput =
        document.getElementById("site-search");


    if (searchButton && searchPanel) {

        searchButton.addEventListener("click", () => {

            const isOpen =
                searchPanel.classList.toggle("active");

            searchButton.classList.toggle(
                "active",
                isOpen
            );

            searchButton.setAttribute(
                "aria-expanded",
                isOpen
            );

            searchPanel.setAttribute(
                "aria-hidden",
                !isOpen
            );


            if (isOpen && searchInput) {

                setTimeout(() => {
                    searchInput.focus();
                }, 150);

            }

        });

    }


    /*
       Pesquisa simples dentro dos conteúdos visíveis.
       Ao pesquisar, os cards que não correspondem ficam ocultos.
    */

    if (searchForm && searchInput) {

        searchForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const term =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const searchableElements =
                    document.querySelectorAll(
                        "#noticias .card, #agenda .event-item, #diretoria .member-card"
                    );


                if (!term) {

                    searchableElements.forEach(element => {
                        element.style.display = "";
                    });

                    return;
                }


                searchableElements.forEach(element => {

                    const content =
                        element.textContent.toLowerCase();

                    element.style.display =
                        content.includes(term)
                            ? ""
                            : "none";

                });

            }
        );

    }



    /* ========================================================
       ACESSIBILIDADE
    ======================================================== */

    let fontSize = 16;

    const increaseText =
        document.getElementById("btn-increase-text");

    const decreaseText =
        document.getElementById("btn-decrease-text");

    const normalText =
        document.getElementById("btn-normal-text");

    const contrastButton =
        document.getElementById("btn-contrast");


    if (increaseText) {

        increaseText.addEventListener(
            "click",
            () => {

                if (fontSize < 24) {

                    fontSize += 2;

                    document.body.style.fontSize =
                        `${fontSize}px`;

                }

            }
        );

    }


    if (decreaseText) {

        decreaseText.addEventListener(
            "click",
            () => {

                if (fontSize > 12) {

                    fontSize -= 2;

                    document.body.style.fontSize =
                        `${fontSize}px`;

                }

            }
        );

    }


    if (normalText) {

        normalText.addEventListener(
            "click",
            () => {

                fontSize = 16;

                document.body.style.fontSize =
                    "16px";

            }
        );

    }


    if (contrastButton) {

        contrastButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "high-contrast"
                );

            }
        );

    }



    /* ========================================================
       ANIMAÇÃO AO ROLAR
    ======================================================== */

    const sections =
        document.querySelectorAll("main section");


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                        }

                    });

                },
                {
                    threshold: 0.08
                }
            );


        sections.forEach(section => {

            section.classList.add(
                "animate-on-scroll"
            );

            observer.observe(section);

        });

    }



    /* ========================================================
       CARROSSEL DE BANNERS
    ======================================================== */

    const bannerTrack =
        document.getElementById("banner-track");

    const bannerDots =
        document.getElementById("banner-dots");


    if (bannerTrack && bannerDots) {

        const slides =
            bannerTrack.querySelectorAll(
                ".banner-slide"
            );

        let currentBanner = 0;


        /*
           Cria os indicadores automaticamente
        */

        slides.forEach((_, index) => {

            const dot =
                document.createElement("button");

            dot.type = "button";

            dot.className =
                "carousel-dot";

            dot.setAttribute(
                "aria-label",
                `Ir para o banner ${index + 1}`
            );

            if (index === 0) {

                dot.classList.add("active");

            }


            dot.addEventListener(
                "click",
                () => showBanner(index)
            );


            bannerDots.appendChild(dot);

        });


        function showBanner(index) {

            currentBanner = index;


            slides.forEach(
                (slide, slideIndex) => {

                    slide.classList.toggle(
                        "active",
                        slideIndex === index
                    );

                }
            );


            bannerDots
                .querySelectorAll(".carousel-dot")
                .forEach(
                    (dot, dotIndex) => {

                        dot.classList.toggle(
                            "active",
                            dotIndex === index
                        );

                    }
                );

        }


        /*
           Troca automática a cada 8 segundos
        */

        if (slides.length > 1) {

            setInterval(() => {

                const next =
                    (currentBanner + 1) %
                    slides.length;

                showBanner(next);

            }, 8000);

        }

    }



    /* ========================================================
       CARROSSEL DA DIRETORIA
    ======================================================== */

    const membersViewport =
        document.getElementById(
            "members-viewport"
        );

    const memberPrev =
        document.getElementById(
            "member-prev"
        );

    const memberNext =
        document.getElementById(
            "member-next"
        );


    if (
        membersViewport &&
        memberPrev &&
        memberNext
    ) {

        memberPrev.addEventListener(
            "click",
            () => {

                membersViewport.scrollBy({
                    left: -260,
                    behavior: "smooth"
                });

            }
        );


        memberNext.addEventListener(
            "click",
            () => {

                membersViewport.scrollBy({
                    left: 260,
                    behavior: "smooth"
                });

            }
        );

    }



    /* ========================================================
       FECHAR PESQUISA AO CLICAR FORA
    ======================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (
                searchPanel &&
                searchButton &&
                searchPanel.classList.contains("active") &&
                !searchPanel.contains(event.target) &&
                !searchButton.contains(event.target)
            ) {

                searchPanel.classList.remove(
                    "active"
                );

                searchButton.classList.remove(
                    "active"
                );

                searchButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                searchPanel.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );

});