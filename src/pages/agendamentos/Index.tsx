import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getAtendimentos } from '@/services/atendimentos'
import { useRealtime } from '@/hooks/use-realtime'
import AppointmentDialog from './AppointmentDialog'
import { Badge } from '@/components/ui/badge'

const statusColors: Record<string, string> = {
  agendado: 'bg-[#10B981]',
  realizado: 'bg-[#3B82F6]',
  cancelado: 'bg-[#EF4444]',
  'não compareceu': 'bg-gray-500',
}

export default function AgendamentosPage() {
  const [atendimentos, setAtendimentos] = useState<any[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('week')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadData = async () => {
    const data = await getAtendimentos()
    setAtendimentos(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('atendimentos', () => loadData())

  const navigateDate = (dir: 1 | -1) => {
    if (view === 'month')
      setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    if (view === 'week')
      setCurrentDate(dir > 0 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
    if (view === 'day') setCurrentDate(dir > 0 ? addDays(currentDate, 1) : subDays(currentDate, 1))
  }

  const daysToShow =
    view === 'day'
      ? [currentDate]
      : eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agenda Global</h2>
          <p className="text-muted-foreground">Gerencie seus agendamentos e horários.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#3B82F6] hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold w-40 text-center capitalize">
              {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </h3>
            <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex border rounded-md overflow-hidden">
            {['month', 'week', 'day'].map((v) => (
              <Button
                key={v}
                variant={view === v ? 'default' : 'ghost'}
                className={`rounded-none px-4 ${view === v ? 'bg-[#3B82F6] hover:bg-blue-600' : ''}`}
                onClick={() => setView(v as any)}
              >
                {v === 'month' ? 'Mês' : v === 'week' ? 'Semana' : 'Dia'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className={`grid gap-4 ${view === 'day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
            {daysToShow.map((day, idx) => {
              const dayAtendimentos = atendimentos.filter((a) =>
                isSameDay(new Date(a.data_hora), day),
              )
              return (
                <div key={idx} className="border rounded-md min-h-[150px] flex flex-col">
                  <div className="bg-muted px-2 py-1 text-center text-sm font-medium border-b capitalize">
                    {format(day, 'EEEE, dd', { locale: ptBR })}
                  </div>
                  <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                    {dayAtendimentos.map((a) => (
                      <div
                        key={a.id}
                        className="text-xs p-2 rounded-md border bg-card shadow-sm space-y-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold">
                            {format(new Date(a.data_hora), 'HH:mm')}
                          </span>
                          <Badge
                            className={`${statusColors[a.status]} hover:${statusColors[a.status]} text-[10px] px-1`}
                          >
                            {a.status}
                          </Badge>
                        </div>
                        <p className="font-medium truncate">{a.expand?.cliente?.nome}</p>
                        <p className="text-muted-foreground truncate">
                          {a.expand?.profissional?.nome}
                        </p>
                      </div>
                    ))}
                    {dayAtendimentos.length === 0 && (
                      <div className="text-muted-foreground text-xs text-center py-4">
                        Sem eventos
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {isDialogOpen && (
        <AppointmentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSaved={loadData} />
      )}
    </div>
  )
}
