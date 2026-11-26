import { salvarUsuario } from "./api.js";
import { Usuario } from "../classes/usuario.js";

const form = document.getElementById("cadastroForm");
const cadastroStatus = document.getElementById("cadastroStatus");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if(!document.getElementById("email").value) {
        cadastroStatus.textContent = "Email vazio!";
        return;
    }

    if(!document.getElementById("nome").value) {
        cadastroStatus.textContent = "Nome vazio!";
        return;
    }

    if(!document.getElementById("senha").value) {
        cadastroStatus.textContent = "Senha vazia!";
        return;
    }

    if(!document.getElementById("senhaRepetir").value) {
        cadastroStatus.textContent = "É necessário preencher a confirmação de senha.";
        return;
    }

    if(!verificarEmail(document.getElementById("email").value)) {
        cadastroStatus.textContent = "Digite um email válido com domínio correto.";
        return;
    }

    if(!verificarNome(document.getElementById("nome").value)) {
        cadastroStatus.textContent = "Números e símbolos não são aceitos para nome.";
        return;
    }

    if(!verificarSenha(document.getElementById("senha").value)) {
        cadastroStatus.textContent = "A senha só pode conter valores numéricos.";
        return;
    }

    if(document.getElementById("senha").value != document.getElementById("senhaRepetir").value) {
        cadastroStatus.textContent = "Senhas não conferem!";
        return;        
    }

    let tipoUsuario;
    if(parseInt(document.getElementById("tipoUsuario").value) == 1)
        tipoUsuario = "analista";
    else
        tipoUsuario = "operador";

    let data = new Date();
    let ano = data.getFullYear();
    let mes = data.getMonth()+1;
    let mesCorrigido = String(mes).padStart(2, '0');
    let dia = String(data.getDate()).padStart(2, '0');

    let usuario = new Usuario(
        document.getElementById("nome").value,
        document.getElementById("email").value,
        `${ano}-${mesCorrigido}-${dia}`,
        tipoUsuario,
        document.getElementById("senha").value
    )

    try {
        cadastroStatus.textContent = "Salvando cadastro...";
        const resultado = await salvarUsuario(usuario);
        cadastroStatus.textContent = "Cadastro realizado com sucesso!";
    }
    catch(error) {
        cadastroStatus.textContent = "Erro com o cadastro. Tente novamente.";
    }
})

document.getElementById("voltarLogin").addEventListener("click", () => {
    window.location.href = "login.html"
});

function verificarEmail(email)
{
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if(!regex.test(email))
        return false;

    return true;
}

function verificarNome(nome)
{
    const regex = /^[^@\$%&()"*#/0-9]+$/;

    if(!regex.test(nome))
        return false;

    return true;
}

function verificarSenha(senha)
{
    const regex = /^[0-9]+$/;

    if(!regex.test(senha))
        return false;

    return true;
}