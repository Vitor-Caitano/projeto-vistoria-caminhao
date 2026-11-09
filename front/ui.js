export function mostrarMensagem(texto,tipo){

    const div =
        document.getElementById("mensagem");

    div.className = tipo;
    div.innerText = texto;

    setTimeout(()=>{
        div.innerHTML="";
        div.className="";
    },3000);
}

export function limparFormulario(){

    document.getElementById("id").value="";
    document.getElementById("nome").value="";
    document.getElementById("especie").value="";
    document.getElementById("raca").value="";
    document.getElementById("idade").value="";
    document.getElementById("dono").value="";
    document.getElementById("tipo").value="";
}

export function preencherFormulario(pet){

    document.getElementById("id").value = pet.id;
    document.getElementById("nome").value = pet.nome;
    document.getElementById("especie").value = pet.especie;
    document.getElementById("raca").value = pet.raca;
    document.getElementById("idade").value = pet.idade;
    document.getElementById("dono").value = pet.dono;
    document.getElementById("tipo").value = pet.tipo;
}