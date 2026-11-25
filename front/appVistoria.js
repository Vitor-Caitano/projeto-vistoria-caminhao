import {
    listarVistorias,
    buscarPorIdVistorias,
    buscarPorDiaVistorias,
    buscarPorStatusVistorias,
} from './api.js';

import { paginate } from './pagination.js';

import { Vistoria } from '../classes/vistoria.js';

let vistorias = [];

let operadores = [];

let paginaAtual = 1;

const itensPorPagina = 5;

window.addEventListener('DOMContentLoaded', () => {
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
})

async function carregarVistorias(){

    let dados = await listarVistorias();

    vistorias = dados.map(vistoria  => {
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

    operadores = dados.map(vistoria => vistoria.Nome)

    //paginaAtual = 1;

    renderizarVistorias();
}

function renderizarVistorias(){

    const tbody =
        document.getElementById("tbodyVistorias");

    tbody.innerHTML="";

    const pagina =
        paginate(
            vistorias,
            paginaAtual,
            itensPorPagina
        );

    let i = 0
    pagina.forEach(vistoria=>{

        tbody.innerHTML+=`
        <tr>
            <td>Concluído</td>
            <td>${vistoria.getCod()}</td>
            <td>Vistoria do operador ${operadores[i]} <br> ${vistoria.getAbertura().split('T')[0]}</td>
            <td>
                <button 
                    id="${vistoria.getCod()}">
                    Editar
                </button>
            </td>
        </tr>
        `;
        i++
    });

    renderizarPaginas();
}

function renderizarPaginas(){

    const qtd =
        Math.ceil(
          vistorias.length /
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

    renderizarVistorias();
}

async function pesquisarStatus(tipo){

    console.log(`Filtrando por: ${tipo}`)

    if(tipo==="todos"){

        carregarVistorias();

        return;
    }

    let dados = await buscarPorStatusVistorias(tipo);

    vistorias = dados.map(vistoria => {
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

    paginaAtual = 1;

    renderizarVistorias();
}