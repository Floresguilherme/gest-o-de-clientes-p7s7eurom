import pb from '@/lib/pocketbase/client'

export const getServicos = () => pb.collection('servicos').getFullList()
