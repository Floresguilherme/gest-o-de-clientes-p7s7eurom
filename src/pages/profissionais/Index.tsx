import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  getProfissionais,
  createProfissional,
  updateProfissional,
  deleteProfissional,
  type Profissional,
} from '@/services/profissionais'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { toast } from 'sonner'
import { maskCPF, maskPhone } from '@/lib/masks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const ESPECIALIDADES = [
  'depilação',
  'design de sobrancelha',
  'limpeza de pele',
  'massagem',
  'outros',
]

export default function ProfissionaisPage() {
  const [data, setData] = useState<Profissional[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Profissional>>({
    is_ativo: true,
    especialidades: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const load = async () => {
    try {
      setData(await getProfissionais())
    } catch {
      toast.error('Erro ao carregar colaboradores')
    }
  }
  useEffect(() => {
    load()
  }, [])
  useRealtime('profissionais', load)

  const filtered = data.filter(
    (d) => d.nome.toLowerCase().includes(search.toLowerCase()) || d.cpf.includes(search),
  )

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) await updateProfissional(editingId, formData)
      else await createProfissional(formData)
      toast.success('Salvo com sucesso!')
      setOpen(false)
      setEditingId(null)
      setFormData({ is_ativo: true, especialidades: [] })
      setErrors({})
    } catch (err) {
      setErrors(extractFieldErrors(err))
      toast.error('Verifique os campos obrigatórios')
    }
  }

  const edit = (p: Profissional) => {
    setEditingId(p.id)
    setFormData(p)
    setOpen(true)
  }

  const remove = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      await deleteProfissional(id)
      toast.success('Excluído com sucesso!')
    }
  }

  const toggleEspecialidade = (e: string) => {
    const current = formData.especialidades || []
    setFormData({
      ...formData,
      especialidades: current.includes(e) ? current.filter((x) => x !== e) : [...current, e],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Colaboradores</h2>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o) {
              setEditingId(null)
              setFormData({ is_ativo: true, especialidades: [] })
              setErrors({})
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#3B82F6] hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" /> Novo Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar' : 'Novo'} Colaborador</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  required
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
                {errors.nome && <p className="text-red-500 text-xs">{errors.nome}</p>}
              </div>
              <div className="space-y-2">
                <Label>CPF *</Label>
                <Input
                  required
                  value={formData.cpf || ''}
                  onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                />
                {errors.cpf && <p className="text-red-500 text-xs">{errors.cpf}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  required
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input
                  required
                  value={formData.telefone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: maskPhone(e.target.value) })
                  }
                />
                {errors.telefone && <p className="text-red-500 text-xs">{errors.telefone}</p>}
              </div>
              <div className="space-y-2">
                <Label>Comissão Padrão (%) *</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  max="100"
                  value={formData.comissao_padrao ?? ''}
                  onChange={(e) =>
                    setFormData({ ...formData, comissao_padrao: Number(e.target.value) })
                  }
                />
                {errors.comissao_padrao && (
                  <p className="text-red-500 text-xs">{errors.comissao_padrao}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Data de Admissão *</Label>
                <Input
                  required
                  type="date"
                  value={formData.data_admissao || ''}
                  onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
                />
                {errors.data_admissao && (
                  <p className="text-red-500 text-xs">{errors.data_admissao}</p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Especialidades *</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {ESPECIALIDADES.map((e) => (
                    <label key={e} className="flex items-center gap-2 text-sm capitalize">
                      <Checkbox
                        checked={(formData.especialidades || []).includes(e)}
                        onCheckedChange={() => toggleEspecialidade(e)}
                      />
                      {e}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2 col-span-2 flex items-center gap-2 mt-4">
                <Checkbox
                  id="ativo"
                  checked={formData.is_ativo}
                  onCheckedChange={(c) => setFormData({ ...formData, is_ativo: !!c })}
                />
                <Label htmlFor="ativo">Cadastro Ativo</Label>
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
          placeholder="Buscar por nome ou CPF..."
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
              <TableHead>Especialidades</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-sm">{p.codigo}</TableCell>
                <TableCell className="font-medium">{p.nome}</TableCell>
                <TableCell className="capitalize">{(p.especialidades || []).join(', ')}</TableCell>
                <TableCell>{p.comissao_padrao}%</TableCell>
                <TableCell>
                  {p.is_ativo ? (
                    <span className="text-green-600">Ativo</span>
                  ) : (
                    <span className="text-red-500">Inativo</span>
                  )}
                </TableCell>
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
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhum colaborador encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
