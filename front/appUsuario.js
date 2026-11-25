import {
    listarUsuarios,
    buscarPorId,
    buscarPorTipo,
    salvarPet,
    atualizarPet,
    excluirPet,
    listarCaminhoes,
    agendarVistoria
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
//import { describe } from 'node:test';

import { Usuario } from '../classes/Usuario.js';

let usuarios = [];

let paginaAtual = 1;

const itensPorPagina = 5;

window.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("formVistoria")) {
        inicializarVistoria();
        return;
    }

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

async function carregarPets() {

    let dados = await listarUsuarios();

    usuarios = dados.map(usuario  => {
        return new Usuario(
            usuario.Nome,
            usuario.ID_usuario,
            usuario.Email,
            usuario.Num_Vistorias,
            usuario.Num_Ocorrencias,
            usuario.Data_Adesao,
            usuario.Tipo_Usuario
        )
    })

    paginaAtual = 1;

    renderizarTabela();
}

function renderizarTabela() {

    const tbody =
        document.getElementById("tbodyUsuarios");

    tbody.innerHTML = "";

    const pagina =
        paginate(
            usuarios,
            paginaAtual,
            itensPorPagina
        );

    pagina.forEach(usuario => {

        tbody.innerHTML += `
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

function renderizarPaginas() {

    const qtd =
        Math.ceil(
            pets.length /
            itensPorPagina
        );

    let html = '';

    for (let i = 1; i <= qtd; i++) {

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

window.irPagina = function (pagina) {

    paginaAtual = pagina;

    renderizarTabela();
}

window.editar = async function (id) {

    const usuario =
        await buscarPorId(id);

    console.log(usuario)

    preencherFormulario(usuario[0]);
}

window.remover = async function (id) {

    if (!confirm("Deseja excluir?"))
        return;

    await excluirUsuario(id);

    mostrarMensagem(
        "Usuário removido",
        "sucesso"
    );

    carregarUsuarios();
}


async function salvar() {

    const id = document.getElementById("id").value;

    const usuario = {

        Nome:
        document.getElementById("nome").value,

        Email:
        document.getElementById("email").value,

        Tipo_Usuario:
        document.getElementById("tipoUsuario").value,

        Num_Vistorias:
        Number(
            document.getElementById("nVistorias").value
        ),

        Num_Ocorrencias:
        Number(
            document.getElementById("nOcorrencias").value
        )
    };

    const erros = validarUsuario(usuario);

    if (erros.length > 0) {

        mostrarMensagem(
            erros.join(" | "),
            "erro"
        );

        return;
    }

    try {

        if(id){
            console.log(id)
            console.log(usuario)

            await atualizarUsuario(id, usuario);

            mostrarMensagem(
                "Usuário atualizado",
                "sucesso"
            );
        }
        else {

            usuario.Data_Adesao = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`

            console.log(usuario)

            await salvarUsuario(usuario);

            mostrarMensagem(
                "Usuário cadastrado",
                "sucesso"
            );
        }

        limparFormulario();

        carregarUsuarios();

    } catch (erro) {

        mostrarMensagem(
            erro.message,
            "erro"
        );
    }
}

async function pesquisarTipo(tipo) {

    console.log(`Filtrando por: ${tipo}`)

    if (tipo === "todos") {

        carregarUsuarios();

        return;
    }

    pets =
        await buscarPorTipo(tipo);

    usuarios = dados.map(usuario => {
        return new Usuario(
            usuario.Nome,
            usuario.ID_usuario,
            usuario.Email,
            usuario.Num_Vistorias,
            usuario.Num_Ocorrencias,
            usuario.Data_Adesao,
            usuario.Tipo_Usuario        
        )
    })

    paginaAtual = 1;

    renderizarTabela();
}


async function inicializarVistoria() {
    const form = document.getElementById("formVistoria");
    try {
        const [caminhoes, operadores] = await Promise.all([
            listarCaminhoes(),
            buscarPorTipo("operador")
        ]);
        carregarCaminhoes(caminhoes);
        carregarOperadores(operadores);

    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        alert("Erro ao carregar os dados!");
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const horario = document.getElementById("horarioPrevisto").value;
        const itensSelecionados = Array.from(document.querySelectorAll('input[name="itensVistoria"]:checked')).map(item => item.value)
        const vistoria = {
            ID_Analista: 5, //Hardcodado pq ainda não temos login para verificar o id do usuario
            ID_Operador: Number(document.getElementById("operador").value),
            Placa: document.getElementById("placaCaminhao").value,
            Data_Prevista: document.getElementById("dataPrevista").value,
            Horario_Previsto: horario + ":00",
            Descricao: document.getElementById("observacao").value || null,
            Itens: itensSelecionados
        };

        try {
            const resultado = await agendarVistoria(vistoria);
            alert(resultado.msg);
            form.reset();
        } catch (error) {
            console.error("Erro ao agendar vistoria:", error);
            alert("Falha ao realizar agendamento");
        }
    });
}

function carregarCaminhoes(caminhoes) {
    const select = document.getElementById("placaCaminhao");
    select.innerHTML = `<option value="">Selecione o caminhão</option>`;
    caminhoes.forEach(caminhao => {
        const option = document.createElement("option");
        option.value = caminhao.Placa;
        option.textContent = `${caminhao.Placa} - ${caminhao.Marca} - ${caminhao.Modelo}`;
        select.appendChild(option);
    });
}

function carregarOperadores(operadores) {
    const select = document.getElementById("operador");
    select.innerHTML = `<option value="">Selecione o operador</option>`;
    operadores.forEach(operador => {
        const option = document.createElement("option");
        option.value = operador.idUsuario;
        option.textContent = operador.nome;
        select.appendChild(option);
    });
}
