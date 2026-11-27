export class Vistoria {
    #codVistoria
    getCod() {
        return this.#codVistoria
    }

    #dataAbertura
    getAbertura() {
        return this.#dataAbertura
    }
    setAbertura(value) {
        if (value !== null && !this.validarData(value))
            throw new Error('Data de abertura inválida')
        this.#dataAbertura = value
    }

    #dataFechamento
    getFechamento() {
        return this.#dataFechamento
    }
    setFechamento(value) {
        if (value !== null && !this.validarData(value))
            throw new Error('Data de fechamento inválida')
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
        const horarioValido = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value);
        if (!horarioValido)
            throw new Error('Horário inválido')
        this.#horarioPrevisto = value
    }

    #descricao
    getDesc() {
        return this.#descricao
    }
    setDesc(value) {
        if (value !== null && typeof value !== "string")
            throw new Error("A descrição deve ser um texto");

        if (value !== null && value.length > 180)
            throw new Error("A descrição deve ter no máximo 180 caracteres");

        this.#descricao = value;
    }


    #status
    getStatus() {
        return this.#status
    }
    setStatus(value) {
        if (typeof value !== "boolean")
            throw new Error('O status deve ser verdadeiro ou falso')

        this.#status = value;
    }

    #idAnalista
    getAnalista() {
        return this.#idAnalista
    }
    setAnalista(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0)
            throw new Error('ID analista inválido')

        this.#idAnalista = Number(value)
    }

    #idOperador
    getOperador() {
        return this.#idOperador
    }
    setOperador(value) {
        if (!Number.isInteger(Number(value)) || Number(value) <= 0)
            throw new Error('ID do operador inválido')

        this.#idOperador = Number(value)
    }

    #placa
    getPlaca() {
        return this.#placa
    }
    setPlaca(value) {
        if (typeof value !== "string")
            throw new Error("A placa deve ser um texto")
        value = value.trim().toUpperCase();
        const placaValida = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(value)

        if (!placaValida)
            throw new Error("Placa inválida")

        this.#placa = value
    }

    #itens

    getItens() {
        return this.#itens;
    }

    setItens(value) {
    if (!Array.isArray(value))
        throw new Error("Lista de itens inválida");

    if (!value.every(item =>
        typeof item === "string" && item.trim().length > 0
    ))
        throw new Error("Existem itens inválidos na lista");

    this.#itens = value.map(item => item.trim());
}

    validarData(value) {
        if (typeof value !== "string")
            return false

        if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
            return false
        const [ano, mes, dia] = value.split('-').map(Number)
        const data = new Date(ano, mes - 1, dia)
        return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
    }

    constructor(previsao, horario, placa, analista, operador, descricao, itens) {
        this.#codVistoria = null;
        this.#dataAbertura = null;
        this.#dataFechamento = null;
        this.#status = false;

        this.setPrevisao(previsao);
        this.setHorario(horario);
        this.setPlaca(placa);
        this.setAnalista(analista);
        this.setOperador(operador);
        this.setDesc(descricao);
        this.setItens(itens);
    }
}