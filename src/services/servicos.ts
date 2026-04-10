import pb from '@/lib/pocketbase/client'

export interface Servico {
  id: string
  codigo: string
  nome: string
  descricao: string
  preco_base: number
  duracao_minutos: number
  categoria: string
  is_ativo: boolean
  created: string
  updated: string
}

export const getServicos = () => pb.collection('servicos').getFullList<Servico>({ sort: 'nome' })
export const createServico = (data: Partial<Servico>) =>
  pb.collection('servicos').create<Servico>(data)
export const updateServico = (id: string, data: Partial<Servico>) =>
  pb.collection('servicos').update<Servico>(id, data)
export const deleteServico = (id: string) => pb.collection('servicos').delete(id)
