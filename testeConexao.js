require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
});

connection.connect((erro) => {
    if (erro) {
        console.error('Erro na conexão:', erro.message);
        return;
    }

    console.log('Conexão com o MySQL realizada com sucesso!');

    connection.end();
});
