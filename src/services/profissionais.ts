import pb from '@/lib/pocketbase/client'

export const getProfissionais = () => pb.collection('profissionais').getFullList()

export const createProfissional = (data: any) => pb.collection('profissionais').create(data)

export const updateProfissional = (id: string, data: any) =>
  pb.collection('profissionais').update(id, data)

export const deleteProfissional = (id: string) => pb.collection('profissionais').delete(id)
