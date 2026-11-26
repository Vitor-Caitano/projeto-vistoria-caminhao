const form = document.getElementById("loginForm");
const password = document.getElementById("password");
const loginStatus = document.getElementById("loginStatus");
const keypad = document.querySelector(".virtual-keypad__grid");

keypad.addEventListener("click", (event) => {
    const key = event.target.closest("button");

    if (!key) {
        return;
    }

    if (key.dataset.digit) {
        if (password.value.length < 40) {
            password.value += key.dataset.digit;
        }
    } else if (key.dataset.action === "backspace") {
        password.value = password.value.slice(0, -1);
    } else if (key.dataset.action === "clear") {
        password.value = "";
    }

    loginStatus.textContent = "";
    password.focus();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!password.value) {
        loginStatus.textContent = "Digite sua senha usando o teclado virtual.";
        return;
    }

    loginStatus.textContent = "A autenticação ainda não está conectada ao servidor.";
});

document.getElementById("forgotPassword").addEventListener("click", () => {
    loginStatus.textContent = "Para redefinir sua senha, solicite ajuda ao administrador.";
});

document.getElementById("register").addEventListener("click", () => {
    loginStatus.textContent = "Para solicitar acesso, entre em contato com o administrador.";
});
