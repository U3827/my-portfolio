document.addEventListener("DOMContentLoaded", () => {

    const form =
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
        document.getElementById(
            "confirmPasswordToggle"
        );

    const strengthFill =
        document.getElementById("strengthFill");

    const strengthText =
        document.getElementById("strengthText");

    const formMessage =
        document.getElementById("formMessage");


    /* ================================
       CURRENT YEAR
    ================================= */

    const year =
        document.getElementById("year");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    /* ================================
       PASSWORD VISIBILITY
    ================================= */

    function setupPasswordToggle(
        button,
        input
    ) {

        if (!button || !input) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                if (input.type === "password") {

                    input.type = "text";
                    button.textContent = "Hide";

                } else {

                    input.type = "password";
                    button.textContent = "Show";

                }

            }
        );

    }

    setupPasswordToggle(
        passwordToggle,
        password
    );

    setupPasswordToggle(
        confirmPasswordToggle,
        confirmPassword
    );


    /* ================================
       PASSWORD STRENGTH
    ================================= */

    password.addEventListener(
        "input",
        () => {

            const value =
                password.value;

            let score = 0;

            if (value.length >= 8) {
                score++;
            }

            if (/[A-Z]/.test(value)) {
                score++;
            }

            if (/[0-9]/.test(value)) {
                score++;
            }

            if (/[^A-Za-z0-9]/.test(value)) {
                score++;
            }


            if (value.length === 0) {

                strengthFill.style.width = "0%";
                strengthText.textContent =
                    "Password strength";

            } else if (score <= 1) {

                strengthFill.style.width = "25%";
                strengthText.textContent =
                    "Weak";

            } else if (score === 2) {

                strengthFill.style.width = "50%";
                strengthText.textContent =
                    "Fair";

            } else if (score === 3) {

                strengthFill.style.width = "75%";
                strengthText.textContent =
                    "Good";

            } else {

                strengthFill.style.width = "100%";
                strengthText.textContent =
                    "Strong";

            }

        }
    );


    /* ================================
       HELPERS
    ================================= */

    function showError(
        input,
        errorId,
        message
    ) {

        const error =
            document.getElementById(errorId);

        const wrapper =
            input.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.add("has-error");
            wrapper.classList.remove(
                "has-success"
            );
        }

        if (error) {
            error.textContent = message;
        }

    }


    function clearError(
        input,
        errorId
    ) {

        const error =
            document.getElementById(errorId);

        const wrapper =
            input.closest(".input-wrapper");

        if (wrapper) {
            wrapper.classList.remove(
                "has-error"
            );
        }

        if (error) {
            error.textContent = "";
        }

    }


    /* ================================
       FORM SUBMISSION
    ================================= */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            let valid = true;

            formMessage.textContent = "";


            /* FULL NAME */

            if (
                fullName.value.trim().length < 2
            ) {

                showError(
                    fullName,
                    "fullNameError",
                    "Please enter your full name."
                );

                valid = false;

            } else {

                clearError(
                    fullName,
                    "fullNameError"
                );

            }


            /* EMAIL */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                showError(
                    email,
                    "emailError",
                    "Please enter a valid email address."
                );

                valid = false;

            } else {

                clearError(
                    email,
                    "emailError"
                );

            }


            /* PASSWORD */

            if (password.value.length < 8) {

                showError(
                    password,
                    "passwordError",
                    "Password must be at least 8 characters."
                );

                valid = false;

            } else {

                clearError(
                    password,
                    "passwordError"
                );

            }


            /* CONFIRM PASSWORD */

            if (
                confirmPassword.value !==
                password.value
            ) {

                showError(
                    confirmPassword,
                    "confirmPasswordError",
                    "Passwords do not match."
                );

                valid = false;

            } else {

                clearError(
                    confirmPassword,
                    "confirmPasswordError"
                );

            }


            /* TERMS */

            const termsError =
                document.getElementById(
                    "termsError"
                );

            if (!terms.checked) {

                termsError.textContent =
                    "Please accept the terms to continue.";

                valid = false;

            } else {

                termsError.textContent = "";

            }


            /* SUCCESS */

            if (valid) {

                formMessage.style.color =
                    "#42d392";

                formMessage.textContent =
                    "Account details are valid. Backend connection will be added next.";

            }

        }
    );

});
