document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       MOBILE NAVIGATION
    ================================= */

    const menuButton = document.getElementById("nexusMenu");
    const navLinks = document.getElementById("nexusNavLinks");

    if (menuButton && navLinks) {

        menuButton.addEventListener("click", () => {

            navLinks.classList.toggle("open");

            const isOpen =
                navLinks.classList.contains("open");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuButton.innerHTML =
                isOpen ? "✕" : "☰";

        });


        /* Close menu after clicking a navigation link */

        const links =
            navLinks.querySelectorAll("a");

        links.forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.innerHTML = "☰";

            });

        });

    }


    /* ================================
       HEADER SCROLL EFFECT
    ================================= */

    const header =
        document.querySelector(".nexus-header");

    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 30) {
                header.style.background =
                    "rgba(7, 11, 20, 0.94)";
            } else {
                header.style.background =
                    "rgba(7, 11, 20, 0.82)";
            }

        });

    }


    /* ================================
       REVEAL ANIMATIONS
    ================================= */

    const revealElements =
        document.querySelectorAll(
            ".feature-card, .learning-content, .learning-visual, .about-box, .cta-content"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "nexus-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {

            element.style.opacity = "0";
            element.style.transform =
                "translateY(25px)";
            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

            observer.observe(element);

        });

    }


    /* ================================
       BUTTON PRESS EFFECT
    ================================= */

    const buttons =
        document.querySelectorAll(".nexus-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            button.style.transform =
                "scale(0.97)";

            setTimeout(() => {

                button.style.transform = "";

            }, 120);

        });

    });


    /* ================================
       SMOOTH INTERNAL LINKS
    ================================= */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                targetId &&
                targetId !== "#"
            ) {

                const target =
                    document.querySelector(
                        targetId
                    );

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        });

    });

});
