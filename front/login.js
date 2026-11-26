import { buscarPorEmail } from "./api.js";

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

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!password.value) {
        loginStatus.textContent = "Digite sua senha usando o teclado virtual.";
        return;
    }

    const email = document.getElementById("email").value;

    let usuario = await buscarPorEmail(email);

    usuario = usuario[0]

    if(!usuario)
    {
        loginStatus.textContent = "E-mail não encontrado.";
        return;
    }

    if(password.value == usuario.Senha)
    {
        loginStatus.textContent = "Entrando...";
        localStorage.setItem("usuario", JSON.stringify(usuario));
        window.location.href = "vistoria.html";
    }
    else
        loginStatus.textContent = "Senha incorreta!";
});

document.getElementById("register").addEventListener("click", () => {
    window.location.href = "cadastro.html"
});
