var sql = require('mysql2')

class UsuarioDB
{
    //Função para conectar localmente com o banco de dados
    //Senha censurada. Testes devem ser feitos localmente
    static connect()
    {
        let connection = sql.createConnection({
            user: 'root',
            host: 'localhost',
            password: 'password',
            database: 'vistoriacaminhao'
        })

        connection.connect()
        return connection
    }

    //MÉTODOS PARA ACESSAR, DELETAR E ATUALIZAR USUÁRIOS NO BANCO

    //LISTA GERAL DE USUÁRIOS
    static getUsuarios(callback)
    {
        let connection = UsuarioDB.connect()
        let sql = 'select * from usuario'
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
        let connection = UsuarioDB.connect()
        let sql = 'select * from usuario where idUsuario = ?'
        let query = connection.query(sql, id, function(error, results, fields) {
            if(error)
                throw error

            callback(results)
        })
        console.log(query.sql)
        connection.end()
    }

    //LISTA DE USUÁRIOS POR TIPO
    static getUsuarioByTipo(tipo, callback)
    {
        let connection = UsuarioDB.connect()
        let sql = 'select * from usuario where tipoUsuario = ?'
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
        let connection = UsuarioDB.connect()
        let sql = 'insert into usuario set ?'
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
        let connection = UsuarioDB.connect()
        let sql = 'delete from usuario where idUsuario = ?'
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
        let connection = UsuarioDB.connect()
        let sql = 'update usuario set ? where idUsuario = ?'
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
        let connection = UsuarioDB.connect()
        let sql = 'update usuario set ? where idUsuario = ?'
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