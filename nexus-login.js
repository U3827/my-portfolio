document.addEventListener("DOMContentLoaded", () => {

/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
    "https://rjtzurluhylqvfbwajwv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

const supabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================
   ELEMENTS
========================================= */

const loginForm =
    document.getElementById("loginForm");

const email =
    document.getElementById("email");

const password =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const formMessage =
    document.getElementById("formMessage");

const emailError =
    document.getElementById("emailError");

const passwordError =
    document.getElementById("passwordError");

const forgotPassword =
    document.getElementById("forgotPassword");


/* =========================================
   MESSAGE
========================================= */

function showMessage(message, type) {

    formMessage.textContent =
        message;

    if (type === "success") {

        formMessage.style.color =
            "#42d392";

    } else if (type === "error") {

        formMessage.style.color =
            "#ff6b81";

    } else {

        formMessage.style.color =
            "#8e9aaf";
    }

}


/* =========================================
   CLEAR ERRORS
========================================= */

function clearErrors() {

    emailError.textContent = "";
    passwordError.textContent = "";
    formMessage.textContent = "";

    email
        .closest(".input-wrapper")
        ?.classList.remove(
            "has-error",
            "has-success"
        );

    password
        .closest(".input-wrapper")
        ?.classList.remove(
            "has-error",
            "has-success"
        );

}


/* =========================================
   PASSWORD VISIBILITY
========================================= */

passwordToggle.addEventListener(
    "click",
    () => {

        if (password.type === "password") {

            password.type = "text";

            passwordToggle.textContent =
                "Hide";

        } else {

            password.type = "password";

            passwordToggle.textContent =
                "Show";
        }

    }
);


/* =========================================
   LOGIN
========================================= */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        clearErrors();


        const emailValue =
            email.value.trim();

        const passwordValue =
            password.value;


        /* VALIDATION */

        let valid = true;


        if (!emailValue) {

            emailError.textContent =
                "Please enter your email address.";

            email
                .closest(".input-wrapper")
                ?.classList.add("has-error");

            valid = false;

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(emailValue)
        ) {

            emailError.textContent =
                "Please enter a valid email address.";

            email
                .closest(".input-wrapper")
                ?.classList.add("has-error");

            valid = false;
        }


        if (!passwordValue) {

            passwordError.textContent =
                "Please enter your password.";

            password
                .closest(".input-wrapper")
                ?.classList.add("has-error");

            valid = false;
        }


        if (!valid) {
            return;
        }


        /* LOADING */

        loginButton.disabled =
            true;

        loginButton.style.opacity =
            "0.7";

        loginButtonText.textContent =
            "Logging in...";


        try {

            const {
                data,
                error
            } = await supabase.auth.signInWithPassword({

                email: emailValue,

                password: passwordValue

            });


            if (error) {
                throw error;
            }


            if (!data || !data.user) {

                throw new Error(
                    "Login could not be completed. Please try again."
                );

            }


            console.log(
                "Nexus login successful:",
                data.user
            );


            showMessage(
                "Login successful. Welcome back!",
                "success"
            );


            /*
             * Dashboard will be created next.
             *
             * For now we do not redirect
             * because the dashboard does
             * not exist yet.
             */

        } catch (error) {

            console.error(
                "Nexus login error:",
                error
            );


            let message =
                "Unable to log in. Please try again.";


            if (
                error.message
                    ?.toLowerCase()
                    .includes("invalid login credentials")
            ) {

                message =
                    "Incorrect email or password.";

            } else if (
                error.message
                    ?.toLowerCase()
                    .includes("email not confirmed")
            ) {

                message =
                    "Please confirm your email before logging in.";

            } else if (
                error.message
            ) {

                message =
                    error.message;
            }


            showMessage(
                message,
                "error"
            );

        } finally {

            loginButton.disabled =
                false;

            loginButton.style.opacity =
                "1";

            loginButtonText.textContent =
                "Log In";
        }

    }
);


/* =========================================
   FORGOT PASSWORD
========================================= */

forgotPassword.addEventListener(
    "click",
    event => {

        event.preventDefault();

        showMessage(
            "Password recovery will be added next.",
            "info"
        );

    }
);


/* =========================================
   CHECK EXISTING SESSION
========================================= */

async function checkSession() {

    const {
        data
    } = await supabase.auth.getSession();


    if (
        data &&
        data.session
    ) {

        console.log(
            "Existing Nexus session found."
        );

        /*
         * We will redirect authenticated
         * users to the Dashboard once
         * the Dashboard is ready.
         */
    }

}


checkSession();

});