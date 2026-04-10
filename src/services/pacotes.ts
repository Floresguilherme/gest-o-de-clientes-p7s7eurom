import pb from '@/lib/pocketbase/client'

export interface Pacote {
  id: string
  codigo: string
  nome: string
  descricao: string
  valor_total: number
  quantidade_sessoes: number
  validade_dias: number
  is_ativo: boolean
  created: string
  updated: string
  expand?: {
    'pacotes_servicos(pacote)'?: Array<{
      id: string
      servico: string
      expand?: {
        servico: {
          id: string
          nome: string
          preco_base: number
        }
      }
    }>
  }
}

export const getPacotes = () =>
  pb
    .collection('pacotes')
    .getFullList<Pacote>({ sort: '-created', expand: 'pacotes_servicos(pacote).servico' })

export const createPacote = async (data: Partial<Pacote>, servicosIds: string[]) => {
  const pacote = await pb.collection('pacotes').create<Pacote>(data)
  for (const servicoId of servicosIds) {
    await pb.collection('pacotes_servicos').create({ pacote: pacote.id, servico: servicoId })
  }
  return pacote
}

export const updatePacote = async (id: string, data: Partial<Pacote>, servicosIds?: string[]) => {
  const pacote = await pb.collection('pacotes').update<Pacote>(id, data)
  if (servicosIds) {
    const existing = await pb
      .collection('pacotes_servicos')
      .getFullList({ filter: `pacote = "${id}"` })
    for (const rel of existing) {
      if (!servicosIds.includes(rel.servico)) {
        await pb.collection('pacotes_servicos').delete(rel.id)
      }
    }
    const existingServicoIds = existing.map((e) => e.servico)
    for (const servicoId of servicosIds) {
      if (!existingServicoIds.includes(servicoId)) {
        await pb.collection('pacotes_servicos').create({ pacote: id, servico: servicoId })
      }
    }
  }
  return pacote
}

export const deletePacote = (id: string) => pb.collection('pacotes').delete(id)
