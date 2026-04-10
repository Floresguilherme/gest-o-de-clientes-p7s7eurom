import pb from '@/lib/pocketbase/client'

export interface Profissional {
  id: string
  codigo: string
  nome: string
  cpf: string
  email: string
  telefone: string
  especialidades: string[]
  chave_pix: string
  comissao_padrao: number
  data_admissao: string
  is_ativo: boolean
  created: string
  updated: string
}

export const getProfissionais = () =>
  pb.collection('profissionais').getFullList<Profissional>({ sort: '-created' })
export const createProfissional = (data: Partial<Profissional>) =>
  pb.collection('profissionais').create<Profissional>(data)
export const updateProfissional = (id: string, data: Partial<Profissional>) =>
  pb.collection('profissionais').update<Profissional>(id, data)
export const deleteProfissional = (id: string) => pb.collection('profissionais').delete(id)
