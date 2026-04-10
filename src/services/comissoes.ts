import pb from '@/lib/pocketbase/client'

export const getComissoes = () =>
  pb.collection('comissoes_profissionais').getFullList({
    expand: 'profissional,atendimento,servico',
    sort: '-created',
  })

export const pagarComissoes = async (ids: string[]) => {
  const data_pagamento = new Date().toISOString()
  const results = []
  for (const id of ids) {
    const res = await pb.collection('comissoes_profissionais').update(id, {
      status: 'paga',
      data_pagamento,
    })
    results.push(res)
  }
  return results
}
