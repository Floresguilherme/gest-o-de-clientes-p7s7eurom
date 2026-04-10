import pb from '@/lib/pocketbase/client'

export const getClientes = () => pb.collection('clientes').getFullList()

export const createCliente = (data: any) => pb.collection('clientes').create(data)

export const updateCliente = (id: string, data: any) => pb.collection('clientes').update(id, data)

export const deleteCliente = (id: string) => pb.collection('clientes').delete(id)
