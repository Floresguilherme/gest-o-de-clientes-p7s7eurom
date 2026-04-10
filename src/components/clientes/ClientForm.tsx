import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { maskCPF, maskPhone, maskCEP } from '@/lib/masks'
import { Cliente, createCliente, updateCliente } from '@/services/clientes'
import { toast } from 'sonner'

const clientSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().min(14, 'CPF inválido'),
  email: z.string().email('Email inválido'),
  telefone1: z.string().min(14, 'Telefone inválido'),
  telefone2: z.string().optional(),
  data_nascimento: z.string().optional(),
  cep: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  observacoes: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  initialData?: Cliente | null
  onSuccess: () => void
  onCancel: () => void
}

export function ClientForm({ initialData, onSuccess, onCancel }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData || { estado: 'SP' },
  })

  const onSubmit = async (data: ClientFormValues) => {
    try {
      if (initialData?.id) {
        await updateCliente(initialData.id, data)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await createCliente(data)
        toast.success('Cliente cadastrado com sucesso!')
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error?.response?.message || 'Erro ao salvar cliente')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {initialData?.codigo_interno && (
        <div className="space-y-1">
          <Label>Código Interno</Label>
          <Input value={initialData.codigo_interno} disabled className="bg-muted" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Nome *</Label>
          <Input {...register('nome')} placeholder="Ex: João da Silva" />
          {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>CPF *</Label>
          <Input
            {...register('cpf')}
            placeholder="000.000.000-00"
            onChange={(e) => setValue('cpf', maskCPF(e.target.value))}
          />
          {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Email *</Label>
          <Input type="email" {...register('email')} placeholder="joao@exemplo.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Telefone 1 *</Label>
          <Input
            {...register('telefone1')}
            placeholder="(00) 00000-0000"
            onChange={(e) => setValue('telefone1', maskPhone(e.target.value))}
          />
          {errors.telefone1 && (
            <p className="text-xs text-destructive">{errors.telefone1.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label>Telefone 2</Label>
          <Input
            {...register('telefone2')}
            placeholder="(00) 00000-0000"
            onChange={(e) => setValue('telefone2', maskPhone(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>Data de Nascimento</Label>
          <Input type="date" {...register('data_nascimento')} />
        </div>
        <div className="space-y-1">
          <Label>CEP</Label>
          <Input
            {...register('cep')}
            placeholder="00000-000"
            onChange={(e) => setValue('cep', maskCEP(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>Estado</Label>
          <Input {...register('estado')} placeholder="Ex: SP" maxLength={2} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label>Endereço</Label>
          <Input {...register('endereco')} placeholder="Rua, Número, Bairro" />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label>Cidade</Label>
          <Input {...register('cidade')} placeholder="Cidade" />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label>Observações</Label>
          <Textarea {...register('observacoes')} placeholder="Detalhes adicionais..." />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
