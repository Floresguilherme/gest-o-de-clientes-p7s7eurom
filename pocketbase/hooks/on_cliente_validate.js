onRecordValidate((e) => {
  if (e.action === 'create' && !e.record.get('codigo_interno')) {
    const code =
      'CLI-' + $security.randomStringWithAlphabet(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    e.record.set('codigo_interno', code)
  }

  if (e.record.get('is_ativo') === null || e.record.get('is_ativo') === undefined) {
    e.record.set('is_ativo', true)
  }

  e.next()
}, 'clientes')
