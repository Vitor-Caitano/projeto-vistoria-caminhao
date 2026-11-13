let temporizadorMensagem;

export function mostrarMensagem(texto,tipo){

    const div =
        document.getElementById("mensagem");

    clearTimeout(temporizadorMensagem);
    div.className = tipo;
    div.textContent = texto;

    temporizadorMensagem = setTimeout(()=>{
        div.textContent="";
        div.className="";
    },3000);
}

export function limparFormulario(){

    document.getElementById("id").value="";
    document.getElementById("nome").value="";
    document.getElementById("email").value="";
    document.getElementById("tipoUsuario").value="analista";
    document.getElementById("nVistorias").value="";
    document.getElementById("nOcorrencias").value="";
}

export function preencherFormulario(usuario){

    document.getElementById("id").value = usuario.idUsuario;
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
    document.getElementById("tipoUsuario").value = usuario.tipoUsuario;
    document.getElementById("nVistorias").value = usuario.numVistorias ?? "";
    document.getElementById("nOcorrencias").value = usuario.numOcorrencias ?? "";
}