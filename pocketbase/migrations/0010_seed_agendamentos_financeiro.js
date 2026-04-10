migrate(
  (app) => {
    try {
      const clientes = app.findRecordsByFilter('clientes', '1=1', '', 1, 0)
      const profissionais = app.findRecordsByFilter('profissionais', '1=1', '', 1, 0)
      const servicos = app.findRecordsByFilter('servicos', '1=1', '', 1, 0)

      if (!clientes.length || !profissionais.length || !servicos.length) return

      const clienteId = clientes[0].get('id')
      const profId = profissionais[0].get('id')
      const servId = servicos[0].get('id')
      const preco = servicos[0].get('preco_base')

      // Seed 1: Atendimento Agendado (Hoje)
      const today = new Date()
      today.setHours(14, 0, 0, 0)

      const colAtendimentos = app.findCollectionByNameOrId('atendimentos')
      const at1 = new Record(colAtendimentos)
      at1.set('cliente', clienteId)
      at1.set('profissional', profId)
      at1.set('data_hora', today.toISOString().replace('T', ' '))
      at1.set('status', 'agendado')
      at1.set('observacoes', 'Primeira sessão')
      app.save(at1)

      const colAtendServ = app.findCollectionByNameOrId('atendimentos_servicos')
      const as1 = new Record(colAtendServ)
      as1.set('atendimento', at1.get('id'))
      as1.set('servico', servId)
      as1.set('valor_pago', preco)
      app.save(as1)

      // Seed 2: Atendimento Realizado (Ontem) - Pendente de pagamento
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(10, 0, 0, 0)

      const at2 = new Record(colAtendimentos)
      at2.set('cliente', clienteId)
      at2.set('profissional', profId)
      at2.set('data_hora', yesterday.toISOString().replace('T', ' '))
      at2.set('status', 'realizado')
      at2.set('observacoes', 'Sessão concluída com sucesso')
      app.save(at2)

      const as2 = new Record(colAtendServ)
      as2.set('atendimento', at2.get('id'))
      as2.set('servico', servId)
      as2.set('valor_pago', preco)
      app.save(as2)
    } catch (err) {
      console.log('Seed agendamentos failed: ', err)
    }
  },
  (app) => {
    try {
      app.db().newQuery('DELETE FROM atendimentos_servicos').execute()
      app.db().newQuery('DELETE FROM atendimentos').execute()
    } catch (_) {}
  },
)
