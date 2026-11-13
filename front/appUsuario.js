import {
    listarUsuarios,
    buscarPorId,
    buscarPorTipo,
    salvarUsuario,
    atualizarUsuario,
    excluirUsuario
} from './api.js';

import {
    mostrarMensagem,
    limparFormulario,
    preencherFormulario
} from './ui.js';

import {
    validarUsuario
} from './validation.js';

import {
    paginate
} from './pagination.js';

import { Usuario } from '../classes/usuario.js';

let usuarios = [];

let paginaAtual = 1;

const itensPorPagina = 5;

window.addEventListener("DOMContentLoaded",()=>{

    carregarUsuarios();

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

async function carregarUsuarios(){

    usuarios = await listarUsuarios();

    usuarios = usuarios.map(usuario  => {
        return new Usuario(
            usuario.nome,
            usuario.idUsuario,
            usuario.email,
            usuario.numVistorias,
            usuario.numOcorrencias,
            usuario.dataAdesao,
            usuario.tipoUsuario
        )
    })

    paginaAtual = 1;

    renderizarTabela();
}

function renderizarTabela(){

    const tbody =
        document.getElementById("tbodyUsuarios");

    tbody.innerHTML="";

    const pagina =
        paginate(
            usuarios,
            paginaAtual,
            itensPorPagina
        );

    pagina.forEach(usuario=>{

        tbody.innerHTML+=`
        <tr>
            <td>${usuario.getId()}</td>
            <td>${usuario.getNome()}</td>
            <td>${usuario.getEmail()}</td>
            <td>${usuario.getTipo()}</td>
            <td>${usuario.getAdesao().split('T')[0]}</td>
            <td>${usuario.getNumVistorias()}</td>
            <td>${usuario.getNumOcorrencias()}</td>

            <td>

                <button
                    onclick="editar(${usuario.getId()})">
                    Editar
                </button>

                <button
                    onclick="remover(${usuario.getId()})">
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
          usuarios.length /
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

    const usuario =
        await buscarPorId(id);

    console.log(usuario)

    preencherFormulario(usuario[0]);
}

window.remover = async function(id){

    if(!confirm("Deseja excluir?"))
        return;

    await excluirUsuario(id);

    mostrarMensagem(
        "Usuário removido",
        "sucesso"
    );

    carregarUsuarios();
}


async function salvar() {

    const id =
        document.getElementById("id").value;

    const usuario = {

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

    const erros = validarUsuario(usuario);

    if(erros.length > 0){

        mostrarMensagem(
            erros.join(" | "),
            "erro"
        );

        return;
    }

    try{

        if(id){
            console.log(usuario)

            await atualizarUsuario(id, usuario);

            mostrarMensagem(
                "Usuário atualizado",
                "sucesso"
            );
        }
        else{

            usuario.dataAdesao = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`

            console.log(usuario)

            await salvarUsuario(usuario);

            mostrarMensagem(
                "Usuário cadastrado",
                "sucesso"
            );
        }

        limparFormulario();

        carregarUsuarios();

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

        carregarUsuarios();

        return;
    }

    usuarios =
      await buscarPorTipo(tipo);

    paginaAtual = 1;

    renderizarTabela();
}

