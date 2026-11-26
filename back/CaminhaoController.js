const Caminhao = require('../classes/caminhao');
const CaminhaoDB = require('./CaminhaoDB');

class CaminhaoController{
    static cadastrarCaminhao(dados, callback) {
        try {
            const caminhao = new Caminhao(
                dados.Placa,
                dados.Modelo,
                dados.Marca,
                dados.Ano,
                dados.Capacidade,
                dados.Peso,
                dados.Num_Eixos
            );

            CaminhaoDB.saveCaminhao(caminhao, function (error, resultado){
                if(error)
                    return callback(error)

                callback(null, resultado)
            })
        }catch(erro){
            erro.status = 400;
            return callback(erro)
        }
    }
}

module.exports = CaminhaoController