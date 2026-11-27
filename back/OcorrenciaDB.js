var sql = require('mysql2')
const Connect = require('./Connect')

class OcorrenciaDB {
    static getOcorrencias(callback) {
        const connection = Connect.connect();
        const comando = `
            SELECT o.Cod_Ocorrencia, o.Cod_Vistoria, o.Titulo, o.Descricao,
                   o.Data_Ocorrencia, o.Gravidade, v.Placa
            FROM Ocorrencia o
            INNER JOIN Vistoria v ON v.Cod_Vistoria = o.Cod_Vistoria
            ORDER BY o.Data_Ocorrencia DESC, o.Cod_Ocorrencia DESC
        `;

        connection.query(comando, (error, ocorrencias) => {
            connection.end();
            callback(error, ocorrencias);
        });
    }
}

module.exports = OcorrenciaDB