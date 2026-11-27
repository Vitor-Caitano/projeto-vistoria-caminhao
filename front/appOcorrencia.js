import { listarOcorrencias } from './api.js';
import { paginate } from './pagination.js';

const itensPorPagina = 10;
let ocorrencias = [];
let paginaAtual = 1;

window.addEventListener('DOMContentLoaded', carregarOcorrencias);

async function carregarOcorrencias() {
    const usuario = localStorage.getItem("usuario")
    if(usuario == null)
        window.location.href = "login.html"

    if(JSON.parse(usuario).tipoUsuario == "analista")
        document.getElementById("menuOperador").style.display = "none";

    document.getElementById('deslogar').addEventListener('click', () => {
        localStorage.removeItem("usuario");
        window.location.href = "login.html"
    })

    const mensagem = document.getElementById('mensagemOcorrencias');
    mensagem.textContent = 'Carregando ocorrências...';

    try {
        ocorrencias = await listarOcorrencias();
        preencherFiltroGravidade();
        mensagem.textContent = '';
        configurarFiltros();
        renderizarOcorrencias();
    } catch (error) {
        mensagem.textContent = error.message || 'Não foi possível carregar as ocorrências.';
    }
}

function preencherFiltroGravidade() {
    const filtro = document.getElementById('filtroGravidade');
    const gravidades = [...new Set(
        ocorrencias
            .map(ocorrencia => ocorrencia.Gravidade?.trim())
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, 'pt-BR'));

    gravidades.forEach(gravidade => {
        const opcao = document.createElement('option');
        opcao.value = gravidade;
        opcao.textContent = gravidade;
        filtro.appendChild(opcao);
    });

    if (ocorrencias.some(ocorrencia => !ocorrencia.Gravidade?.trim())) {
        const opcao = document.createElement('option');
        opcao.value = '__sem_gravidade__';
        opcao.textContent = 'Não informada';
        filtro.appendChild(opcao);
    }
}

function configurarFiltros() {
    document.getElementById('buscaOcorrencias').addEventListener('input', atualizarFiltros);
    ['filtroGravidade', 'ordemOcorrencias'].forEach(id => {
        document.getElementById(id).addEventListener('change', atualizarFiltros);
    });
}

function atualizarFiltros() {
    paginaAtual = 1;
    renderizarOcorrencias();
}

function obterOcorrenciasFiltradas() {
    const busca = document.getElementById('buscaOcorrencias').value.trim().toLocaleLowerCase('pt-BR');
    const gravidade = document.getElementById('filtroGravidade').value;
    const ordem = document.getElementById('ordemOcorrencias').value;

    return ocorrencias
        .filter(ocorrencia => {
            const correspondeGravidade = !gravidade
                || (gravidade === '__sem_gravidade__' && !ocorrencia.Gravidade?.trim())
                || ocorrencia.Gravidade?.trim() === gravidade;
            const texto = [
                ocorrencia.Cod_Ocorrencia,
                ocorrencia.Titulo,
                ocorrencia.Descricao,
                ocorrencia.Gravidade,
                ocorrencia.Cod_Vistoria,
                ocorrencia.Placa
            ].join(' ').toLocaleLowerCase('pt-BR');

            return correspondeGravidade && texto.includes(busca);
        })
        .sort((a, b) => {
            const diferenca = obterData(a.Data_Ocorrencia).localeCompare(obterData(b.Data_Ocorrencia));
            if (diferenca !== 0) {
                return ordem === 'asc' ? diferenca : -diferenca;
            }
            return Number(b.Cod_Ocorrencia) - Number(a.Cod_Ocorrencia);
        });
}

function obterData(data) {
    if (data instanceof Date) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }
    return String(data || '').slice(0, 10);
}

function formatarData(data) {
    const valor = obterData(data);
    const partes = valor.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : '—';
}

function renderizarOcorrencias() {
    const tbody = document.getElementById('tbodyOcorrencias');
    const resultados = obterOcorrenciasFiltradas();
    const pagina = paginate(resultados, paginaAtual, itensPorPagina);
    tbody.replaceChildren();

    if (resultados.length === 0) {
        const linha = document.createElement('tr');
        const celula = document.createElement('td');
        celula.colSpan = 7;
        celula.textContent = 'Nenhuma ocorrência encontrada.';
        linha.appendChild(celula);
        tbody.appendChild(linha);
    } else {
        pagina.forEach(ocorrencia => {
            const linha = document.createElement('tr');
            [
                ocorrencia.Cod_Ocorrencia,
                ocorrencia.Titulo,
                ocorrencia.Descricao,
                ocorrencia.Gravidade || 'Não informada',
                formatarData(ocorrencia.Data_Ocorrencia),
                ocorrencia.Cod_Vistoria,
                ocorrencia.Placa || '—'
            ].forEach(valor => {
                const celula = document.createElement('td');
                celula.textContent = valor == null || valor === '' ? '—' : String(valor);
                linha.appendChild(celula);
            });
            tbody.appendChild(linha);
        });
    }

    renderizarPaginacao(resultados.length);
}

function renderizarPaginacao(total) {
    const container = document.getElementById('paginationOcorrencias');
    const quantidadePaginas = Math.ceil(total / itensPorPagina);
    container.replaceChildren();

    for (let pagina = 1; pagina <= quantidadePaginas; pagina++) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.textContent = String(pagina);
        botao.setAttribute('aria-label', `Página ${pagina}`);
        if (pagina === paginaAtual) {
            botao.classList.add('ativado');
            botao.setAttribute('aria-current', 'page');
        }
        botao.addEventListener('click', () => {
            paginaAtual = pagina;
            renderizarOcorrencias();
        });
        container.appendChild(botao);
    }
}
