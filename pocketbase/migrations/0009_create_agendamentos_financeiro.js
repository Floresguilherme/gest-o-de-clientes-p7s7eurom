migrate(
  (app) => {
    const atendimentos = new Collection({
      name: 'atendimentos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('clientes').id,
          maxSelect: 1,
        },
        {
          name: 'profissional',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('profissionais').id,
          maxSelect: 1,
        },
        { name: 'data_hora', type: 'date', required: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['agendado', 'realizado', 'cancelado', 'não compareceu'],
        },
        { name: 'observacoes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(atendimentos)

    const atendimentos_servicos = new Collection({
      name: 'atendimentos_servicos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'atendimento',
          type: 'relation',
          required: true,
          collectionId: atendimentos.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'servico',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('servicos').id,
          maxSelect: 1,
        },
        { name: 'valor_pago', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(atendimentos_servicos)

    const pagamentos = new Collection({
      name: 'pagamentos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'atendimento',
          type: 'relation',
          required: true,
          collectionId: atendimentos.id,
          maxSelect: 1,
        },
        { name: 'valor_bruto', type: 'number', required: true },
        { name: 'desconto', type: 'number' },
        { name: 'valor_final', type: 'number', required: true },
        {
          name: 'metodo',
          type: 'select',
          required: true,
          values: ['dinheiro', 'débito', 'crédito', 'PIX'],
        },
        {
          name: 'tipo_pagamento',
          type: 'select',
          required: true,
          values: ['à vista', 'parcelado'],
        },
        { name: 'parcelas', type: 'number', required: true },
        { name: 'status', type: 'select', required: true, values: ['pago', 'pendente'] },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pagamentos)

    const pagamentos_parcelas = new Collection({
      name: 'pagamentos_parcelas',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'pagamento',
          type: 'relation',
          required: true,
          collectionId: pagamentos.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'numero_parcela', type: 'number', required: true },
        { name: 'valor', type: 'number', required: true },
        { name: 'data_vencimento', type: 'date', required: true },
        { name: 'status', type: 'select', required: true, values: ['pendente', 'pago'] },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pagamentos_parcelas)

    const comissoes = new Collection({
      name: 'comissoes_profissionais',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'profissional',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('profissionais').id,
          maxSelect: 1,
        },
        {
          name: 'atendimento',
          type: 'relation',
          required: true,
          collectionId: atendimentos.id,
          maxSelect: 1,
        },
        {
          name: 'servico',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('servicos').id,
          maxSelect: 1,
        },
        { name: 'valor_venda', type: 'number', required: true },
        { name: 'percentual_comissao', type: 'number', required: true },
        { name: 'valor_comissao', type: 'number', required: true },
        { name: 'status', type: 'select', required: true, values: ['devida', 'paga'] },
        { name: 'data_pagamento', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(comissoes)

    const agenda = new Collection({
      name: 'agenda',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'profissional',
          type: 'relation',
          required: true,
          collectionId: app.findCollectionByNameOrId('profissionais').id,
          maxSelect: 1,
        },
        { name: 'dia_semana', type: 'number', required: true },
        { name: 'hora_inicio', type: 'text', required: true },
        { name: 'hora_fim', type: 'text', required: true },
        { name: 'is_disponivel', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(agenda)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('agenda'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('comissoes_profissionais'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('pagamentos_parcelas'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('pagamentos'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('atendimentos_servicos'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('atendimentos'))
    } catch (_) {}
  },
)
