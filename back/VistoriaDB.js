var sql = require('mysql2')
const Connect = require('./Connect')

class VistoriaDB {
    static getCaminhoes(callback) {
        let connection = Connect.connect()
        let comando = `SELECT Placa, Modelo, Marca FROM Caminhao ORDER BY Placa`;
        connection.query(comando, function (error, resultados) {
            connection.end();
            if (error)
                return callback(error);
            callback(null, resultados);
        });
    }


    static saveVistoria(vistoria, callback) {
        let connection = Connect.connect()

        let consultaUsuarios = `SELECT idUsuario, tipoUsuario FROM Usuario WHERE idUsuario IN (?, ?)`;

        connection.query(consultaUsuarios, [vistoria.ID_Analista, vistoria.ID_Operador], function (error, results) {
            if (error) {
                connection.end();
                return callback(error);
            }

            const analistaEncontrado = results.some(usuario => usuario.idUsuario === vistoria.ID_Analista && usuario.tipoUsuario === 'analista')
            const operadorEncontrado = results.some(usuario => usuario.idUsuario === vistoria.ID_Operador && usuario.tipoUsuario === 'operador')

            if(!analistaEncontrado){
                connection.end()
                let erro = new Error('Analista não foi encontrado')
                erro.status = 400
                return callback(erro)
            }
            if(!operadorEncontrado){
                connection.end()
                let erro = new Error('Operador não foi encontrado')
                erro.status = 400
                return callback(erro)
            }

            let comando = `INSERT INTO Vistoria (Data_Abertura, Data_Prevista, Horario_Previsto, Descricao, ID_Analista, ID_Operador, Placa) VALUES (CURDATE(), ?, ?, ?, ?, ?, ?)`;

            let valores = [
                vistoria.Data_Prevista,
                vistoria.Horario_Previsto,
                vistoria.Descricao || null,
                vistoria.ID_Analista,
                vistoria.ID_Operador,
                vistoria.Placa
            ];

            connection.query(comando, valores, function (error, resultado) {
                if (error){
                    connection.end();
                    return callback(error);
                }
                const idVistoria = resultado.insertId
                const comandoId = `INSERT INTO Item_Vistoria (COD_Vistoria, Nome_Item, Situacao) VALUES ?`
                let valoresItens = vistoria.Itens.map(item => [idVistoria, item, 'Pendente'])

                if (valoresItens.length === 0) {
                    connection.end()
                    return callback(null, { Cod_Vistoria: idVistoria })
                }

                connection.query(comandoId, [valoresItens], function (error) {
                    connection.end()
                    if (error) {
                        return callback(error)
                    }
                    callback(null, { Cod_Vistoria: idVistoria })
                })
            })  
        })
    }

    static getVistorias(callback)
    {
        let connection = Connect.connect()
        let sql = "select * from vistoria v join Usuario u on v.ID_Operador = u.ID_Usuario"
        let query = connection.query(sql, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

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

    static getVistoriaById(id, callback)
    {
        let connection = Connect.connect()
        let sql = "select * from vistoria v join Usuario u on v.ID_Operador = u.ID_Usuario where Cod_Vistoria = ?"
        let query = connection.query(sql, id, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

    static getVistoriaByStatus(status, callback)
    {
        let connection = Connect.connect()
        let sql = "select * from vistoria v join Usuario u on v.ID_Operador = u.ID_Usuario where Status = ?"
        let query = connection.query(sql, status, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

    static getVistoriaByDia(data, callback)
    {
        let connection = Connect.connect()
        let sql = "select * from vistoria v join Usuario u on v.ID_Operador = u.ID_Usuario where Data_Prevista = ?"
        let query = connection.query(sql, data, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

}

module.exports = VistoriaDB;
