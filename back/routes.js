var express = require('express')
var cors = require('cors')
var app = express()
var UsuarioDB = require('./UsuarioDB')
var VistoriaDB = require('./VistoriaDB.js')

const VistoriaController = require('./Controller.js')
const controller = new VistoriaController();

app.use(cors())
app.use(express.json())

app.get('/vistoria/vistorias', (req, res) => {
    VistoriaDB.getVistorias(function(vistorias) {
        res.json(vistorias)
    })
})

app.get('/vistoria/vistorias/:id', (req, res) => {
    const id = req.params.id
    if(isNaN(id)) {
        res.send({
            msg: 'ID inválido'
        })
        return
    }
    VistoriaDB.getVistoriaById(id, function(vistoria) {
        res.json(vistoria)
    })
})

app.get('/vistoria/vistorias/concluido/:status', (req, res) => {
    let status = 0
    if(req.params.status == "1")
        status = 1

    VistoriaDB.getVistoriaByStatus(status, function(vistoria) {
        res.json(vistoria)
    })
})

app.get('/vistoria/vistorias/dia/:dia', (req, res) => {
    const dia = req.params.dia

    VistoriaDB.getVistoriaByDia(dia, function(vistorias) {
        res.json(vistorias)
    })
})

// Post agendar vistoria
app.post('/vistoria/agendamentos', (req, res) => {
    const vistoria = req.body;
    // Verificar campos obrigatórios
    if (!vistoria.ID_Analista || !vistoria.Placa_Caminhao || !vistoria.Data_Prevista || !vistoria.Horario_Previsto) {
        res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
        return;
    }

    if (!Number.isInteger(vistoria.ID_Analista) || vistoria.ID_Analista <= 0) {
        res.status(400).json({ msg: 'ID do analista inválido.' });
        return;
    }

    if (typeof vistoria.Placa_Caminhao !== 'string' || vistoria.Placa_Caminhao.trim() === '') {
        res.status(400).json({ msg: 'Placa do caminhão inválida.' });
        return;
    }

    const data = vistoria.Data_Prevista;
    if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        res.status(400).json({ msg: 'Data prevista inválida.' });
        return;
    }

    const [ano, mes, dia] = data.split('-').map(Number);
    const dataValidada = new Date(Date.UTC(ano, mes - 1, dia));

    if (dataValidada.getUTCFullYear() !== ano || dataValidada.getUTCMonth() !== mes - 1 || dataValidada.getUTCDate() !== dia) {
        res.status(400).json({ msg: 'Data prevista inexistente.' });
        return;
    }

    const horario = vistoria.Horario_Previsto;
    if (typeof horario !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(horario)) {
        res.status(400).json({ msg: 'Horário previsto inválido.' });
        return;
    }
    // Cadastrar a vistoria
    VistoriaDB.saveVistoria(vistoria, (novaVistoria) => {
        res.status(201).json({ msg: 'Vistoria agendada com sucesso!', vistoria: novaVistoria });
    });
});




app.get('/vistoria/usuarios', function (req, res) {
    UsuarioDB.getUsuarios(function (usuarios) {
        res.json(usuarios)
    })
})

app.get('/vistoria/usuarios/:id', function (req, res) {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.getUsuarioById(id, function (usuario) {
        res.json(usuario)
    })
})

app.get('/vistoria/usuarios/tipo/:tipo', function (req, res) {
    const tipo = req.params.tipo

    UsuarioDB.getUsuarioByTipo(tipo, function (usuarios) {
        res.json(usuarios)
    })
})

app.post('/vistoria/usuarios', function (req, res) {
    const usuario = req.body

    UsuarioDB.saveUsuario(usuario, function (usuario) {
        res.json(usuario)
    })
})

app.get('/vistoria/caminhoes', (req, res) => {
    VistoriaDB.getCaminhoes((error, caminhoes) => {
        if (error) {
            console.error(error);
            return res.status(500).json({msg: 'Erro ao consultar caminhões.'});
        }
        return res.json(caminhoes);
    });
});

app.post('/vistoria/agendamentos', (req, res) => {
    const vistoria = req.body;
   
    const erro = controller.validarVistoria(vistoria);
    if (erro)
        return res.status(400).json({ msg: erro });

    
    VistoriaDB.saveVistoria(vistoria, (error, novaVistoria) => {
        if (error) {
            console.error(error);
            if (error.status)
                return res.status(error.status).json({msg: error.message});

            if (error.code === 'ER_NO_REFERENCED_ROW_2')
                return res.status(400).json({msg: 'Analista, Operador ou caminhão não foram encontrados'});

            return res.status(500).json({msg: 'Erro ao cadastrar a vistoria.'});
        }
        return res.status(201).json({msg: 'Vistoria agendada com sucesso!', vistoria: novaVistoria
        });
    });
});

app.delete('/vistoria/usuarios/:id', function (req, res) {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.deleteUsuario(id, function (affectedRows) {
        res.json({
            msg: 'cliente deletado'
        })
    })
})

app.put('/vistoria/usuarios/:id', function (req, res) {
    const update = req.body
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.updateUsuario(id, update, function (usuario) {
        res.json({
            msg: 'produto atualizado com sucesso'
        })
    })
})

app.patch('/vistoria/usuarios/:id', function (req, res) {
    const update = req.body
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.updateParcialUsuario(id, update, function (usuario) {
        res.json({
            msg: 'usuário atualizado com sucesso'
        })
    })
})

const server = app.listen(3000, () => {
    const host = server.address().address
    const port = server.address().port

    console.log(`Server iniciado em: http://localhost:${port}`)
})