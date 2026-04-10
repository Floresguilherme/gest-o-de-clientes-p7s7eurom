onRecordCreate(
  (e) => {
    const collection = e.collection.name
    let prefix = ''
    let field = 'codigo'

    if (collection === 'clientes') {
      prefix = 'CLI-'
      field = 'codigo_interno'
    } else if (collection === 'profissionais') {
      prefix = 'PRF-'
    } else if (collection === 'servicos') {
      prefix = 'SER-'
    } else if (collection === 'pacotes') {
      prefix = 'PAC-'
    } else {
      return e.next()
    }

    try {
      const records = $app.findRecordsByFilter(collection, `${field} != ''`, `-${field}`, 1, 0)
      if (records.length > 0) {
        const lastCode = records[0].get(field)
        const parts = lastCode.split('-')
        const numStr = parts.length > 1 ? parts[1] : ''
        const num = parseInt(numStr, 10)
        const nextNum = isNaN(num) ? 1 : num + 1
        e.record.set(field, prefix + String(nextNum).padStart(7, '0'))
      } else {
        e.record.set(field, prefix + '0000001')
      }
    } catch (err) {
      e.record.set(field, prefix + '0000001')
    }

    e.next()
  },
  'clientes',
  'profissionais',
  'servicos',
  'pacotes',
)
