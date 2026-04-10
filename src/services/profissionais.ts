import pb from '@/lib/pocketbase/client'

export const getProfissionais = () => pb.collection('profissionais').getFullList()
