export class Usuario
{
    #idUsuario
    getId() {
        return this.#idUsuario
    }

    #nome
    getNome() {
        return this.#nome
    }
    setNome(value) {
        this.#nome = value
    }

    #tipoUsuario
    getTipo() {
        return this.#tipoUsuario
    }
    setTipo(value) {
        if(value == 'operador' || value == 'analista')
            this.#tipoUsuario = value
        else
            console.log("São aceitos somente os tipos analista e operador!")
    }

    #email
    getEmail() {
        return this.#email
    }
    setEmail(value) {
        this.#email = value
    }

    #senha
    getSenha() {
        return this.#senha
    }
    setSenha(value) {
        this.#senha = value
    }

    #ativo
    getStatusAtivo() {
        return this.#ativo
    }
    setStatusAtivo() {
        if(this.#ativo)
            this.#ativo = false
        else
            this.#ativo = true
    }

    #dataAdesao
    getAdesao() {
        return this.#dataAdesao
    }
    setAdesao(value) {
        this.#dataAdesao = value
    }

    #numVistorias
    getNumVistorias() {
        return this.#numVistorias
    }
    setNumVistorias(value) {
        if(isNaN(value))
            console.log("São aceitos somente valores numéricos para número de vistorias")
        else
            this.#numVistorias = value
    }

    #numOcorrencias
    getNumOcorrencias() {
        return this.#numOcorrencias
    }
    setNumOcorrencias(value) {
        if(isNaN(value))
            console.log("São aceitos somente valores numéricos para número de ocorrências")
        else
            this.#numOcorrencias = value
    }

    constructor(nome, id, email, nVistorias, nOcorrencias, dataAdesao, tipoUsuario)
    {
        this.#nome = nome
        this.#idUsuario = id
        this.#numVistorias = nVistorias
        this.#numOcorrencias = nOcorrencias
        this.#dataAdesao = dataAdesao
        this.#tipoUsuario = tipoUsuario
        this.#email = email
    }
}