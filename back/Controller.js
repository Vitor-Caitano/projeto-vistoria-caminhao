function validarVistoria(vistoria) {
    // Verificar campos obrigatórios
    if (!vistoria.ID_Analista || !vistoria.Placa || !vistoria.Data_Prevista || !vistoria.Horario_Previsto)
        return 'Preencha todos os campos obrigatórios.';

    // Validar ID do analista
    if (!Number.isInteger(vistoria.ID_Analista) || vistoria.ID_Analista <= 0)
        return 'ID do analista inválido.';

    // Validar placa
    if (typeof vistoria.Placa !== 'string' || vistoria.Placa.trim() === '')
        return 'Placa do caminhão inválida.';

    vistoria.Placa = vistoria.Placa.trim().toUpperCase();

    // Validar data
    const data = vistoria.Data_Prevista;

    if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data))
        return 'Data prevista inválida.';

    const [ano, mes, dia] = data.split('-').map(Number);

    const dataValidada = new Date(Date.UTC(ano, mes - 1, dia));

    if (dataValidada.getUTCFullYear() !== ano || dataValidada.getUTCMonth() !== mes - 1 || dataValidada.getUTCDate() !== dia)
        return 'Data prevista inexistente.';

    // Validar horário
    const horario = vistoria.Horario_Previsto;

    if (typeof horario !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(horario))
        return 'Horário previsto inválido.';

    // Validar descrição
    if (vistoria.Descricao != null && typeof vistoria.Descricao !== 'string')
        return 'Descrição inválida.';

    return null;
}

module.exports = validarVistoria;
