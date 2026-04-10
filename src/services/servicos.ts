import pb from '@/lib/pocketbase/client'

export const getServicos = () => pb.collection('servicos').getFullList()

export const createServico = (data: any) => pb.collection('servicos').create(data)

export const updateServico = (id: string, data: any) => pb.collection('servicos').update(id, data)

export const deleteServico = (id: string) => pb.collection('servicos').delete(id)
