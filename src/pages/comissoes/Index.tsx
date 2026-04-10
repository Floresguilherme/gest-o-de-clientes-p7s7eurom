import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getComissoes, pagarComissoes } from '@/services/comissoes'
import { getProfissionais } from '@/services/profissionais'
import { useRealtime } from '@/hooks/use-realtime'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { DollarSign, CheckCircle, AlertCircle } from 'lucide-react'

export default function ComissoesPage() {
  const { toast } = useToast()
  const [comissoes, setComissoes] = useState<any[]>([])
  const [profissionais, setProfissionais] = useState<any[]>([])
  const [filterProf, setFilterProf] = useState('all')
  const [filterStatus, setFilterStatus] = useState('devida')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    const [c, p] = await Promise.all([getComissoes(), getProfissionais()])
    setComissoes(c)
    setProfissionais(p)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('comissoes_profissionais', () => loadData())

  const filtered = useMemo(() => {
    return comissoes.filter((c) => {
      if (filterProf !== 'all' && c.profissional !== filterProf) return false
      if (filterStatus !== 'all' && c.status !== filterStatus) return false
      return true
    })
  }, [comissoes, filterProf, filterStatus])

  const { devida, paga } = useMemo(() => {
    return comissoes.reduce(
      (acc, c) => {
        if (filterProf !== 'all' && c.profissional !== filterProf) return acc
        if (c.status === 'devida') acc.devida += c.valor_comissao
        if (c.status === 'paga') acc.paga += c.valor_comissao
        return acc
      },
      { devida: 0, paga: 0 },
    )
  }, [comissoes, filterProf])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([])
    else setSelectedIds(filtered.map((f) => f.id))
  }

  const handlePay = async () => {
    if (selectedIds.length === 0) return
    try {
      setLoading(true)
      await pagarComissoes(selectedIds)
      toast({
        title: 'Sucesso',
        description: `${selectedIds.length} comissões foram marcadas como pagas.`,
      })
      setSelectedIds([])
      loadData()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comissões</h2>
          <p className="text-muted-foreground">Controle financeiro da equipe profissional.</p>
        </div>
        {filterStatus === 'devida' && selectedIds.length > 0 && (
          <Button
            onClick={handlePay}
            disabled={loading}
            className="bg-[#10B981] hover:bg-emerald-600"
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Pagar Selecionadas ({selectedIds.length})
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo a Pagar</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#EF4444]">R$ {devida.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#10B981]">R$ {paga.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtros</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Select value={filterProf} onValueChange={setFilterProf}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Prof.</SelectItem>
                  {profissionais.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="devida">Devidas</SelectItem>
                  <SelectItem value="paga">Pagas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {filterStatus === 'devida' && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
              )}
              <TableHead>Data Serv.</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Venda</TableHead>
              <TableHead>Comissão</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhuma comissão encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  {filterStatus === 'devida' && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(c.id)}
                        onCheckedChange={() => toggleSelect(c.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    {format(new Date(c.expand?.atendimento?.data_hora), 'dd/MM/yy')}
                  </TableCell>
                  <TableCell>{c.expand?.profissional?.nome}</TableCell>
                  <TableCell>{c.expand?.servico?.nome}</TableCell>
                  <TableCell>R$ {c.valor_venda.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">
                    R$ {c.valor_comissao.toFixed(2)} ({c.percentual_comissao}%)
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={c.status === 'paga' ? 'default' : 'destructive'}
                      className={c.status === 'paga' ? 'bg-[#10B981]' : ''}
                    >
                      {c.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
