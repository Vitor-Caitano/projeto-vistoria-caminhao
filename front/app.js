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


    let botoesFiltro = [
        document.getElementById('fTodos'),
        document.getElementById('analistas'),
        document.getElementById('operadores')
    ]


    document
    .getElementById('fTodos')
    .addEventListener('click', () => {
         pesquisarTipo("todos")

         botoesFiltro.forEach(botao => botao.classList.remove('ativado'))

         document.getElementById('fTodos').classList.add('ativado')
    })

    document
    .getElementById('analistas')
    .addEventListener('click', () => {
         pesquisarTipo("analista")

         botoesFiltro.forEach(botao => botao.classList.remove('ativado'))

         document.getElementById('analistas').classList.add('ativado')
    })

    document
    .getElementById('operadores')
    .addEventListener('click', () => {
         pesquisarTipo("operador")

         botoesFiltro.forEach(botao => botao.classList.remove('ativado'))

         document.getElementById('operadores').classList.add('ativado')
    })

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

    pagina.forEach(usuario=>{

        tbody.innerHTML+=`
        <tr>
            <td>${usuario.idUsuario}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.tipoUsuario}</td>
            <td>${usuario.dataAdesao.split('T')[0]}</td>
            <td>${usuario.numVistorias}</td>
            <td>${usuario.numOcorrencias}</td>

            <td>

                <button
                    onclick="editar(${usuario.idUsuario})">
                    Editar
                </button>

                <button
                    onclick="remover(${usuario.idUsuario})">
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

    console.log(pet)

    preencherFormulario(pet[0]);
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

        email:
        document.getElementById("email").value,

        tipoUsuario:
        document.getElementById("tipoUsuario").value,

        numVistorias:
        Number(
            document.getElementById("nVistorias").value
        ),

        numOcorrencias:
        Number(
            document.getElementById("nOcorrencias").value
        )
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
            console.log(pet)

            await atualizarPet(id, pet);

            mostrarMensagem(
                "Pet atualizado",
                "sucesso"
            );
        }
        else{

            pet.dataAdesao = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`

            console.log(pet)

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

async function pesquisarTipo(tipo){

    console.log(`Filtrando por: ${tipo}`)

    if(tipo==="todos"){

        carregarPets();

        return;
    }

    pets =
      await buscarPorTipo(tipo);

    paginaAtual = 1;

    renderizarTabela();
}

