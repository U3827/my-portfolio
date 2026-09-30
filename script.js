/* =========================================
   USMAN MUSA HASSAN - PORTFOLIO
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- MOBILE MENU ---------- */

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");

            if (navLinks.classList.contains("open")) {
                menuBtn.innerHTML = "✕";
            } else {
                menuBtn.innerHTML = "☰";
            }
        });

        /* Close menu after clicking a link */

        const links = navLinks.querySelectorAll("a");

        links.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuBtn.innerHTML = "☰";
            });
        });
    }


    /* ---------- CURRENT YEAR ---------- */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* ---------- ACTIVE NAVIGATION ---------- */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const navItems =
        document.querySelectorAll(".nav-links a");

    navItems.forEach(link => {

        const linkPage =
            link.getAttribute("href");

        link.classList.remove("active");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });


    /* ---------- SCROLL REVEAL ---------- */

    const revealItems = document.querySelectorAll(
        ".intro-section, .featured-section, .cta-section, .skill-preview-card"
    );

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";

                    revealObserver.unobserve(entry.target);
                }
            });

        },
        {
            threshold: 0.12
        }
    );

    revealItems.forEach(item => {

        item.style.opacity = "0";
        item.style.transform = "translateY(25px)";
        item.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        revealObserver.observe(item);
    });


    /* ---------- BUTTON CLICK FEEDBACK ---------- */

    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            button.style.transform = "scale(0.97)";

            setTimeout(() => {
                button.style.transform = "";
            }, 120);

        });

    });

});
