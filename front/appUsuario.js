import {
    buscarPorTipo,
    buscarPorId,
    listarCaminhoes,
    agendarVistoria,
    buscarPorIdVistorias,
    listaItens,
    atualizarVistoria,
    listarOcorrenciasPorVistoria
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

});

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
            const itensVistoria = await listaItens(codVistoria)
            let itensVistoriaTratados = itensVistoria.map(item => item.Nome_Item)

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

                document.querySelectorAll('input[name="itensVistoria"]').forEach(checkbox => {
                    if (itensVistoriaTratados.includes(checkbox.value))
                        checkbox.checked = true;
                })

                carregarOcorrencias(codVistoria)

                const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

                if (Number(vistoria.ID_Analista) != Number(usuarioLogado.idUsuario)) {
                    const elementos = form.elements;
                    for (let i = 0; i < elementos.length; i++)
                        elementos[i].disabled = true;

                    document.getElementById("btnSalvar").style.display = "none";
                }
            }

            document.getElementById("btnSalvar").innerText = 'Editar Vistoria'
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
            horario.length <= 5 ? horario + ':00' : horario,
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

        if (codVistoria)
        {
            const resultado = await atualizarVistoria(codVistoria, dadosVistoria);
            alert(resultado.msg || "Vistoria atualizada com sucesso!");
            window.location.href = "vistoria.html";
        }
        else
        {
            const resultado = await agendarVistoria(dadosVistoria);
            alert(resultado.msg);
            form.reset();
        }
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

async function carregarOcorrencias(id)
{
    const ocorrencias = await listarOcorrenciasPorVistoria(id)

    ocorrencias.forEach(item => {
        const areaOcorrencias = document.getElementById("areaOcorrencias");

        if(ocorrencias.length == 0)
            areaOcorrencias.innerHTML = 'Não há ocorrências para essa vistoria'

        areaOcorrencias.innerHTML = `
            <p><strong>Item:</strong> ${item.COD_Ocorrencia}</p>
            <p><strong>Descrição:</strong> ${item.Titulo}</p>
        `;
    });
}
