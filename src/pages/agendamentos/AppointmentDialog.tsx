import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { getClientes } from '@/services/clientes'
import { getProfissionais } from '@/services/profissionais'
import { getServicos } from '@/services/servicos'
import { createAtendimento } from '@/services/atendimentos'
import { useToast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export default function AppointmentDialog({ open, onOpenChange, onSaved }: Props) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [profissionais, setProfissionais] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])

  const [formData, setFormData] = useState({
    cliente: '',
    profissional: '',
    data: '',
    hora: '',
    status: 'agendado',
    observacoes: '',
    servicosIds: [] as string[],
  })

  useEffect(() => {
    if (open) {
      Promise.all([getClientes(), getProfissionais(), getServicos()]).then(([cls, prs, srvs]) => {
        setClientes(cls)
        setProfissionais(prs)
        setServicos(srvs)
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.cliente ||
      !formData.profissional ||
      !formData.data ||
      !formData.hora ||
      formData.servicosIds.length === 0
    ) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios e selecione ao menos um serviço.',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const data_hora = new Date(`${formData.data}T${formData.hora}:00`).toISOString()

      await createAtendimento(
        {
          cliente: formData.cliente,
          profissional: formData.profissional,
          data_hora,
          status: formData.status,
          observacoes: formData.observacoes,
        },
        formData.servicosIds,
      )

      toast({ title: 'Sucesso', description: 'Agendamento criado com sucesso.' })
      onSaved()
      onOpenChange(false)
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message || 'Erro ao salvar', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const toggleServico = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      servicosIds: prev.servicosIds.includes(id)
        ? prev.servicosIds.filter((s) => s !== id)
        : [...prev.servicosIds, id],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select
                value={formData.cliente}
                onValueChange={(v) => setFormData({ ...formData, cliente: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Profissional *</Label>
              <Select
                value={formData.profissional}
                onValueChange={(v) => setFormData({ ...formData, profissional: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {profissionais.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hora *</Label>
              <Input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Serviços *</Label>
            <div className="border rounded-md p-3 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {servicos.map((s) => (
                <div key={s.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`s-${s.id}`}
                    checked={formData.servicosIds.includes(s.id)}
                    onCheckedChange={() => toggleServico(s.id)}
                  />
                  <Label htmlFor={`s-${s.id}`} className="text-sm font-normal">
                    {s.nome}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#3B82F6] hover:bg-blue-600">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
