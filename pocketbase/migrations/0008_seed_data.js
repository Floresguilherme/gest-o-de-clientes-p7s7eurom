migrate(
  (app) => {
    // Seed profissional
    try {
      app.findFirstRecordByData('profissionais', 'cpf', '111.111.111-11')
    } catch (_) {
      const profCol = app.findCollectionByNameOrId('profissionais')
      const prof = new Record(profCol)
      prof.set('nome', 'Maria Silva')
      prof.set('cpf', '111.111.111-11')
      prof.set('email', 'maria@clinica.com')
      prof.set('telefone', '(11) 99999-9999')
      prof.set('especialidades', ['massagem', 'limpeza de pele'])
      prof.set('comissao_padrao', 30)
      prof.set('data_admissao', '2024-01-01')
      prof.set('is_ativo', true)
      app.save(prof)
    }

    // Seed servico
    let serv1Id
    try {
      const s1 = app.findFirstRecordByData('servicos', 'nome', 'Limpeza de Pele Profunda')
      serv1Id = s1.id
    } catch (_) {
      const servCol = app.findCollectionByNameOrId('servicos')
      const s1 = new Record(servCol)
      s1.set('nome', 'Limpeza de Pele Profunda')
      s1.set('descricao', 'Limpeza com extração e máscara calmante')
      s1.set('preco_base', 150)
      s1.set('duracao_minutos', 60)
      s1.set('categoria', 'limpeza de pele')
      s1.set('is_ativo', true)
      app.save(s1)
      serv1Id = s1.id
    }

    // Seed pacote
    try {
      app.findFirstRecordByData('pacotes', 'nome', 'Pacote Pele Perfeita')
    } catch (_) {
      const pacCol = app.findCollectionByNameOrId('pacotes')
      const pac = new Record(pacCol)
      pac.set('nome', 'Pacote Pele Perfeita')
      pac.set('descricao', '3 sessões de limpeza de pele com desconto')
      pac.set('valor_total', 400)
      pac.set('quantidade_sessoes', 3)
      pac.set('validade_dias', 90)
      pac.set('is_ativo', true)
      app.save(pac)

      // Relacionar pacote com servico
      const relCol = app.findCollectionByNameOrId('pacotes_servicos')
      const rel = new Record(relCol)
      rel.set('pacote', pac.id)
      rel.set('servico', serv1Id)
      app.save(rel)
    }
  },
  (app) => {
    // no-op down
  },
)
