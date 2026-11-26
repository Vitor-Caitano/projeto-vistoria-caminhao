export class Vistoria
{
    #codVistoria
    getCod() {
        return this.#codVistoria
    }

    #dataAbertura
    getAbertura() {
        return this.#dataAbertura
    }
    setAbertura(value) {
        this.#dataAbertura = value
    }

    #dataFechamento
    getFechamento() {
        return this.#dataFechamento
    }
    setFechamento(value) {
        this.#dataFechamento = value
    }

    #dataPrevista
    getPrevisao() {
        return this.#dataPrevista
    }
    setPrevisao(value) {
        this.#dataPrevista = value
    }

    #horarioPrevisto
    getHorario() {
        return this.#horarioPrevisto
    }
    setHorario(value) {
        this.#horarioPrevisto = value
    }

    #descricao
    getDesc() {
        return this.#descricao
    }
    setDesc(value) {
        this.#descricao = value
    }

    #status
    getStatus() {
        return this.#status
    }
    setStatus() {
        if(this.#status)
            this.#status = false
        else
            this.#status = true
    }

    #idAnalista
    getAnalista() {
        return this.#idAnalista
    }
    setAnalista(value) {
        if(isNaN(value))
            console.log("São aceitos somente valores numéricos para encontrar o analista")
        else
            this.#idAnalista = value
    }

    #idOperador
    getOperador() {
        return this.#idOperador
    }
    setOperador(value) {
        if(isNaN(value))
            console.log("São aceitos somente valores numéricos para encontrar o operador")
        else
            this.#idOperador = value
    }

    #placa
    getPlaca() {
        return this.#placa
    }
    setPlaca(value) {
        this.#placa = value
    }

    constructor(cod, abertura, fechamento, previsao, horario, placa, analista, operador, status, descricao)
    {
        this.#codVistoria = cod
        this.#dataAbertura = abertura
        this.#dataFechamento = fechamento
        this.#dataPrevista = previsao
        this.#placa = placa
        this.#horarioPrevisto = horario
        this.#idAnalista = analista
        this.#idOperador = operador
        this.#status = status
        this.#descricao = descricao
    }
}