
const Connect = require('./Connect');
class CaminhaoDB{
    static saveCaminhao(caminhao, callback){
        let connection = Connect.connect();
        let sql = `INSERT INTO Caminhao
            (Placa, Modelo, Marca, Ano, Capacidade, Peso, Num_Eixos)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        let valores = [
            caminhao.getPlaca(),
            caminhao.getModelo(),
            caminhao.getMarca(),
            caminhao.getAno(),
            caminhao.getCapacidade(),
            caminhao.getPeso(),
            caminhao.getNumEixos()
        ]
        connection.query(sql, valores, function(error, resultado){
            connection.end()
            if(error)
                return callback(error)

            callback(null, resultado)
        })
    }
}

module.exports = CaminhaoDB