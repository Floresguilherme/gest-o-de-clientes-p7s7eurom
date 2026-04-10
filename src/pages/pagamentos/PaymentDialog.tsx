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
import { createPagamento } from '@/services/pagamentos'
import { useToast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  atendimento: any
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export default function PaymentDialog({ open, atendimento, onOpenChange, onSaved }: Props) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [desconto, setDesconto] = useState(0)
  const [metodo, setMetodo] = useState('PIX')
  const [tipo, setTipo] = useState('à vista')
  const [parcelas, setParcelas] = useState(1)

  const valorFinal = (atendimento?.total || 0) - desconto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await createPagamento(
        {
          atendimento: atendimento.id,
          valor_bruto: atendimento.total,
          desconto,
          valor_final: valorFinal,
          metodo,
          tipo_pagamento: tipo,
          parcelas,
          status: 'pago',
        },
        parcelas,
      )

      toast({ title: 'Sucesso', description: 'Pagamento processado e comissões geradas.' })
      onSaved()
      onOpenChange(false)
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Processar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-3 rounded-md border">
            <div>
              <p className="text-muted-foreground">Cliente</p>
              <p className="font-semibold">{atendimento?.expand?.cliente?.nome}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valor Bruto</p>
              <p className="font-semibold text-lg">R$ {atendimento?.total?.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Desconto (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={desconto}
                onChange={(e) => setDesconto(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Final (R$)</Label>
              <Input
                type="number"
                readOnly
                value={valorFinal.toFixed(2)}
                className="bg-green-50 text-green-700 font-bold border-green-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Método</Label>
              <Select value={metodo} onValueChange={setMetodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="débito">Débito</SelectItem>
                  <SelectItem value="crédito">Crédito</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(v) => {
                  setTipo(v)
                  if (v === 'à vista') setParcelas(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="à vista">À vista</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {tipo === 'parcelado' && (
            <div className="space-y-2 animate-fade-in-up">
              <Label>Número de Parcelas</Label>
              <Select value={parcelas.toString()} onValueChange={(v) => setParcelas(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 10, 12].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}x de R$ {(valorFinal / n).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#10B981] hover:bg-emerald-600">
              Confirmar Recebimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
