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
        let sql = "select v.Cod_Vistoria, v.Status, v.Data_Abertura, v.Horario_Previsto, v.Placa, v.Descricao, v.Data_Prevista, v.ID_Operador, v.ID_Analista, u.nome as nomeAnalista, o.nome as nomeOperador from vistoria v join Usuario u on v.ID_Analista = u.idUsuario join Usuario o on v.ID_Operador = o.idUsuario"
        let query = connection.query(sql, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

    static getVistoriaById(id, callback)
    {
        let connection = Connect.connect()
        let sql = "select v.Cod_Vistoria, v.Status, v.Data_Abertura, v.Horario_Previsto, v.Placa, v.Descricao, v.Data_Prevista, v.ID_Operador, v.ID_Analista, u.nome as nomeAnalista, o.nome as nomeOperador from vistoria v join Usuario u on v.ID_Analista = u.idUsuario join Usuario o on v.ID_Operador = o.idUsuario where Cod_Vistoria = ?"
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
        let sql = "select v.Cod_Vistoria, v.Status, v.Data_Abertura, v.Horario_Previsto, v.Placa, v.Descricao, v.Data_Prevista, v.ID_Operador, v.ID_Analista, u.nome as nomeAnalista, o.nome as nomeOperador from vistoria v join Usuario u on v.ID_Analista = u.idUsuario join Usuario o on v.ID_Operador = o.idUsuario where Status = ?"
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
        let sql = "select v.Cod_Vistoria, v.Status, v.Data_Abertura, v.Horario_Previsto, v.Placa, v.Descricao, v.Data_Prevista, v.ID_Operador, v.ID_Analista, u.nome as nomeAnalista, o.nome as nomeOperador from vistoria v join Usuario u on v.ID_Analista = u.idUsuario join Usuario o on v.ID_Operador = o.idUsuario where Data_Prevista = ?"
        let query = connection.query(sql, data, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

    static updateParcialVistoria(id, vistoria, callback) {
        let connection = Connect.connect();

        // 1. Objeto de dados para o SET ? funcionar corretamente
        let dadosAtualizacao = {
            Data_Prevista: vistoria.Data_Prevista,
            Horario_Previsto: vistoria.Horario_Previsto,
            Descricao: vistoria.Descricao || null,
            ID_Analista: vistoria.ID_Analista,
            ID_Operador: vistoria.ID_Operador,
            Placa: vistoria.Placa
        };

        let sqlVistoria = 'update Vistoria SET ? where Cod_Vistoria = ?';
        
        connection.query(sqlVistoria, [dadosAtualizacao, id], function(error, results) {
            if (error) {
                connection.end();
                return callback(error);
            }

            let sqlDelete = 'delete from Item_Vistoria where COD_Vistoria = ?';
            
            connection.query(sqlDelete, [id], function(error) {
                if (error) {
                    connection.end();
                    return callback(error);
                }

                if (vistoria.Itens.length === 0) {
                    connection.end();
                    return callback(null, { Cod_Vistoria: id, msg: "Atualizado com sucesso" });
                }

                let valoresItens = vistoria.Itens.map(item => [id, item, 'Pendente']);
                let sqlInsert = 'INSERT INTO Item_Vistoria (COD_Vistoria, Nome_Item, Situacao) VALUES ?';

                connection.query(sqlInsert, [valoresItens], function(error) {
                    connection.end();
                    if (error) {
                        return callback(error);
                    }
                    callback(null, { Cod_Vistoria: id, msg: "Atualizado com sucesso" });
                });
            });
        });
    }

    //get para os itens pelo id da vistoria
    static getItensByVistoria(id, callback)
    {
        let connection = Connect.connect()
        let sql = "select Nome_Item from item_vistoria where COD_Vistoria = ?"
        let query = connection.query(sql, id, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()        
    }

}

module.exports = VistoriaDB;
