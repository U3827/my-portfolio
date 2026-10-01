/* =========================================================
   NEXUS REGISTRATION
   Supabase Authentication
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SUPABASE CONFIGURATION
    ===================================================== */

    const SUPABASE_URL =
        "https://rjtzurluhylqvfbwajwv.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

    const { createClient } = window.supabase;

    const supabase = createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const registerForm =
        document.getElementById("registerForm");

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms =
        document.getElementById("terms");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const confirmPasswordToggle =
        document.getElementById("confirmPasswordToggle");

    const strengthFill =
        document.getElementById("strengthFill");

    const strengthText =
        document.getElementById("strengthText");

    const formMessage =
        document.getElementById("formMessage");

    const submitButton =
        registerForm.querySelector(
            ".create-account-btn"
        );

    const submitText =
        submitButton.querySelector("span");

    const year =
        document.getElementById("year");


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       ERROR ELEMENTS
    ===================================================== */

    const fullNameError =
        document.getElementById("fullNameError");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const confirmPasswordError =
        document.getElementById("confirmPasswordError");

    const termsError =
        document.getElementById("termsError");


    /* =====================================================
       HELPER: CLEAR ERRORS
    ===================================================== */

    function clearErrors() {

        fullNameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        termsError.textContent = "";

        formMessage.textContent = "";

        fullName.classList.remove("input-error");
        email.classList.remove("input-error");
        password.classList.remove("input-error");
        confirmPassword.classList.remove("input-error");
    }


    /* =====================================================
       HELPER: EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value);
    }


    /* =====================================================
       PASSWORD STRENGTH
    ===================================================== */

    function checkPasswordStrength(value) {

        let score = 0;

        if (value.length >= 8) {
            score++;
        }

        if (/[A-Z]/.test(value)) {
            score++;
        }

        if (/[a-z]/.test(value)) {
            score++;
        }

        if (/[0-9]/.test(value)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(value)) {
            score++;
        }


        if (!value) {

            strengthFill.style.width = "0%";
            strengthText.textContent =
                "Password strength";

            return;
        }


        if (score <= 2) {

            strengthFill.style.width = "33%";
            strengthText.textContent =
                "Weak password";

        } else if (score <= 4) {

            strengthFill.style.width = "66%";
            strengthText.textContent =
                "Medium password";

        } else {

            strengthFill.style.width = "100%";
            strengthText.textContent =
                "Strong password";
        }
    }


    /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

    function setupPasswordToggle(
        input,
        button
    ) {

        if (!input || !button) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                if (
                    input.type ===
                    "password"
                ) {

                    input.type = "text";

                    button.textContent =
                        "Hide";

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    input.type = "password";

                    button.textContent =
                        "Show";

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );
                }
            }
        );
    }


    setupPasswordToggle(
        password,
        passwordToggle
    );

    setupPasswordToggle(
        confirmPassword,
        confirmPasswordToggle
    );


    /* =====================================================
       LIVE PASSWORD STRENGTH
    ===================================================== */

    password.addEventListener(
        "input",
        () => {

            checkPasswordStrength(
                password.value
            );

            passwordError.textContent = "";
            password.classList.remove(
                "input-error"
            );
        }
    );


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateForm() {

        let valid = true;

        clearErrors();


        /* FULL NAME */

        const name =
            fullName.value.trim();

        if (!name) {

            fullNameError.textContent =
                "Please enter your full name.";

            fullName.classList.add(
                "input-error"
            );

            valid = false;

        } else if (name.length < 2) {

            fullNameError.textContent =
                "Please enter a valid name.";

            fullName.classList.add(
                "input-error"
            );

            valid = false;
        }


        /* EMAIL */

        const emailValue =
            email.value.trim();

        if (!emailValue) {

            emailError.textContent =
                "Please enter your email address.";

            email.classList.add(
                "input-error"
            );

            valid = false;

        } else if (
            !isValidEmail(emailValue)
        ) {

            emailError.textContent =
                "Please enter a valid email address.";

            email.classList.add(
                "input-error"
            );

            valid = false;
        }


        /* PASSWORD */

        const passwordValue =
            password.value;

        if (!passwordValue) {

            passwordError.textContent =
                "Please create a password.";

            password.classList.add(
                "input-error"
            );

            valid = false;

        } else if (
            passwordValue.length < 8
        ) {

            passwordError.textContent =
                "Password must be at least 8 characters.";

            password.classList.add(
                "input-error"
            );

            valid = false;
        }


        /* CONFIRM PASSWORD */

        if (!confirmPassword.value) {

            confirmPasswordError.textContent =
                "Please confirm your password.";

            confirmPassword.classList.add(
                "input-error"
            );

            valid = false;

        } else if (
            confirmPassword.value !==
            passwordValue
        ) {

            confirmPasswordError.textContent =
                "Passwords do not match.";

            confirmPassword.classList.add(
                "input-error"
            );

            valid = false;
        }


        /* TERMS */

        if (!terms.checked) {

            termsError.textContent =
                "Please accept the Terms of Service and Privacy Policy.";

            valid = false;
        }


        return valid;
    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* VALIDATE */

            if (!validateForm()) {
                return;
            }


            /* PREPARE */

            const name =
                fullName.value.trim();

            const emailValue =
                email.value.trim()
                .toLowerCase();

            const passwordValue =
                password.value;


            /* DISABLE BUTTON */

            submitButton.disabled = true;

            submitText.textContent =
                "Creating Account...";

            formMessage.textContent = "";


            try {

                /* =========================================
                   CREATE SUPABASE AUTH ACCOUNT
                ========================================= */

                const {
                    data,
                    error
                } = await supabase.auth.signUp({

                    email: emailValue,

                    password: passwordValue,

                    options: {

                        data: {
                            full_name: name
                        },

                        emailRedirectTo:
                            window.location.origin +
                            "/nexus-login.html"
                    }
                });


                /* =========================================
                   HANDLE ERROR
                ========================================= */

                if (error) {

                    console.error(
                        "Supabase registration error:",
                        error
                    );

                    if (
                        error.message
                            .toLowerCase()
                            .includes("already registered")
                    ) {

                        emailError.textContent =
                            "An account with this email already exists.";

                        email.classList.add(
                            "input-error"
                        );

                    } else {

                        formMessage.textContent =
                            error.message;
                    }

                    return;
                }


                /* =========================================
                   SUCCESS
                ========================================= */

                console.log(
                    "Nexus account created:",
                    data
                );


                registerForm.reset();

                strengthFill.style.width =
                    "0%";

                strengthText.textContent =
                    "Password strength";


                formMessage.textContent =
                    "Account created successfully! Please check your email to confirm your account before logging in.";


            } catch (error) {

                console.error(
                    "Unexpected registration error:",
                    error
                );

                formMessage.textContent =
                    "Something went wrong. Please check your internet connection and try again.";

            } finally {

                /* =========================================
                   RE-ENABLE BUTTON
                ========================================= */

                submitButton.disabled =
                    false;

                submitText.textContent =
                    "Create Account";
            }
        }
    );


    /* =====================================================
       CLEAR FIELD ERRORS WHILE TYPING
    ===================================================== */

    fullName.addEventListener(
        "input",
        () => {

            fullNameError.textContent = "";

            fullName.classList.remove(
                "input-error"
            );
        }
    );


    email.addEventListener(
        "input",
        () => {

            emailError.textContent = "";

            email.classList.remove(
                "input-error"
            );
        }
    );


    confirmPassword.addEventListener(
        "input",
        () => {

            confirmPasswordError.textContent =
                "";

            confirmPassword.classList.remove(
                "input-error"
            );
        }
    );


    terms.addEventListener(
        "change",
        () => {

            termsError.textContent = "";
        }
    );

});

After replacing it

Save "nexus-register.js".

You should now have:

nexus-register.html
nexus-register.css
nexus-register.js

⚠️ One thing before testing

We have not yet created the "profiles" table. That's intentional.

The registration above uses Supabase Auth and stores the name temporarily in the user's Auth metadata. Once we confirm that registration works, we'll build the proper "profiles" table with Row Level Security and connect the user's profile to it.

So don't start creating database tables yourself yet.

After saving the JS file, open "nexus-register.html" and test with an email address you control. Do not use your Supabase account password unless you actually want to create Nexus with that email.

Tell me exactly what happens when you press Create Account.