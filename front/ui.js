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

    document.getElementById("id").value = usuario.ID_usuario;
    document.getElementById("nome").value = usuario.Nome;
    document.getElementById("email").value = usuario.Email;
    document.getElementById("tipoUsuario").value = usuario.Tipo_Usuario;
    document.getElementById("nVistorias").value = usuario.Num_Vistorias ?? "";
    document.getElementById("nOcorrencias").value = usuario.Num_Ocorrencias ?? "";
}