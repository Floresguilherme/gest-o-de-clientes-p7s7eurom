migrate(
  (app) => {
    const collection = new Collection({
      name: 'servicos',
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
        { name: 'preco_base', type: 'number', required: true },
        { name: 'duracao_minutos', type: 'number', required: true, min: 1 },
        {
          name: 'categoria',
          type: 'select',
          values: ['depilação', 'design de sobrancelha', 'limpeza de pele', 'massagem', 'outros'],
          maxSelect: 1,
          required: true,
        },
        { name: 'is_ativo', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_servicos_codigo ON servicos (codigo)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('servicos')
    app.delete(collection)
  },
)
