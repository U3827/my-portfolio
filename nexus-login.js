const SUPABASE_URL = "https://rjtzurluhylqvfbwajwv.supabase.co";

// IMPORTANT:
// Paste the SAME REAL publishable key from your working
// Nexus registration file here.
const SUPABASE_PUBLISHABLE_KEY = "YOUR_REAL_PUBLISHABLE_KEY_HERE";

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


// ========================================
// PASSWORD SHOW / HIDE
// ========================================

if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
        const showingPassword = passwordInput.type === "password";

        passwordInput.type = showingPassword ? "text" : "password";
        passwordToggle.textContent = showingPassword ? "Hide" : "Show";
    });
}


// ========================================
// LOGIN
// ========================================

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

            // Sign in
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            // Login error
            if (error) {
                console.error("Nexus login error:", error);

                showMessage(
                    error.message ||
                    "Unable to sign in. Please check your details.",
                    "error"
                );

                setLoading(false);
                return;
            }


            // Make sure a session exists
            if (!data || !data.session) {

                console.error(
                    "Login succeeded but no Supabase session was returned.",
                    data
                );

                showMessage(
                    "Login completed, but no active session was created.",
                    "error"
                );

                setLoading(false);
                return;
            }


            // Login successful
            showMessage(
                "Login successful. Welcome back!",
                "success"
            );


            // ========================================
            // VERIFY SESSION BEFORE REDIRECT
            // ========================================

            const {
                data: sessionData,
                error: sessionError
            } = await supabaseClient.auth.getSession();


            if (sessionError) {
                console.error(
                    "Session verification error:",
                    sessionError
                );

                showMessage(
                    "Login succeeded, but the session could not be verified.",
                    "error"
                );

                setLoading(false);
                return;
            }


            if (!sessionData || !sessionData.session) {
                console.error(
                    "No active session after login."
                );

                showMessage(
                    "No active session was found after login.",
                    "error"
                );

                setLoading(false);
                return;
            }


            console.log(
                "Nexus session verified. Redirecting to dashboard..."
            );


            // ========================================
            // REDIRECT
            // ========================================

            setTimeout(() => {

                window.location.assign(
                    "./nexus-dashboard.html"
                );

            }, 500);

        } catch (error) {

            console.error(
                "Unexpected Nexus login error:",
                error
            );

            showMessage(
                "Something went wrong while logging in. Please try again.",
                "error"
            );

            setLoading(false);
        }
    });
}


// ========================================
// LOADING STATE
// ========================================

function setLoading(isLoading) {

    if (!loginButton) return;

    if (isLoading) {

        if (!loginButton.dataset.originalText) {
            loginButton.dataset.originalText =
                loginButton.textContent;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Signing in...";

    } else {

        loginButton.disabled = false;

        loginButton.textContent =
            loginButton.dataset.originalText ||
            "Log In";
    }
}


// ========================================
// MESSAGE
// ========================================

function showMessage(message, type = "info") {

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.className =
        `message ${type}`;
}