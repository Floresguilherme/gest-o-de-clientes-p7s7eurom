import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getServicos,
  createServico,
  updateServico,
  deleteServico,
  type Servico,
} from '@/services/servicos'
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

const CATEGORIAS = ['depilação', 'design de sobrancelha', 'limpeza de pele', 'massagem', 'outros']

export default function ServicosPage() {
  const [data, setData] = useState<Servico[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Servico>>({ is_ativo: true, categoria: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const load = async () => {
    try {
      setData(await getServicos())
    } catch {
      toast.error('Erro ao carregar serviços')
    }
  }
  useEffect(() => {
    load()
  }, [])
  useRealtime('servicos', load)

  const filtered = data.filter((d) => d.nome.toLowerCase().includes(search.toLowerCase()))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) await updateServico(editingId, formData)
      else await createServico(formData)
      toast.success('Salvo com sucesso!')
      setOpen(false)
      setEditingId(null)
      setFormData({ is_ativo: true, categoria: '' })
      setErrors({})
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Verifique os campos obrigatórios')
    }
  }

  const edit = (s: Servico) => {
    setEditingId(s.id)
    setFormData(s)
    setOpen(true)
  }

  const remove = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await deleteServico(id)
      toast.success('Excluído com sucesso!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Catálogo de Serviços</h2>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o) {
              setEditingId(null)
              setFormData({ is_ativo: true, categoria: '' })
              setErrors({})
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#3B82F6] hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Novo'} Serviço</DialogTitle>
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
                <Label>Preço Base (R$) *</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.preco_base ?? ''}
                  onChange={(e) => setFormData({ ...formData, preco_base: Number(e.target.value) })}
                />
                {errors.preco_base && <p className="text-red-500 text-xs">{errors.preco_base}</p>}
              </div>
              <div className="space-y-2">
                <Label>Duração (Minutos) *</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.duracao_minutos ?? ''}
                  onChange={(e) =>
                    setFormData({ ...formData, duracao_minutos: Number(e.target.value) })
                  }
                />
                {errors.duracao_minutos && (
                  <p className="text-red-500 text-xs">{errors.duracao_minutos}</p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Categoria *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(v) => setFormData({ ...formData, categoria: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoria && <p className="text-red-500 text-xs">{errors.categoria}</p>}
              </div>
              <div className="space-y-2 col-span-2 flex items-center gap-2 mt-2">
                <Checkbox
                  id="ativo"
                  checked={formData.is_ativo}
                  onCheckedChange={(c) => setFormData({ ...formData, is_ativo: !!c })}
                />
                <Label htmlFor="ativo">Serviço Ativo</Label>
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
          placeholder="Buscar serviço..."
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
              <TableHead>Categoria</TableHead>
              <TableHead>Preço Base</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-sm">{s.codigo}</TableCell>
                <TableCell className="font-medium">{s.nome}</TableCell>
                <TableCell className="capitalize">{s.categoria}</TableCell>
                <TableCell>R$ {Number(s.preco_base).toFixed(2)}</TableCell>
                <TableCell>{s.duracao_minutos} min</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => edit(s)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => remove(s.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhum serviço encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
