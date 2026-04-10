migrate(
  (app) => {
    const collection = new Collection({
      name: 'pacotes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'codigo', type: 'text' },
        { name: 'nome', type: 'text', required: true },
        { name: 'descricao', type: 'text' },
        { name: 'valor_total', type: 'number', required: true },
        { name: 'quantidade_sessoes', type: 'number', required: true, min: 1 },
        { name: 'validade_dias', type: 'number', required: true, min: 1 },
        { name: 'is_ativo', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_pacotes_codigo ON pacotes (codigo)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pacotes')
    app.delete(collection)
  },
)
