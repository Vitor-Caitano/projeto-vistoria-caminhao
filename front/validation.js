export function validarUsuario(usuario){

    let erros = [];

    if(!usuario.nome)
        erros.push("Informe o nome");

    if(!usuario.email)
        erros.push("Informe o email");

    if(!usuario.tipoUsuario)
        erros.push("Informe o tipo de usuário");

    return erros;
}