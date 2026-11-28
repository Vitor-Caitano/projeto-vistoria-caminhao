var sql = require('mysql2')
const Connect = require('./Connect')

class OcorrenciaDB {
    static getOcorrencias(callback) {
        const connection = Connect.connect();
        const comando = `
            SELECT o.Cod_Ocorrencia, o.Cod_Vistoria, o.Titulo, o.Descricao, o.Gravidade, v.Placa
            FROM Ocorrencia o
            INNER JOIN Vistoria v ON v.Cod_Vistoria = o.Cod_Vistoria
        `;

        connection.query(comando, (error, ocorrencias) => {
            connection.end();
            callback(error, ocorrencias);
        });
    }

    static getOcorrenciasByVistoria(id, callback) {
        let connection = Connect.connect()
        let sql = "select Cod_Ocorrencia, Titulo from ocorrencia where COD_Vistoria = ?"
        let query = connection.query(sql, id, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()        
    }

    static saveOcorrencia(ocorrencia, callback)
    {
        let connection = Connect.connect()
        let sql = 'insert into ocorrencia set ?'
        let query = connection.query(sql, ocorrencia, function(error, results, fields) {
            if(error)
                throw error

            ocorrencia.id = results.insertId
            callback(ocorrencia)
        })
        console.log(query.sql)
        connection.end()
    }
}

module.exports = OcorrenciaDB