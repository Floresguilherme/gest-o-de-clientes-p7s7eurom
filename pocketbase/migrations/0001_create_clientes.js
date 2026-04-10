migrate(
  (app) => {
    const collection = new Collection({
      name: 'clientes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'codigo_interno', type: 'text', required: true },
        { name: 'nome', type: 'text', required: true },
        { name: 'cpf', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'telefone1', type: 'text', required: true },
        { name: 'telefone2', type: 'text' },
        { name: 'data_nascimento', type: 'text' },
        { name: 'endereco', type: 'text' },
        { name: 'cidade', type: 'text' },
        { name: 'estado', type: 'text' },
        { name: 'cep', type: 'text' },
        { name: 'observacoes', type: 'text' },
        { name: 'is_ativo', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_clientes_codigo ON clientes (codigo_interno)',
        'CREATE UNIQUE INDEX idx_clientes_cpf ON clientes (cpf)',
        'CREATE INDEX idx_clientes_nome ON clientes (nome)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('clientes')
    app.delete(collection)
  },
)
