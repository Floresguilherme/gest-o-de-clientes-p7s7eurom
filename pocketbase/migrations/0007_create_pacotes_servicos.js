migrate(
  (app) => {
    const pacotesId = app.findCollectionByNameOrId('pacotes').id
    const servicosId = app.findCollectionByNameOrId('servicos').id

    const collection = new Collection({
      name: 'pacotes_servicos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'pacote',
          type: 'relation',
          collectionId: pacotesId,
          maxSelect: 1,
          cascadeDelete: true,
          required: true,
        },
        {
          name: 'servico',
          type: 'relation',
          collectionId: servicosId,
          maxSelect: 1,
          cascadeDelete: true,
          required: true,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pacotes_servicos')
    app.delete(collection)
  },
)
