var sql = require('mysql2')
const Connect = require('./Connect');

class VistoriaDB
{
    static saveVistoria(vistoria, callback)
    {
        // Simulando um cadastro. O comando SQL será implementado após a criação do banco.
        let novaVistoria = {
            ...vistoria,
            Status: 'Pendente',
            ID_Operador: null,
            Data_Abertura: null,
            Data_Fechamento: null
        };
        callback(novaVistoria);
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

module.exports = VistoriaDB
