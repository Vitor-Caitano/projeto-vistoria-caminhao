const API_URL = "http://localhost:3000/vistoria";

export async function listarPets() {

    const response =
        await fetch(`${API_URL}/usuarios`);

    return await response.json();
}

export async function buscarPorId(id) {

    const response =
        await fetch(`${API_URL}/usuarios/${id}`);

    return await response.json();
}

export async function buscarPorTipo(tipo) {

    const response =
        await fetch(`${API_URL}usuarios/tipo/${tipo}`);

    return await response.json();
}

export async function salvarPet(pet) {

    const response =
        await fetch(`${API_URL}/usuarios`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(pet)
        });

    return await response.json();
}

export async function atualizarPet(id, pet){

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

export async function excluirPet(id){

    const response =
        await fetch(`${API_URL}/usuarios/${id}`,{
            method:"DELETE"
        });

    return await response.json();
}