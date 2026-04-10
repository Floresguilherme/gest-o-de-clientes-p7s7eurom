migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'floresguilherme@hotmail.com')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('floresguilherme@hotmail.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Guilherme Flores')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'floresguilherme@hotmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
