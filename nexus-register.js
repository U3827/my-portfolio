/* =========================================================
   NEXUS REGISTRATION
   SUPABASE AUTHENTICATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SUPABASE CONFIGURATION
    ===================================================== */

    const SUPABASE_URL =
        "https://rjtzurluhylqvfbwajwv.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";


    /* =====================================================
       PAGE ELEMENTS
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
        document.querySelector(".create-account-btn");

    const submitText =
        submitButton
            ? submitButton.querySelector("span")
            : null;

    const year =
        document.getElementById("year");


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
       CURRENT YEAR
    ===================================================== */

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       MESSAGE FUNCTIONS
    ===================================================== */

    function showMessage(message) {

        if (formMessage) {
            formMessage.textContent = message;
        }
    }


    function clearMessage() {

        if (formMessage) {
            formMessage.textContent = "";
        }
    }


    /* =====================================================
       CHECK SUPABASE LIBRARY
    ===================================================== */

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {

        showMessage(
            "Nexus could not load the authentication service. Please check your internet connection and refresh the page."
        );

        return;
    }


    /* =====================================================
       CREATE SUPABASE CLIENT
    ===================================================== */

    const supabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );


    /* =====================================================
       PASSWORD TOGGLE
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
                    input.type === "password"
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
       PASSWORD STRENGTH
    ===================================================== */

    function updatePasswordStrength(value) {

        if (!strengthFill || !strengthText) {
            return;
        }

        if (!value) {

            strengthFill.style.width =
                "0%";

            strengthText.textContent =
                "Password strength";

            return;
        }

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


        if (score <= 2) {

            strengthFill.style.width =
                "33%";

            strengthText.textContent =
                "Weak password";

        } else if (score <= 4) {

            strengthFill.style.width =
                "66%";

            strengthText.textContent =
                "Medium password";

        } else {

            strengthFill.style.width =
                "100%";

            strengthText.textContent =
                "Strong password";
        }
    }


    password.addEventListener(
        "input",
        () => {

            updatePasswordStrength(
                password.value
            );

            passwordError.textContent =
                "";

            password.classList.remove(
                "input-error"
            );
        }
    );


    /* =====================================================
       CLEAR ERRORS
    ===================================================== */

    function clearErrors() {

        fullNameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        termsError.textContent = "";

        fullName.classList.remove(
            "input-error"
        );

        email.classList.remove(
            "input-error"
        );

        password.classList.remove(
            "input-error"
        );

        confirmPassword.classList.remove(
            "input-error"
        );
    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value);
    }


    /* =====================================================
       FORM VALIDATION
    ===================================================== */

    function validateForm() {

        let valid = true;

        clearErrors();
        clearMessage();


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
            email.value.trim()
                .toLowerCase();

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

        if (!password.value) {

            passwordError.textContent =
                "Please create a password.";

            password.classList.add(
                "input-error"
            );

            valid = false;

        } else if (
            password.value.length < 8
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
            password.value
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
       REGISTRATION
    ===================================================== */

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* VALIDATE */

            if (!validateForm()) {
                return;
            }


            const name =
                fullName.value.trim();

            const emailValue =
                email.value.trim()
                    .toLowerCase();

            const passwordValue =
                password.value;


            /* BUTTON STATE */

            if (submitButton) {
                submitButton.disabled = true;
            }

            if (submitText) {
                submitText.textContent =
                    "Creating Account...";
            }

            showMessage(
                "Creating your Nexus account..."
            );


            try {

                /* =========================================
                   SUPABASE SIGN UP
                ========================================= */

                const result =
                    await supabase.auth.signUp({

                        email: emailValue,

                        password: passwordValue,

                        options: {

                            data: {
                                full_name: name
                            }
                        }
                    });


                const data =
                    result.data;

                const error =
                    result.error;


                /* =========================================
                   SUPABASE ERROR
                ========================================= */

                if (error) {

                    console.error(
                        "Nexus Supabase error:",
                        error
                    );

                    const errorMessage =
                        error.message ||
                        "Registration failed.";

                    if (
                        errorMessage
                            .toLowerCase()
                            .includes(
                                "already registered"
                            ) ||
                        errorMessage
                            .toLowerCase()
                            .includes(
                                "already exists"
                            )
                    ) {

                        emailError.textContent =
                            "An account with this email already exists.";

                        email.classList.add(
                            "input-error"
                        );

                        showMessage("");

                    } else {

                        showMessage(
                            errorMessage
                        );
                    }

                    return;
                }


                /* =========================================
                   SUCCESS
                ========================================= */

                console.log(
                    "Nexus registration successful:",
                    data
                );


                if (
                    data &&
                    data.user
                ) {

                    registerForm.reset();

                    updatePasswordStrength(
                        ""
                    );


                    if (
                        data.session
                    ) {

                        showMessage(
                            "Your Nexus account has been created successfully. You can now log in."
                        );

                    } else {

                        showMessage(
                            "Your Nexus account has been created. Please check your email and confirm your account before logging in."
                        );
                    }

                } else {

                    showMessage(
                        "Registration completed. Please check your email for confirmation."
                    );
                }


            } catch (error) {

                console.error(
                    "Nexus registration exception:",
                    error
                );

                showMessage(
                    "Unable to connect to Nexus authentication. Please check your internet connection and try again."
                );


            } finally {

                if (submitButton) {
                    submitButton.disabled =
                        false;
                }

                if (submitText) {
                    submitText.textContent =
                        "Create Account";
                }
            }
        }
    );


    /* =====================================================
       LIVE ERROR CLEARING
    ===================================================== */

    fullName.addEventListener(
        "input",
        () => {

            fullNameError.textContent =
                "";

            fullName.classList.remove(
                "input-error"
            );
        }
    );


    email.addEventListener(
        "input",
        () => {

            emailError.textContent =
                "";

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

            termsError.textContent =
                "";
        }
    );

});

Save the complete file as "nexus-register.js".

Then refresh the registration page and press Create Account once.

This version is specifically designed to show an error on the page if Supabase cannot load or the registration request fails, instead of silently doing nothing.

If it works, you should see a message telling you that the account was created and that you need to confirm your email. Then we'll check Authentication → Users.