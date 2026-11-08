require('dotenv').config();

const sql = require('mysql2');

class UsuarioDB {
    //Função para conectar localmente com o banco de dados
    //Senha censurada. Testes devem ser feitos localmente
    static connect() {
        let connection = sql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT)
        });

        return connection;
    }

    //MÉTODOS PARA ACESSAR, DELETAR E ATUALIZAR USUÁRIOS NO BANCO

    //LISTA GERAL DE USUÁRIOS
    static getUsuarios(callback) {
        let connection = UsuarioDB.connect();

        let sql = 'SELECT * FROM Usuario';

        connection.query(sql, function (error, results) {
            connection.end();

            if (error) {
                throw error;
            }

            callback(results);
        })
    }

    //USUÁRIO COM ID ESPECÍFICO
    static getUsuarioById(id, callback) {
        let connection = UsuarioDB.connect();

        let sql = 'SELECT * FROM Usuario WHERE ID_usuario = ?';

        connection.query(sql, id, function (error, results) {
            connection.end();

            if (error) {
                throw error;
            }

            callback(results);
        });
    }

    //LISTA DE USUÁRIOS POR TIPO
    static getUsuarioByTipo(tipo, callback) {
        let connection = UsuarioDB.connect();

        let sql = 'SELECT * FROM Usuario WHERE Tipo_Usuario = ?';

        connection.query(sql, tipo, function (error, results) {
            connection.end();

            if (error) {
                throw error;
            }

            callback(results);
        });
    }

    //SALVAR UM NOVO USUÁRIO
    static saveUsuario(usuario, callback) {
        let connection = UsuarioDB.connect();

        let sql = 'INSERT INTO Usuario SET ?';

        connection.query(sql, usuario, function (error, results) {
            connection.end();

            if (error) {
                throw error;
            }

            usuario.ID_usuario = results.insertId;
            callback(usuario);
        });
    }

    //APAGAR UM USUÁRIO DE ID ESPECÍFICO
    static deleteUsuario(id, callback) {
        let connection = UsuarioDB.connect();

        let sql = 'DELETE FROM Usuario WHERE ID_usuario = ?';

        connection.query(sql, id, function (error, results) {
            connection.end();

            if (error) {
                throw error;
            }

            callback(results.affectedRows);
        });
    }

    //MODIFICAR UM USUÁRIO ESPECÍFICO POR ID
    static updateUsuario(id, usuario, callback) {
        let connection = UsuarioDB.connect();

        let sql = 'UPDATE Usuario SET ? WHERE ID_usuario = ?';

        connection.query(sql, [usuario, id], function (error, results) {
            connection.end();

            if (error) {
                throw error;
            }

            callback(results.affectedRows);
        });
    }
}

module.exports = UsuarioDB;