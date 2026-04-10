import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getPacotes,
  createPacote,
  updatePacote,
  deletePacote,
  type Pacote,
} from '@/services/pacotes'
import { getServicos, type Servico } from '@/services/servicos'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function PacotesPage() {
  const [data, setData] = useState<Pacote[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Pacote>>({ is_ativo: true })
  const [selectedServicos, setSelectedServicos] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const load = async () => {
    try {
      setData(await getPacotes())
      setServicos(await getServicos())
    } catch {
      toast.error('Erro ao carregar dados')
    }
  }
  useEffect(() => {
    load()
  }, [])
  useRealtime('pacotes', load)
  useRealtime('pacotes_servicos', load)

  const filtered = data.filter((d) => d.nome.toLowerCase().includes(search.toLowerCase()))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedServicos.length === 0) return toast.error('Selecione ao menos um serviço')
    try {
      if (editingId) await updatePacote(editingId, formData, selectedServicos)
      else await createPacote(formData, selectedServicos)
      toast.success('Salvo com sucesso!')
      setOpen(false)
      setEditingId(null)
      setFormData({ is_ativo: true })
      setSelectedServicos([])
      setErrors({})
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Verifique os campos obrigatórios')
    }
  }

  const edit = (p: Pacote) => {
    setEditingId(p.id)
    setFormData(p)
    const rels = p.expand?.['pacotes_servicos(pacote)'] || []
    setSelectedServicos(rels.map((r) => r.servico))
    setOpen(true)
  }

  const remove = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await deletePacote(id)
      toast.success('Excluído com sucesso!')
    }
  }

  const toggleServico = (id: string) => {
    setSelectedServicos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Pacotes</h2>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o) {
              setEditingId(null)
              setFormData({ is_ativo: true })
              setSelectedServicos([])
              setErrors({})
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#3B82F6] hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Novo Pacote
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Novo'} Pacote</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Nome *</Label>
                <Input
                  required
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
                {errors.nome && <p className="text-red-500 text-xs">{errors.nome}</p>}
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao || ''}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Total (R$) *</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor_total ?? ''}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_total: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Qtd de Sessões *</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.quantidade_sessoes ?? ''}
                  onChange={(e) =>
                    setFormData({ ...formData, quantidade_sessoes: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Validade (Dias) *</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.validade_dias ?? ''}
                  onChange={(e) =>
                    setFormData({ ...formData, validade_dias: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2 col-span-2 mt-2">
                <Label>Serviços Inclusos *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border p-3 rounded-md">
                  {servicos.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selectedServicos.includes(s.id)}
                        onCheckedChange={() => toggleServico(s.id)}
                      />
                      {s.nome} (R$ {Number(s.preco_base).toFixed(2)})
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2 col-span-2 flex items-center gap-2 mt-2">
                <Checkbox
                  id="ativo"
                  checked={formData.is_ativo}
                  onCheckedChange={(c) => setFormData({ ...formData, is_ativo: !!c })}
                />
                <Label htmlFor="ativo">Pacote Ativo</Label>
              </div>
              <div className="col-span-2 flex justify-end mt-4">
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar pacote..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Serviços</TableHead>
              <TableHead>Sessões</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-sm">{p.codigo}</TableCell>
                <TableCell className="font-medium">{p.nome}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                  {p.expand?.['pacotes_servicos(pacote)']
                    ?.map((r) => r.expand?.servico?.nome)
                    .join(', ') || '-'}
                </TableCell>
                <TableCell>{p.quantidade_sessoes}</TableCell>
                <TableCell>{p.validade_dias} dias</TableCell>
                <TableCell>R$ {Number(p.valor_total).toFixed(2)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => edit(p)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => remove(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum pacote encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
