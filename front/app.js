import {
    listarPets,
    buscarPorId,
    buscarPorTipo,
    salvarPet,
    atualizarPet,
    excluirPet
} from './api.js';

import {
    mostrarMensagem,
    limparFormulario,
    preencherFormulario
} from './ui.js';

import {
    validarPet
} from './validation.js';

import {
    paginate
} from './pagination.js';

let pets = [];

let paginaAtual = 1;

const itensPorPagina = 5;

window.addEventListener("DOMContentLoaded",()=>{

    carregarPets();

    document
    .getElementById("btnSalvar")
    .addEventListener("click", salvar);

    document
    .getElementById("btnNovo")
    .addEventListener("click",
        limparFormulario);

    document
    .getElementById("btnBuscarTipo")
    .addEventListener("click",
        pesquisarTipo);

    document
    .getElementById("btnListarTodos")
    .addEventListener("click",
        carregarPets);
});

async function carregarPets(){

    pets = await listarPets();

    paginaAtual = 1;

    renderizarTabela();
}

function renderizarTabela(){

    const tbody =
        document.getElementById("tbodyPets");

    tbody.innerHTML="";

    const pagina =
        paginate(
            pets,
            paginaAtual,
            itensPorPagina
        );

    pagina.forEach(pet=>{

        tbody.innerHTML+=`
        <tr>
            <td>${pet.id}</td>
            <td>${pet.nome}</td>
            <td>${pet.especie}</td>
            <td>${pet.raca}</td>
            <td>${pet.idade}</td>
            <td>${pet.dono}</td>
            <td>${pet.tipo}</td>

            <td>

            <button
             onclick="editar(${pet.id})">
             Editar
            </button>

            <button
             onclick="remover(${pet.id})">
             Excluir
            </button>

            </td>
        </tr>
        `;
    });

    renderizarPaginas();
}

function renderizarPaginas(){

    const qtd =
        Math.ceil(
          pets.length /
          itensPorPagina
        );

    let html='';

    for(let i=1;i<=qtd;i++){

        html += `
        <button
        onclick="irPagina(${i})">
        ${i}
        </button>
        `;
    }

    document
    .getElementById("pagination")
    .innerHTML = html;
}

window.irPagina = function(pagina){

    paginaAtual = pagina;

    renderizarTabela();
}

window.editar = async function(id){

    const pet =
        await buscarPorId(id);

    preencherFormulario(pet);
}

window.remover = async function(id){

    if(!confirm("Deseja excluir?"))
        return;

    await excluirPet(id);

    mostrarMensagem(
        "Pet removido",
        "sucesso"
    );

    carregarPets();
}


async function salvar() {

    const id =
        document.getElementById("id").value;

    const pet = {

        nome:
        document.getElementById("nome").value,

        especie:
        document.getElementById("especie").value,

        raca:
        document.getElementById("raca").value,

        idade:
        Number(
            document.getElementById("idade").value
        ),

        dono:
        document.getElementById("dono").value,

        tipo:
        document.getElementById("tipo").value
    };

    const erros = validarPet(pet);

    if(erros.length > 0){

        mostrarMensagem(
            erros.join(" | "),
            "erro"
        );

        return;
    }

    try{

        if(id){

            pet.id = Number(id);

            await atualizarPet(pet);

            mostrarMensagem(
                "Pet atualizado",
                "sucesso"
            );
        }
        else{

            await salvarPet(pet);

            mostrarMensagem(
                "Pet cadastrado",
                "sucesso"
            );
        }

        limparFormulario();

        carregarPets();

    }catch(erro){

        mostrarMensagem(
            erro.message,
            "erro"
        );
    }
}

async function pesquisarTipo(){

    const tipo =
      document
      .getElementById("tipoBusca")
      .value;

    if(tipo===""){

        carregarPets();

        return;
    }

    pets =
      await buscarPorTipo(tipo);

    paginaAtual = 1;

    renderizarTabela();
}