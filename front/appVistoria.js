import {
    listarVistorias,
    //buscarPorIdVistorias,
    //buscarPorDiaVistorias,
    buscarPorStatusVistorias,
} from './api.js';

import { paginate } from './pagination.js';

import { Vistoria } from '../classes/vistoria.js';

let vistorias = [];

let operadores = [];

let paginaAtual = 1;

const itensPorPagina = 5;

window.addEventListener('DOMContentLoaded', () => {
    const usuario = localStorage.getItem("usuario")
    if (usuario == null)
        window.location.href = "login.html"

    if (JSON.parse(usuario).tipoUsuario == "analista")
        document.getElementById("menuOperador").style.display = "none";

    carregarVistorias()

    let botoesFiltro = [
        document.getElementById('fTodos'),
        document.getElementById('concluida'),
        document.getElementById('inconcluida')
    ]

    document
        .getElementById('fTodos')
        .addEventListener('click', () => {
            pesquisarStatus("todos")

            botoesFiltro.forEach(botao => botao.classList.remove('ativado'))

            document.getElementById('fTodos').classList.add('ativado')
        })

    document
        .getElementById('concluida')
        .addEventListener('click', () => {
            pesquisarStatus("1")

            botoesFiltro.forEach(botao => botao.classList.remove('ativado'))

            document.getElementById('concluida').classList.add('ativado')
        })

    document
        .getElementById('inconcluida')
        .addEventListener('click', () => {
            pesquisarStatus("0")

            botoesFiltro.forEach(botao => botao.classList.remove('ativado'))

            document.getElementById('inconcluida').classList.add('ativado')
        })

    document
        .getElementById('deslogar')
        .addEventListener('click', () => {
            localStorage.removeItem("usuario");
            window.location.href = "login.html"
        })
})

async function carregarVistorias() {

    let dados = await listarVistorias();
    vistorias = dados;

    /* vistorias = dados.map(vistoria  => {
        return new Vistoria(
            vistoria.Cod_Vistoria,
            vistoria.Data_Abertura,
            vistoria.Data_Fechamento,
            vistoria.Data_Prevista,
            vistoria.Horario_Previsto,
            vistoria.Placa,
            vistoria.ID_Analista,
            vistoria.ID_Operador,
            vistoria.Status,
            vistoria.Descricao
        )
    })

    operadores = dados.map(vistoria => vistoria.nomeOperador) */

    //paginaAtual = 1;

    renderizarVistorias();
}

function renderizarVistorias() {

    const tbody = document.getElementById("tbodyVistorias");

    tbody.innerHTML = "";

    const pagina =
        paginate(
            vistorias,
            paginaAtual,
            itensPorPagina
        );

    //let i = 0
    pagina.forEach(vistoria => {

        tbody.innerHTML += `
        <tr>
            <td>${vistoria.Status ? "Concluído" : "Inconcluído"}</td>
            <td>${vistoria.Cod_Vistoria}</td>
            <td>Vistoria do operador ${vistoria.nomeOperador} <br> ${vistoria.Data_Abertura}</td>
            <td>
                <button
                    class="editarVisualizar"
                    data-cod="${vistoria.Cod_Vistoria}"
                    id="${vistoria.Cod_Vistoria}">
                    ${vistoria.ID_Analista == JSON.parse(localStorage.getItem("usuario")).idUsuario ? "Editar" : "Visualizar" }
                </button>
            </td>
        </tr>
        `;
        // i++
        document.querySelectorAll(".btnEditar").forEach(botao => {

            botao.addEventListener("click", () => {

                const codVistoria = botao.dataset.id;

                abrirPopup(codVistoria);

            });

        });
    });

    tbody.querySelectorAll('.editarVisualizar').forEach(botao => {
        botao.addEventListener('click', (evento) => {
            const codVistoria = evento.target.getAttribute('data-cod');
            window.location.href = `vistoriaAgendamento.html?cod=${codVistoria}`;
        })
    })

    renderizarPaginas();
}

function renderizarPaginas() {

    const qtd =
        Math.ceil(
            vistorias.length /
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

    renderizarVistorias();
}

async function pesquisarStatus(tipo) {

    console.log(`Filtrando por: ${tipo}`)

    if (tipo === "todos") {

        await carregarVistorias();

        return;
    }

    let dados = await buscarPorStatusVistorias(tipo);

    vistorias = dados
    /*  vistorias = dados.map(vistoria => {
         return new Vistoria(
             vistoria.Cod_Vistoria,
             vistoria.Data_Abertura,
             vistoria.Data_Fechamento,
             vistoria.Data_Prevista,
             vistoria.Horario_Previsto,
             vistoria.Placa,
             vistoria.ID_Analista,
             vistoria.ID_Operador,
             vistoria.Status,
             vistoria.Descricao   
         )  
     }) */

    paginaAtual = 1;

    renderizarVistorias();
}