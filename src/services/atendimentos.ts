import pb from '@/lib/pocketbase/client'

export const getAtendimentos = () =>
  pb.collection('atendimentos').getFullList({
    expand: 'cliente,profissional',
    sort: '-data_hora',
  })

export const getAtendimentosServicos = () =>
  pb.collection('atendimentos_servicos').getFullList({
    expand: 'servico',
  })

export const createAtendimento = async (data: any, servicoIds: string[]) => {
  const atendimento = await pb.collection('atendimentos').create(data)

  for (const servicoId of servicoIds) {
    const servico = await pb.collection('servicos').getOne(servicoId)
    await pb.collection('atendimentos_servicos').create({
      atendimento: atendimento.id,
      servico: servico.id,
      valor_pago: servico.preco_base,
    })
  }
  return atendimento
}

export const updateAtendimentoStatus = (id: string, status: string) => {
  return pb.collection('atendimentos').update(id, { status })
}
