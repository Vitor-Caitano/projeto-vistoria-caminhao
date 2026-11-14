export function validarUsuario(usuario){

    let erros = [];

    if(!usuario.Nome)
        erros.push("Informe o nome");

    if(!usuario.Email)
        erros.push("Informe o email");

    if(!usuario.Tipo_Usuario)
        erros.push("Informe o tipo de usuário");

    return erros;
}