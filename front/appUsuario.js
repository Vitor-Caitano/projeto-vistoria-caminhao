import {
    buscarPorTipo,
    buscarPorId,
    listarCaminhoes,
    agendarVistoria,
    buscarPorIdVistorias
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

import './popupCaminhao.js';
import { Vistoria } from '../../classes/Vistoria.js';

let usuarios = [];

let paginaAtual = 1;

const itensPorPagina = 5;

window.addEventListener("DOMContentLoaded", () => {
    const usuario = localStorage.getItem("usuario")
    if(usuario == null)
        window.location.href = "login.html"

    if(JSON.parse(usuario).tipoUsuario == "analista")
        document.getElementById("menuOperador").style.display = "none";

    document.getElementById('deslogar').addEventListener('click', () => {
        localStorage.removeItem("usuario");
        window.location.href = "login.html"
    })

    const urlParams = new URLSearchParams(window.location.search);
    const codVistoria = urlParams.get('cod');

    if (document.getElementById("formVistoria")) {
        inicializarVistoria(codVistoria);
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

});

async function carregarPets() {

    let dados = await listarUsuarios();

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

        if (id) {
            console.log(id)
            console.log(usuario)

            await atualizarUsuario(id, usuario);

            mostrarMensagem(
                "Usuário atualizado",
                "sucesso"
            );
        }
        else {

            usuario.Data_Adesao = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`

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


async function inicializarVistoria(codVistoria) {
    const form = document.getElementById("formVistoria");
    try {
        const [caminhoes, operadores] = await Promise.all([
            listarCaminhoes(),
            buscarPorTipo("operador")
        ]);
        carregarCaminhoes(caminhoes);
        carregarOperadores(operadores);

        if(codVistoria)
        {
            const dadosVistoria = await buscarPorIdVistorias(codVistoria);

            const vistoria = dadosVistoria[0]

            console.log(vistoria)

            if(vistoria)
            {
                document.getElementById("placaCaminhao").value = vistoria.Placa
                document.getElementById("operador").value = vistoria.ID_Operador;
                document.getElementById("placaCaminhao").value = vistoria.Placa;
                document.getElementById("dataPrevista").value = vistoria.Data_Prevista.split("T")[0];
                document.getElementById("horarioPrevisto").value = vistoria.Horario_Previsto;
                document.getElementById("observacao").value = vistoria.Descricao;

                const itensVistoria = vistoria.Itens;

                document.querySelectorAll('input[name="itensVistoria"]').forEach(checkbox => {
                    if (itensVistoria.includes(checkbox.value))
                        checkbox.checked = true;
                })

            }
        }

    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        alert("Erro ao carregar os dados!");
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            const horario = document.getElementById("horarioPrevisto").value;
            const itensSelecionados = Array.from(document.querySelectorAll('input[name="itensVistoria"]:checked')).map(item => item.value)
            
            const usuario = JSON.parse(localStorage.getItem('usuario'))
            if (!usuario || !usuario.idUsuario) 
                throw new Error("Usuário não identificado. Faça login novamente.");

            const vistoria = new Vistoria(
            document.getElementById("dataPrevista").value,
            horario + ":00",
            document.getElementById("placaCaminhao").value,
            Number(usuario.idUsuario),
            Number(document.getElementById("operador").value),
            document.getElementById("observacao").value.trim(),
            itensSelecionados
            )

            const dadosVistoria = {
                ID_Analista: vistoria.getAnalista(),
                ID_Operador: vistoria.getOperador(),
                Placa: vistoria.getPlaca(),
                Data_Prevista: vistoria.getPrevisao(),
                Horario_Previsto: vistoria.getHorario(),
                Descricao: vistoria.getDesc() || null,
                Itens: vistoria.getItens()
            }

            console.log('Dados enviado:', dadosVistoria)
            const resultado = await agendarVistoria(dadosVistoria)
            alert(resultado.msg)
            form.reset()
        }catch(error){
            console.error("Erro ao agendar vistoria:", error)
            alert(error.message || "Falha ao realizar agendamento")
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
