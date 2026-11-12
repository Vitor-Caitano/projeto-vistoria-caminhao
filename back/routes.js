var express = require('express')
var cors = require('cors')
var app = express()
var UsuarioDB = require('./UsuarioDB')

app.use(cors())
app.use(express.json())

app.get('/vistoria/usuarios', function(req, res) {
    UsuarioDB.getUsuarios(function(usuarios) {
        res.json(usuarios)
    })
})

app.get('/vistoria/usuarios/:id', function(req, res) {
    const id = parseInt(req.params.id)

    if(isNaN(id))
    {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.getUsuarioById(id, function(usuario) {
        res.json(usuario)
    })
})

app.get('/vistoria/usuarios/tipo/:tipo', function(req, res) {
    const tipo = req.params.tipo

    UsuarioDB.getUsuarioByTipo(tipo, function(usuarios) {
        res.json(usuarios)
    })
})

app.post('/vistoria/usuarios', function(req, res) {
    const usuario = req.body

    UsuarioDB.saveUsuario(usuario, function(usuario) {
        res.json(usuario)        
    })
})

app.delete('/vistoria/usuarios/:id', function(req, res) {
    const id = parseInt(req.params.id)

    if(isNaN(id))
    {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.deleteUsuario(id, function(affectedRows) {
        res.json({
            msg: 'cliente deletado'
        })
    })
})

app.put('/vistoria/usuarios/:id', function(req, res) {
    const update = req.body
    const id = parseInt(req.params.id)

    if(isNaN(id))
    {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.updateUsuario(id, update, function(usuario) {
        res.json({
            msg: 'produto atualizado com sucesso'
        })
    })
})

app.patch('/vistoria/usuarios/:id', function(req, res) {
    const update = req.body
    const id = parseInt(req.params.id)

    if(isNaN(id))
    {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    UsuarioDB.updateParcialUsuario(id, update, function(usuario) {
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