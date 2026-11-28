var express = require('express')
var cors = require('cors')
const path = require('path')
var app = express()
var UsuarioDB = require('./UsuarioDB')
var VistoriaDB = require('./VistoriaDB.js')
var OcorrenciaDB = require('./OcorrenciaDB.js')
const CaminhaoController = require('./CaminhaoController');

const VistoriaController = require('./Controller.js')

const controller = new VistoriaController();

app.use(cors())
app.use(express.json())


//Retorna o index qnd não há mais nada na url
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../vistoria.html')); 
});



//get VISTORIAS
app.get('/vistoria/vistorias', (req, res) => {
    VistoriaDB.getVistorias(function(vistorias) {
        res.json(vistorias)
    })
})



//get OCORRêNCIAS
app.get('/vistoria/ocorrencias', (req, res) => {
    OcorrenciaDB.getOcorrencias((error, ocorrencias) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Erro ao consultar ocorrências.' });
        }
        return res.json(ocorrencias);
    });
});

app.get('/vistoria/ocorrencias/:id', (req, res) => {
    const id = req.params.id
    if(isNaN(id)) {
        res.send({
            msg: 'ID inválido'
        })
        return
    }
    OcorrenciaDB.getOcorrenciasByVistoria(id, function(vistoria) {
        res.json(vistoria)
    })
})

app.post('/vistoria/ocorrencias', (req, res) => {
    const ocorrencia = req.body

    OcorrenciaDB.saveOcorrencia(ocorrencia, function (ocorrencia) {
        res.json(ocorrencia)
    })    
})



//get VISTORIAS
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

app.patch('/vistoria/vistorias/:id', (req, res) => {
    const update = req.body
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
        res.send({
            msg: 'ID inválido'
        })
        return
    }

    VistoriaDB.updateParcialVistoria(id, update, function (usuario) {
        res.json({
            msg: 'usuário atualizado com sucesso'
        })
    })    
})



//get ITENS
app.get('/vistoria/itens/:id', (req, res) => {
    const id = parseInt(req.params.id)

    VistoriaDB.getItensByVistoria(id, function(vistorias) {
        res.json(vistorias)
    })
})



// get USUARIOS
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

app.get('/vistoria/usuarios/email/:email', function (req, res) {
    const email = req.params.email

    UsuarioDB.getUsuarioByEmail(email, function (usuario) {
        res.json(usuario)
    })
})

//post USUARIOS
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

app.post('/vistoria/caminhoes', (req, res) => {
    const dados = req.body
    CaminhaoController.cadastrarCaminhao(dados, (error, resultado) => {
        if(error){
            console.error(error)
            if(error.status)
                return res.status(error.status).json({msg: error.message})

             if(error.code === 'ER_DUP_ENTRY')
            return res.status(400).json({msg: 'Já existe um caminhão cadastrado com essa placa.'})

            return res.status(500).json({msg: 'Erro ao cadastrar caminhao'})
        }
       
        return res.status(201).json({msg: 'Caminhão cadastrado', caminhao: resultado})

    })
})

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

//patch USUARIOS
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

//delete USUARIOS
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



//get CAMINHÕES
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



const server = app.listen(3000, () => {
    const host = server.address().address
    const port = server.address().port

    console.log(`Server iniciado em: http://localhost:${port}`)
})