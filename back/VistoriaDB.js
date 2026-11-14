var sql = require('mysql2');

class VistoriaDB {
    static saveVistoria(vistoria, callback) {
        let connection = sql.createConnection({
            user: 'root',
            host: 'localhost',
            password: 'ghsasql1234',
            database: 'vistoriacaminhao'
        });

        let consultaAnalista = `SELECT ID_Usuario FROM Usuario WHERE ID_Usuario = ? AND Tipo_Usuario = 'analista'`;

        connection.query(consultaAnalista, [vistoria.ID_Analista], function(error, results) {
                if (error) {
                    connection.end();
                    return callback(error);
                }

                if (results.length === 0) {
                    connection.end();
                    let erro = new Error('Analista não encontrado.');
                    erro.status = 400;
                    return callback(erro);
                }

                // Comando SQL para cadastrar a vistoria
                let comando = `INSERT INTO Vistoria (Data_Abertura, Data_Prevista, Horario_Previsto, Descricao, ID_Analista, Placa) VALUES (CURDATE(), ?, ?, ?, ?, ?)`;

                let valores = [
                    vistoria.Data_Prevista,
                    vistoria.Horario_Previsto,
                    vistoria.Descricao || null,
                    vistoria.ID_Analista,
                    vistoria.Placa
                ];

                connection.query( comando, valores, function(error, resultado) {
                        connection.end();
                        if (error) 
                            return callback(error);
                        
                        // Retornar os dados cadastrados
                        let novaVistoria = {
                            Cod_Vistoria: resultado.insertId,
                            Data_Abertura: null,
                            Data_Fechamento: null,
                            Data_Prevista: vistoria.Data_Prevista,
                            Horario_Previsto: vistoria.Horario_Previsto,
                            Descricao: vistoria.Descricao || null,
                            Status: false,
                            ID_Analista: vistoria.ID_Analista,
                            ID_Operador: null,
                            Placa: vistoria.Placa
                        };

                        callback(null, novaVistoria);
                    }
                );
            }
        );
    }
}

module.exports = VistoriaDB;
