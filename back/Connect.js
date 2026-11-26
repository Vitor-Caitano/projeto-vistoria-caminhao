var sql = require('mysql2')

class Connect
{
    //Função para conectar localmente com o banco de dados
    //Senha censurada. Testes devem ser feitos localmente
    static connect()
    {
        let connection = sql.createConnection({
            user: 'root',
            host: 'localhost',
            password: 'ghsasql1234',
            database: 'vistoriacaminhao'
        })

        connection.connect()
        return connection
    }
}

module.exports = Connect