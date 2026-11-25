var express = require('express')
var cors = require('cors')
var app = express()
var UsuarioDB = require('./UsuarioDB')
var VistoriaDB = require('./VistoriaDB.js')

const VistoriaController = require('./Controller.js')
const controller = new VistoriaController();

app.use(cors())
app.use(express.json())

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
            msg: 'produto atualizado com sucesso'
        })
    })
})

const server = app.listen(3000, () => {
    const host = server.address().address
    const port = server.address().port

    console.log(`Server iniciado em: http://localhost:${port}`)
})