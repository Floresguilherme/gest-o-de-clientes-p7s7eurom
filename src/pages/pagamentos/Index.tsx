import { useState, useEffect } from 'react'
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
  getAtendimentos,
  getAtendimentosServicos,
  updateAtendimentoStatus,
} from '@/services/atendimentos'
import { getPagamentos } from '@/services/pagamentos'
import { useRealtime } from '@/hooks/use-realtime'
import { format } from 'date-fns'
import PaymentDialog from './PaymentDialog'
import { Badge } from '@/components/ui/badge'

export default function PagamentosPage() {
  const [atendimentos, setAtendimentos] = useState<any[]>([])
  const [pagamentos, setPagamentos] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])
  const [selectedAtendimento, setSelectedAtendimento] = useState<any>(null)

  const loadData = async () => {
    const [allAtend, allPags, allServs] = await Promise.all([
      getAtendimentos(),
      getPagamentos(),
      getAtendimentosServicos(),
    ])
    setPagamentos(allPags)
    setServicos(allServs)

    const paidAtendimentosIds = allPags.map((p) => p.atendimento)
    const pending = allAtend.filter(
      (a) => a.status === 'realizado' && !paidAtendimentosIds.includes(a.id),
    )
    setAtendimentos(pending)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('atendimentos', () => loadData())
  useRealtime('pagamentos', () => loadData())

  const getAtendimentoTotal = (id: string) => {
    return servicos
      .filter((s) => s.atendimento === id)
      .reduce((acc, curr) => acc + curr.valor_pago, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro & Pagamentos</h2>
        <p className="text-muted-foreground">
          Realize baixas e consulte o histórico de recebimentos.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Pendentes de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor Bruto</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atendimentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhum pagamento pendente.
                    </TableCell>
                  </TableRow>
                ) : (
                  atendimentos.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{format(new Date(a.data_hora), 'dd/MM/yyyy HH:mm')}</TableCell>
                      <TableCell>{a.expand?.cliente?.nome}</TableCell>
                      <TableCell>R$ {getAtendimentoTotal(a.id).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() =>
                            setSelectedAtendimento({ ...a, total: getAtendimentoTotal(a.id) })
                          }
                          className="bg-[#10B981] hover:bg-emerald-600 text-white"
                        >
                          Receber
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Pagamentos Recebidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentos.slice(0, 5).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{format(new Date(p.created), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{p.expand?.atendimento?.expand?.cliente?.nome}</TableCell>
                    <TableCell className="capitalize">
                      <Badge variant="outline">{p.metodo}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-[#10B981]">
                      R$ {p.valor_final.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedAtendimento && (
        <PaymentDialog
          open={!!selectedAtendimento}
          atendimento={selectedAtendimento}
          onOpenChange={(v) => !v && setSelectedAtendimento(null)}
          onSaved={loadData}
        />
      )}
    </div>
  )
}
