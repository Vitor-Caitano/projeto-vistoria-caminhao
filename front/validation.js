export function validarPet(pet){

    let erros = [];

    if(!pet.nome)
        erros.push("Informe o nome");

    if(!pet.especie)
        erros.push("Informe a espécie");

    if(!pet.raca)
        erros.push("Informe a raça");

    if(!pet.dono)
        erros.push("Informe o dono");

    if(!pet.tipo)
        erros.push("Informe o tipo");

    if(!pet.idade || pet.idade <= 0)
        erros.push("Idade inválida");

    return erros;
}