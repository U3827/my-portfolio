document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("loginForm");

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const formMessage =
        document.getElementById("formMessage");

    const forgotPassword =
        document.getElementById("forgotPassword");

    const year =
        document.getElementById("year");


    /* ================================
       YEAR
    ================================= */

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }


    /* ================================
       PASSWORD VISIBILITY
    ================================= */

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


    /* ================================
       LOGIN VALIDATION
    ================================= */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            let valid = true;

            const emailError =
                document.getElementById(
                    "emailError"
                );

            const passwordError =
                document.getElementById(
                    "passwordError"
                );


            emailError.textContent = "";
            passwordError.textContent = "";
            formMessage.textContent = "";


            /* EMAIL */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    email.value.trim()
                )
            ) {

                emailError.textContent =
                    "Please enter a valid email address.";

                email
                    .closest(".input-wrapper")
                    .classList.add("has-error");

                valid = false;

            } else {

                email
                    .closest(".input-wrapper")
                    .classList.remove(
                        "has-error"
                    );

            }


            /* PASSWORD */

            if (password.value.length === 0) {

                passwordError.textContent =
                    "Please enter your password.";

                password
                    .closest(".input-wrapper")
                    .classList.add("has-error");

                valid = false;

            } else {

                password
                    .closest(".input-wrapper")
                    .classList.remove(
                        "has-error"
                    );

            }


            /* FRONTEND DEMO MESSAGE */

            if (valid) {

                formMessage.style.color =
                    "#8b85ff";

                formMessage.textContent =
                    "Login details are valid. Authentication will be connected to PHP + MySQL next.";

            }

        }
    );


    /* ================================
       FORGOT PASSWORD
    ================================= */

    forgotPassword.addEventListener(
        "click",
        event => {

            event.preventDefault();

            formMessage.style.color =
                "#8b85ff";

            formMessage.textContent =
                "Password recovery will be added with the authentication system.";

        }
    );

});
