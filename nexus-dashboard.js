/* =========================================================
   NEXUS DASHBOARD
   BUTTON CONTROL + LOGOUT SYSTEM
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const LOGIN_PAGE = "nexus.html";

    let toastTimer = null;


    /* =====================================================
       CREATE TOAST CONTAINER
       ===================================================== */

    function createToastContainer() {

        let container =
            document.getElementById("nexusToastContainer");

        if (container) {
            return container;
        }

        container = document.createElement("div");

        container.id = "nexusToastContainer";

        container.style.position = "fixed";
        container.style.left = "50%";
        container.style.bottom = "30px";
        container.style.transform = "translateX(-50%)";
        container.style.zIndex = "999999";
        container.style.pointerEvents = "none";

        document.body.appendChild(container);

        return container;
    }


    /* =====================================================
       SHOW COMING SOON MESSAGE
       ===================================================== */

    function showComingSoon(message = "This feature is coming soon.") {

        const container = createToastContainer();

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        container.innerHTML = "";

        const toast = document.createElement("div");

        toast.style.minWidth = "280px";
        toast.style.maxWidth = "90vw";
        toast.style.padding = "16px 20px";
        toast.style.borderRadius = "14px";
        toast.style.background = "#111827";
        toast.style.color = "#ffffff";
        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,0.25)";
        toast.style.fontFamily =
            "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
        toast.style.textAlign = "center";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "600";
        toast.style.lineHeight = "1.5";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        toast.style.transition =
            "opacity 0.25s ease, transform 0.25s ease";

        toast.innerHTML = `
            <div
                style="
                    font-size:24px;
                    margin-bottom:6px;
                "
            >
                🚧
            </div>

            <div
                style="
                    font-size:15px;
                    margin-bottom:4px;
                "
            >
                Coming Soon
            </div>

            <div
                style="
                    color:#cbd5e1;
                    font-size:12px;
                    font-weight:400;
                "
            >
                ${message}
            </div>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {

            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";

        });

        toastTimer = setTimeout(() => {

            toast.style.opacity = "0";
            toast.style.transform = "translateY(15px)";

            setTimeout(() => {

                if (container) {
                    container.innerHTML = "";
                }

            }, 250);

        }, 3000);
    }


    /* =====================================================
       LOGOUT MESSAGE
       ===================================================== */

    function showLogoutMessage() {

        const container = createToastContainer();

        if (toastTimer) {
            clearTimeout(toastTimer);
        }

        container.innerHTML = "";

        const toast = document.createElement("div");

        toast.style.minWidth = "280px";
        toast.style.maxWidth = "90vw";
        toast.style.padding = "16px 20px";
        toast.style.borderRadius = "14px";
        toast.style.background = "#111827";
        toast.style.color = "#ffffff";
        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,0.25)";
        toast.style.textAlign = "center";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "600";

        toast.innerHTML = `
            <div
                style="
                    font-size:24px;
                    margin-bottom:6px;
                "
            >
                ✓
            </div>

            <div>
                Logging you out...
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {

            logoutUser();

        }, 700);
    }


    /* =====================================================
       LOGOUT USER
       ===================================================== */

    async function logoutUser() {

        try {

            /*
             * Support the Supabase client already
             * created by the dashboard.
             */

            let client = null;

            if (
                typeof window.supabaseClient !== "undefined"
            ) {
                client = window.supabaseClient;
            }

            else if (
                typeof window.nexusSupabase !== "undefined"
            ) {
                client = window.nexusSupabase;
            }

            /*
             * If your dashboard exposes the Supabase
             * client under another name, try the common
             * global object safely.
             */

            if (
                !client &&
                window.supabase &&
                typeof window.supabase.auth !== "undefined"
            ) {
                client = window.supabase;
            }


            if (client && client.auth) {

                const { error } =
                    await client.auth.signOut();

                if (error) {
                    console.error(
                        "Nexus logout error:",
                        error
                    );
                }

            }

        }

        catch (error) {

            console.error(
                "Nexus logout failed:",
                error
            );

        }

        finally {

            /*
             * Clear local Nexus session information.
             */

            try {
                localStorage.removeItem(
                    "nexusUser"
                );

                localStorage.removeItem(
                    "nexus_user"
                );

                localStorage.removeItem(
                    "nexusSession"
                );

                sessionStorage.removeItem(
                    "nexusUser"
                );

                sessionStorage.removeItem(
                    "nexus_user"
                );

                sessionStorage.removeItem(
                    "nexusSession"
                );

            }

            catch (storageError) {

                console.warn(
                    "Could not clear local session:",
                    storageError
                );

            }


            /*
             * Return to Nexus login page.
             */

            window.location.href =
                LOGIN_PAGE;
        }
    }


    /* =====================================================
       GET BUTTON NAME
       ===================================================== */

    function getElementName(element) {

        if (!element) {
            return "This feature";
        }

        const aria =
            element.getAttribute("aria-label");

        if (aria) {
            return aria;
        }

        const title =
            element.getAttribute("title");

        if (title) {
            return title;
        }

        const text =
            element.textContent
                .replace(/\s+/g, " ")
                .trim();

        if (text) {
            return text;
        }

        return "This feature";
    }


    /* =====================================================
       CHECK IF ELEMENT IS LOGOUT
       ===================================================== */

    function isLogoutElement(element) {

        if (!element) {
            return false;
        }

        const id =
            (element.id || "").toLowerCase();

        const className =
            typeof element.className === "string"
                ? element.className.toLowerCase()
                : "";

        const text =
            (element.textContent || "")
                .trim()
                .toLowerCase();

        const dataAction =
            (
                element.getAttribute(
                    "data-action"
                ) || ""
            ).toLowerCase();


        if (id === "logoutbtn") {
            return true;
        }

        if (id === "logout-btn") {
            return true;
        }

        if (id === "logout") {
            return true;
        }

        if (className.includes("logout")) {
            return true;
        }

        if (dataAction === "logout") {
            return true;
        }

        if (text === "logout") {
            return true;
        }

        return false;
    }


    /* =====================================================
       HANDLE DASHBOARD CLICK
       ===================================================== */

    function handleDashboardClick(event) {

        const element =
            event.target.closest(
                "button, a, [role='button']"
            );

        if (!element) {
            return;
        }


        /*
         * LOGOUT
         */

        if (isLogoutElement(element)) {

            event.preventDefault();
            event.stopPropagation();

            showLogoutMessage();

            return;
        }


        /*
         * Everything else is currently
         * Coming Soon.
         */

        event.preventDefault();
        event.stopPropagation();

        const name =
            getElementName(element);

        showComingSoon(
            `${name} is currently being prepared for Nexus.`
        );
    }


    /* =====================================================
       GLOBAL DASHBOARD CLICK LISTENER
       ===================================================== */

    document.addEventListener(
        "click",
        handleDashboardClick,
        true
    );


    /* =====================================================
       PREVENT EMPTY / PLACEHOLDER LINKS
       ===================================================== */

    document
        .querySelectorAll(
            "a[href='#'], a[href='javascript:void(0)']"
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                },
                true
            );

        });


    /* =====================================================
       DASHBOARD INITIALIZATION
       ===================================================== */

    console.log(
        "Nexus Dashboard: button system initialized."
    );

});