class VistoriaController {

    validarVistoria(dados) {

        if (!dados.ID_Analista || !dados.ID_Operador || !dados.Placa || !dados.Data_Prevista || !dados.Horario_Previsto)
            return "Preencha todos os campos obrigatórios.";

        if (!Number.isInteger(Number(dados.ID_Analista)) || Number(dados.ID_Analista) <= 0)
            return "ID do analista inválido.";

        if (!Number.isInteger(Number(dados.ID_Operador)) || Number(dados.ID_Operador) <= 0)
            return "ID do operador inválido.";

        if (typeof dados.Placa !== "string" || dados.Placa.trim() === "")
            return "Placa do caminhão inválida.";

        dados.Placa = dados.Placa.trim().toUpperCase();

        const placaValida = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(dados.Placa);

        if (!placaValida)
            return "Formato de placa inválido.";

        const data = dados.Data_Prevista;

        if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data))
            return "Data prevista inválida.";

        const [ano, mes, dia] = data.split("-").map(Number);
        const dataValidada = new Date(Date.UTC(ano, mes - 1, dia));

        if (dataValidada.getUTCFullYear() !== ano || dataValidada.getUTCMonth() !== mes - 1 || dataValidada.getUTCDate() !== dia)
            return "Data prevista inexistente.";

        const horario = dados.Horario_Previsto;

        if (typeof horario !== "string" || !/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(horario))
            return "Horário previsto inválido.";

        if (dados.Descricao != null && typeof dados.Descricao !== "string")
            return "Descrição inválida.";

        if (dados.Descricao != null && dados.Descricao.length > 180)
            return "A descrição deve ter no máximo 180 caracteres.";

        
        if (!Array.isArray(dados.Itens))
            return "Lista de itens inválida.";

        if (!dados.Itens.every(item =>
            typeof item === "string" && item.trim().length > 0
        ))
            return "Existem itens inválidos na lista.";

        dados.Itens = dados.Itens.map(item => item.trim());

        return null;
    }
}

module.exports = VistoriaController;
