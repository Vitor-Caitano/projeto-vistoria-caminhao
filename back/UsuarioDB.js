var sql = require('mysql2')
const Connect = require('./Connect')

class UsuarioDB
{

    //MÉTODOS PARA ACESSAR, DELETAR E ATUALIZAR USUÁRIOS NO BANCO

    //LISTA GERAL DE USUÁRIOS
    static getUsuarios(callback)
    {
        let connection = Connect.connect()
        let sql = 'select * from Usuario'
        let query = connection.query(sql, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

    //USUÁRIO COM ID ESPECÍFICO
    static getUsuarioById(id, callback)
    {
        let connection = Connect.connect()
        let sql = 'select * from Usuario where idUsuario = ?'
        let query = connection.query(sql, id, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
            //passei o .end para logo dps que a consulta retorna os dados
            connection.end()
        })
        console.log(query.sql)
    }

    //USUÁRIO COM EMAIL ESPECÍFICO
    static getUsuarioByEmail(email, callback)
    {
        let connection = Connect.connect()
        let sql = 'select * from Usuario where email = ?'
        let query = connection.query(sql, email, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
            //passei o .end para logo dps que a consulta retorna os dados
            connection.end()
        })
        console.log(query.sql)        
    }

    //LISTA DE USUÁRIOS POR TIPO
    static getUsuarioByTipo(tipo, callback)
    {
        let connection = Connect.connect()
        let sql = 'select * from Usuario where tipoUsuario = ?'
        let query = connection.query(sql, tipo, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

    //SALVAR UM NOVO USUÁRIO
    static saveUsuario(usuario, callback)
    {
        let connection = Connect.connect()
        let sql = 'insert into Usuario set ?'
        let query = connection.query(sql, usuario, function(error, results, fields) {
            if(error)
                throw error

            usuario.id = results.insertId
            callback(usuario)
        })
        console.log(query.sql)
        connection.end()
    }

    //APAGAR UM USUÁRIO DE ID ESPECÍFICO
    static deleteUsuario(id, callback)
    {
        let connection = Connect.connect()
        let sql = 'delete from Usuario where idUsuario = ?'
        let query = connection.query(sql, id, function(error, results, fields) {
            if(error)
                throw error

            callback(results.affectedRows)
        })
        console.log(query.sql)
        connection.end()
    }

    //MODIFICAR UM USUÁRIO ESPECÍFICO POR ID
    static updateUsuario(id, usuario, callback)
    {
        let connection = Connect.connect()
        let sql = 'update Usuario set ? where idUsuario = ?'
        let query = connection.query(sql, [usuario, id], function(error, results, fields) {
            if(error)
                throw error

            usuario.id = results.insertId
            callback(usuario)
        })
        console.log(query.sql)
        connection.end()
    }

    static updateParcialUsuario(id, usuario, callback)
    {
        let connection = Connect.connect()
        let sql = 'update Usuario set ? where idUsuario = ?'
        let query = connection.query(sql, [usuario, id], function(error, results, fields) {
            if(error)
                throw error

            callback(usuario)
        })
        console.log(query.sql)
        connection.end()
    }
}

module.exports = UsuarioDB