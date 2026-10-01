const SUPABASE_URL = "https://rjtzurluhylqvfbwajwv.supabase.co";

// Use the SAME publishable key already used in your registration file.
const SUPABASE_PUBLISHABLE_KEY = "PASTE_YOUR_EXISTING_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const messageBox = document.getElementById("message");
const loginButton = loginForm.querySelector("button[type='submit']");

// Show / hide password
if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        passwordToggle.textContent = isPassword ? "Hide" : "Show";
    });
}

// Login
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("Please enter your email and password.", "error");
        return;
    }

    setLoading(true);
    showMessage("Signing you in...", "info");

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error("Login error:", error);

            showMessage(
                error.message || "Unable to sign in. Please check your details.",
                "error"
            );

            setLoading(false);
            return;
        }

        if (!data.session) {
            showMessage(
                "Login completed, but no active session was created.",
                "error"
            );

            setLoading(false);
            return;
        }

        showMessage("Login successful. Welcome back!", "success");

        // Give the success message a moment to appear,
        // then move the user to the Nexus dashboard.
        setTimeout(() => {
            window.location.href = "nexus-dashboard.html";
        }, 700);

    } catch (error) {
        console.error("Unexpected login error:", error);

        showMessage(
            "Something went wrong while logging in. Please try again.",
            "error"
        );

        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (!loginButton) return;

    loginButton.disabled = isLoading;

    if (isLoading) {
        loginButton.dataset.originalText = loginButton.textContent;
        loginButton.textContent = "Signing in...";
    } else {
        loginButton.textContent =
            loginButton.dataset.originalText || "Log In";
    }
}

function showMessage(message, type = "info") {
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
}