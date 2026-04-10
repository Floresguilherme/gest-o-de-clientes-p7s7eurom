migrate(
  (app) => {
    const collection = new Collection({
      name: 'profissionais',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'codigo', type: 'text' },
        { name: 'nome', type: 'text', required: true },
        { name: 'cpf', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'telefone', type: 'text', required: true },
        { name: 'especialidades', type: 'json' },
        { name: 'chave_pix', type: 'text' },
        { name: 'comissao_padrao', type: 'number', required: true, min: 0, max: 100 },
        { name: 'data_admissao', type: 'text', required: true },
        { name: 'is_ativo', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_profissionais_codigo ON profissionais (codigo)',
        'CREATE UNIQUE INDEX idx_profissionais_cpf ON profissionais (cpf)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('profissionais')
    app.delete(collection)
  },
)
