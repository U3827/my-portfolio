const SUPABASE_URL = "https://rjtzurluhylqvfbwajwv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const messageBox = document.getElementById("message");

const loginButton = loginForm
    ? loginForm.querySelector("button[type='submit']")
    : null;


// ================================
// PASSWORD SHOW / HIDE
// ================================

if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordToggle.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            passwordToggle.textContent = "Show";
        }

    });
}


// ================================
// LOGIN
// ================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {

            showMessage(
                "Please enter your email and password.",
                "error"
            );

            return;
        }


        setLoading(true);

        showMessage(
            "Signing you in...",
            "info"
        );


        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            // ================================
            // LOGIN ERROR
            // ================================

            if (error) {

                console.error("Login error:", error);

                showMessage(
                    error.message ||
                    "Unable to sign in. Please check your details.",
                    "error"
                );

                setLoading(false);

                return;
            }


            // ================================
            // CHECK SESSION
            // ================================

            if (!data || !data.session) {

                console.error(
                    "Login completed but no session was returned.",
                    data
                );

                showMessage(
                    "Login completed, but no active session was created.",
                    "error"
                );

                setLoading(false);

                return;
            }


            console.log("Login successful.");
            console.log("User:", data.user);
            console.log("Session:", data.session);


            showMessage(
                "Login successful. Welcome back!",
                "success"
            );


            // ================================
            // REDIRECT TO DASHBOARD
            // ================================

            setTimeout(() => {

                window.location.href = "./nexus-dashboard.html";

            }, 1000);

        }

        catch (error) {

            console.error(
                "Unexpected login error:",
                error
            );

            showMessage(
                error.message ||
                "Something went wrong while logging in.",
                "error"
            );

            setLoading(false);
        }

    });

}


// ================================
// LOADING BUTTON
// ================================

function setLoading(isLoading) {

    if (!loginButton) return;

    if (isLoading) {

        loginButton.disabled = true;

        if (!loginButton.dataset.originalText) {
            loginButton.dataset.originalText =
                loginButton.textContent;
        }

        loginButton.textContent = "Signing in...";

    } else {

        loginButton.disabled = false;

        loginButton.textContent =
            loginButton.dataset.originalText ||
            "Log In";
    }
}


// ================================
// MESSAGE
// ================================

function showMessage(message, type = "info") {

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.className =
        "message " + type;
}