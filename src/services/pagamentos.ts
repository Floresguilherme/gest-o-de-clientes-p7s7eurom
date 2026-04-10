import pb from '@/lib/pocketbase/client'

export const getPagamentos = () =>
  pb.collection('pagamentos').getFullList({
    expand: 'atendimento,atendimento.cliente',
    sort: '-created',
  })

export const createPagamento = async (data: any, parcelas: number) => {
  const pagamento = await pb.collection('pagamentos').create(data)

  if (data.tipo_pagamento === 'parcelado') {
    const valorParcela = data.valor_final / parcelas
    for (let i = 1; i <= parcelas; i++) {
      const dueDate = new Date()
      dueDate.setMonth(dueDate.getMonth() + i)

      await pb.collection('pagamentos_parcelas').create({
        pagamento: pagamento.id,
        numero_parcela: i,
        valor: valorParcela,
        data_vencimento: dueDate.toISOString(),
        status: i === 1 ? 'pago' : 'pendente',
      })
    }
  }

  // Comissoes integration
  const atendimento = await pb
    .collection('atendimentos')
    .getOne(data.atendimento, { expand: 'profissional' })
  const prof = await pb.collection('profissionais').getOne(atendimento.profissional)
  const servicos = await pb
    .collection('atendimentos_servicos')
    .getFullList({ filter: `atendimento = '${atendimento.id}'` })

  for (const as of servicos) {
    const comissao = (as.valor_pago * (prof.comissao_padrao || 0)) / 100
    if (comissao > 0) {
      await pb.collection('comissoes_profissionais').create({
        profissional: prof.id,
        atendimento: atendimento.id,
        servico: as.servico,
        valor_venda: as.valor_pago,
        percentual_comissao: prof.comissao_padrao,
        valor_comissao: comissao,
        status: 'devida',
      })
    }
  }

  return pagamento
}
