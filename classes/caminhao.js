class Caminhao {

    constructor(placa, modelo, marca, ano, capacidade, peso, numEixos) {
        this.setPlaca(placa);
        this.setModelo(modelo);
        this.setMarca(marca);
        this.setAno(ano);
        this.setCapacidade(capacidade);
        this.setPeso(peso);
        this.setNumEixos(numEixos);
    }


    getPlaca() {
        return this.placa;
    }

    getModelo() {
        return this.modelo;
    }

    getMarca() {
        return this.marca;
    }

    getAno() {
        return this.ano;
    }

    getCapacidade() {
        return this.capacidade;
    }

    getPeso() {
        return this.peso;
    }

    getNumEixos() {
        return this.numEixos;
    }


    setPlaca(placa) {
        if (!placa || !/^[A-Z0-9]{7}$/.test(placa.toUpperCase()))
            throw new Error('Placa inválida.');

        this.placa = placa.toUpperCase();
    }

    setModelo(modelo) {
        if (!modelo || !modelo.trim())
            throw new Error('Modelo do caminhão é obrigatório!!!')
        this.modelo = modelo.trim();
    }

    setMarca(marca) {
        if (!marca || !marca.trim())
            throw new Error('Marca do caminhão é obrigatório!!!')
        this.marca = marca.trim();
    }

    setAno(ano) {
        this.ano = ano;
    }

    setCapacidade(capacidade) {
        if (!Number.isFinite(Number(capacidade)) || Number(capacidade) <= 0)
            throw new Error('Capacidade precisa ser maior que 0')
        this.capacidade = Number(capacidade);
    }

    setPeso(peso) {
        if (!Number.isFinite(Number(peso)) || Number(peso) <= 0)
            throw new Error('Peso prcisa ser maior que 0')
        this.peso = Number(peso);

    }

    setNumEixos(numEixos) {
        if (!Number.isInteger(Number(numEixos)) || Number(numEixos) <= 0)
            throw new Error('Número de eixos inválido')
        this.numEixos = Number(numEixos);
    }

}

module.exports = Caminhao;