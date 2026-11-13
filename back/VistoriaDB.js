var sql = require('mysql2')

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
}

module.exports = VistoriaDB
