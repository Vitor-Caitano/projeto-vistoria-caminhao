import { cadastrarCaminhao } from "./api.js";

const popupCaminhao = document.getElementById('popupCaminhao');
const btnNovo = document.getElementById('btnNovo')
const btnFechar = document.getElementById('btnFechar');

btnNovo.addEventListener('click', ()=>{
    popupCaminhao.style.display = 'flex'
    document.body.style.overflow = 'hidden'
})

btnFechar.addEventListener('click', fechaPopup)

popupCaminhao.addEventListener('click', (evento)=>{
    if(evento.target === popupCaminhao){
        fechaPopup()
    }
})

formCaminhao.addEventListener('submit', async(evento)=>{
    evento.preventDefault()
    const caminhao = {
        Placa: document.getElementById('placa').value,
        Modelo: document.getElementById('modelo').value,
        Marca: document.getElementById('marca').value,
        Ano: document.getElementById('ano').value,
        Capacidade: Number(document.getElementById('capacidade').value),
        Peso: Number(document.getElementById('peso').value),
        Num_Eixos: Number(document.getElementById('numEixos').value)
    }
    try{
        const resultado = await cadastrarCaminhao(caminhao)
        alert(resultado.msg)
        formCaminhao.reset()
        fechaPopup()
    }catch(erro){
        alert(erro.message)
    }
    
})

function fechaPopup(){
    popupCaminhao.style.display = 'none'
    document.body.style.overflow = ''
}