const API_URL = "http://localhost:3000/vistoria";


// métodos de requisição dos usuários
export async function listarUsuarios() {

    const response =
        await fetch(`${API_URL}/usuarios`);

    return await response.json();
}

export async function buscarPorId(id) {

    const response =
        await fetch(`${API_URL}/usuarios/${id}`);

    return await response.json();
}

export async function buscarPorEmail(email) {
    const response = await fetch(`${API_URL}/usuarios/email/${email}`)
    return await response.json()
}

export async function buscarPorTipo(tipo) {

    const response =
        await fetch(`${API_URL}/usuarios/tipo/${tipo}`);

    return await response.json();
}

export async function salvarUsuario(usuario) {

    const response =
        await fetch(`${API_URL}/usuarios`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                Nome: usuario.getNome(),
                Email: usuario.getEmail(),
                Data_Adesao: usuario.getAdesao(),
                Tipo_Usuario: usuario.getTipo(),
                Num_Vistorias: usuario.getNumVistorias(),
                Num_Ocorrencias: usuario.getNumOcorrencias(),
                Senha: usuario.getSenha()
            })
        });

    return await response.json();
}

export async function atualizarUsuario(id, pet){

    const response =
        await fetch(`${API_URL}/usuarios/${id}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(pet)
        });

    return await response.json();
}

export async function excluirUsuario(id){

    const response =
        await fetch(`${API_URL}/usuarios/${id}`,{
            method:"DELETE"
        });

    return await response.json();
}


//métodos de requisição dos caminhões
export async function listarCaminhoes() {
    const response = await fetch(`${API_URL}/caminhoes`);

    if (!response.ok) {
        throw new Error("Erro ao carregar caminhões.");
    }

    return await response.json();
}

export async function cadastrarCaminhao(caminhao) {
    const response = await fetch(`${API_URL}/caminhoes`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(caminhao)
    })
    const resultado = await response.json()
    if(!response.ok)
        throw new Error(resultado.msg || "Erro ao cadastrar caminhhão")

    return resultado
}

//métodos de requsição das vistorias
export async function agendarVistoria(vistoria) {

    const response = await fetch(`${API_URL}/agendamentos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vistoria)
        });

    const resultado = await response.json();

    if (!response.ok) 
        throw new Error(resultado.msg || "Erro ao agendar vistoria.");

    return resultado;
}


export async function listarVistorias()
{
    const response = await fetch(`${API_URL}/vistorias`)
    return await response.json()
}

export async function buscarPorIdVistorias(id)
{
    const response = await fetch(`${API_URL}/vistorias/${id}`)
    return await response.json()
}

export async function buscarPorStatusVistorias(status)
{
    const response = await fetch(`${API_URL}/vistorias/concluido/${status}`)
    return await response.json()
}

export async function buscarPorDiaVistorias(dia)
{
    const response = await fetch(`${API_URL}/vistorias/concluido/${dia}`)
    return await response.json()

}