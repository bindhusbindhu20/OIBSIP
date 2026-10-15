// Get current page
const currentPage = window.location.pathname;


// ===============================
// PASSWORD HASHING
// ===============================

async function hashPassword(password) {

    const data = new TextEncoder().encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// ===============================
// REGISTER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const username = document
            .getElementById("username")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        const message = document.getElementById("registerMessage");


        // Empty validation

        if (username === "" || password === "") {

            message.textContent = "Please fill in all fields.";
            message.style.color = "red";

            return;
        }


        // Password validation

        if (password.length < 8) {

            message.textContent =
                "Password must contain at least 8 characters.";

            message.style.color = "red";

            return;
        }


        if (!/[0-9]/.test(password)) {

            message.textContent =
                "Password must contain at least 1 number.";

            message.style.color = "red";

            return;
        }


        // Get existing users

        const users =
            JSON.parse(localStorage.getItem("users")) || [];


        // Check duplicate username/email

        const existingUser = users.find(
            user => user.username.toLowerCase() === username.toLowerCase()
        );


        if (existingUser) {

            message.textContent =
                "This username or email is already registered.";

            message.style.color = "red";

            return;
        }


        // Hash password

        const hashedPassword =
            await hashPassword(password);


        // Create new user

        const newUser = {
            username: username,
            password: hashedPassword
        };


        users.push(newUser);


        // Save user

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        message.textContent =
            "Registration successful! Redirecting...";

        message.style.color = "green";


        // Go to login page

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1000);

    });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const username = document
            .getElementById("loginUsername")
            .value
            .trim();

        const password = document
            .getElementById("loginPassword")
            .value;

        const message =
            document.getElementById("loginMessage");


        // Empty validation

        if (username === "" || password === "") {

            message.textContent =
                "Please enter your username and password.";

            message.style.color = "red";

            return;
        }


        // Get users

        const users =
            JSON.parse(localStorage.getItem("users")) || [];


        // Find user

        const user = users.find(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
        );


        // Hash entered password

        const hashedPassword =
            await hashPassword(password);


        // Check credentials

        if (!user || user.password !== hashedPassword) {

            message.textContent =
                "Invalid username or password.";

            message.style.color = "red";

            return;
        }


        // Create login session

        localStorage.setItem(
            "loggedInUser",
            user.username
        );


        // Go to dashboard

        window.location.href = "dashboard.html";

    });
}


// ===============================
// DASHBOARD PROTECTION
// ===============================

if (
    currentPage.includes("dashboard.html")
) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");


    // If not logged in, go to login

    if (!loggedInUser) {

        window.location.href = "login.html";

    } else {

        const welcomeUser =
            document.getElementById("welcomeUser");

        if (welcomeUser) {

            welcomeUser.textContent =
                "Welcome, " + loggedInUser + "!";

        }

    }
}


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");

        window.location.href = "login.html";

    });

}