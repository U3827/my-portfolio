const SUPABASE_URL = "https://rjtzurluhylqvfbwajwv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// ELEMENTS
// ========================================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const formMessage = document.getElementById("formMessage");
const loginButton = document.getElementById("loginButton");
const loginButtonText = document.getElementById("loginButtonText");


// ========================================
// PASSWORD SHOW / HIDE
// ========================================

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


// ========================================
// LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email = emailInput.value.trim();
        const password = passwordInput.value;


        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (!email) {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        if (!password) {

            showMessage(
                "Please enter your password.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        // --------------------------------
        // START LOADING
        // --------------------------------

        setLoading(true);

        showMessage(
            "Signing you in...",
            "info"
        );


        try {

            console.log("Nexus: attempting login...");


            // --------------------------------
            // SUPABASE LOGIN
            // --------------------------------

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,
                    password: password

                });


            // --------------------------------
            // LOGIN ERROR
            // --------------------------------

            if (error) {

                console.error(
                    "Nexus login error:",
                    error
                );

                showMessage(
                    error.message ||
                    "Unable to log in. Please check your email and password.",
                    "error"
                );

                setLoading(false);

                return;
            }


            // --------------------------------
            // CHECK USER
            // --------------------------------

            if (!data || !data.user) {

                console.error(
                    "No user returned from Supabase.",
                    data
                );

                showMessage(
                    "Login failed. No user account was returned.",
                    "error"
                );

                setLoading(false);

                return;
            }


            // --------------------------------
            // CHECK SESSION
            // --------------------------------

            if (!data.session) {

                console.error(
                    "No session returned from Supabase.",
                    data
                );

                showMessage(
                    "Login completed, but no active session was created.",
                    "error"
                );

                setLoading(false);

                return;
            }


            // --------------------------------
            // SUCCESS
            // --------------------------------

            console.log(
                "Nexus login successful:",
                data.user
            );


            showMessage(
                "Login successful. Welcome back!",
                "success"
            );


            // --------------------------------
            // REDIRECT
            // --------------------------------

            console.log(
                "Nexus: redirecting to dashboard..."
            );


            setTimeout(() => {

                window.location.href =
                    "nexus-dashboard.html";

            }, 1000);

        }


        catch (error) {

            console.error(
                "Unexpected Nexus login error:",
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


// ========================================
// LOADING STATE
// ========================================

function setLoading(isLoading) {

    if (!loginButton) return;


    if (isLoading) {

        loginButton.disabled = true;

        if (loginButtonText) {

            loginButtonText.textContent =
                "Signing in...";

        }

    } else {

        loginButton.disabled = false;

        if (loginButtonText) {

            loginButtonText.textContent =
                "Log In";

        }

    }

}


// ========================================
// MESSAGE
// ========================================

function showMessage(message, type = "info") {

    if (!formMessage) {

        console.error(
            "Nexus error: #formMessage was not found."
        );

        return;
    }


    formMessage.textContent = message;

    formMessage.className =
        "form-message " + type;

}