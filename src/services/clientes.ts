import pb from '@/lib/pocketbase/client'

export interface Cliente {
  id: string
  codigo_interno: string
  nome: string
  cpf: string
  email: string
  telefone1: string
  telefone2?: string
  data_nascimento?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  observacoes?: string
  is_ativo: boolean
  created: string
  updated: string
}

export const getClientes = async (
  page: number,
  perPage: number,
  search: string = '',
  sort: string = '-created',
) => {
  let filter = ''
  if (search) {
    filter = `nome ~ "${search}" || cpf ~ "${search}"`
  }
  return pb.collection('clientes').getList<Cliente>(page, perPage, {
    sort,
    filter,
  })
}

export const createCliente = async (data: Partial<Cliente>) => {
  return pb.collection('clientes').create<Cliente>(data)
}

export const updateCliente = async (id: string, data: Partial<Cliente>) => {
  return pb.collection('clientes').update<Cliente>(id, data)
}

export const deleteCliente = async (id: string) => {
  return pb.collection('clientes').delete(id)
}
