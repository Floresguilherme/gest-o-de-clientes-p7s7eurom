migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('clientes')

    const clients = [
      {
        nome: 'Juliana Silva',
        cpf: '111.111.111-11',
        email: 'juliana@example.com',
        telefone1: '(11) 99999-1111',
        is_ativo: true,
        codigo_interno: 'CLI-J8X9A',
      },
      {
        nome: 'Marina Costa',
        cpf: '222.222.222-22',
        email: 'marina@example.com',
        telefone1: '(21) 98888-2222',
        is_ativo: true,
        codigo_interno: 'CLI-M2B4C',
      },
      {
        nome: 'Roberto Almeida',
        cpf: '333.333.333-33',
        email: 'roberto@example.com',
        telefone1: '(31) 97777-3333',
        is_ativo: true,
        codigo_interno: 'CLI-R5T6Y',
      },
      {
        nome: 'Carla Mendes',
        cpf: '444.444.444-44',
        email: 'carla@example.com',
        telefone1: '(41) 96666-4444',
        is_ativo: true,
        codigo_interno: 'CLI-C7U8I',
      },
      {
        nome: 'Fernando Souza',
        cpf: '555.555.555-55',
        email: 'fernando@example.com',
        telefone1: '(51) 95555-5555',
        is_ativo: true,
        codigo_interno: 'CLI-F9O0P',
      },
    ]

    for (const data of clients) {
      try {
        app.findFirstRecordByData('clientes', 'cpf', data.cpf)
      } catch (_) {
        const record = new Record(col)
        Object.entries(data).forEach(([key, val]) => record.set(key, val))
        app.save(record)
      }
    }
  },
  (app) => {
    // Simplistic down migration: truncate
    const col = app.findCollectionByNameOrId('clientes')
    app.truncateCollection(col)
  },
)
