var sql = require('mysql2');
const UsuarioDB = require('./UsuarioDB');

class VistoriaDB {
    static getCaminhoes(callback) {
        let connection = sql.createConnection({
            user: 'root',
            host: 'localhost',
            password: 'ghsasql1234',
            database: 'vistoriacaminhao'
        });
        let comando = `SELECT Placa, Modelo, Marca FROM Caminhao ORDER BY Placa`;
        connection.query(comando, function (error, resultados) {
            connection.end();
            if (error)
                return callback(error);
            callback(null, resultados);
        });
    }


    static saveVistoria(vistoria, callback) {
        let connection = sql.createConnection({
            user: 'root',
            host: 'localhost',
            password: 'ghsasql1234',
            database: 'vistoriacaminhao'
        });

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
}

module.exports = VistoriaDB;
