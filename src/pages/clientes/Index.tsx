import { useState, useEffect, useCallback } from 'react'
import { Cliente, getClientes, deleteCliente } from '@/services/clientes'
import { useRealtime } from '@/hooks/use-realtime'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Plus, Edit2, Trash2, ArrowUpDown } from 'lucide-react'
import { ClientForm } from '@/components/clientes/ClientForm'
import { ClientDeleteAlert } from '@/components/clientes/ClientDeleteAlert'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { toast } from 'sonner'

export default function ClientesPage() {
  const [data, setData] = useState<{ items: Cliente[]; totalPages: number; page: number }>({
    items: [],
    totalPages: 1,
    page: 1,
  })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('nome')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Cliente | null>(null)

  const [deleteData, setDeleteData] = useState<{
    open: boolean
    client: Cliente | null
    loading: boolean
  }>({ open: false, client: null, loading: false })

  const loadData = useCallback(async () => {
    try {
      const res = await getClientes(page, 10, search, sort)
      setData(res)
    } catch (err) {
      toast.error('Erro ao carregar clientes')
    }
  }, [page, search, sort])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData()
    }, 300)
    return () => clearTimeout(timer)
  }, [loadData])

  useRealtime('clientes', () => {
    loadData()
  })

  const handleSort = () => {
    setSort((prev) => (prev === 'nome' ? '-nome' : 'nome'))
  }

  const handleEdit = (client: Cliente) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteData.client) return
    setDeleteData((prev) => ({ ...prev, loading: true }))
    try {
      await deleteCliente(deleteData.client.id)
      toast.success('Cliente excluído com sucesso')
      setDeleteData({ open: false, client: null, loading: false })
    } catch (err) {
      toast.error('Erro ao excluir cliente')
      setDeleteData((prev) => ({ ...prev, loading: false }))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie o cadastro e histórico de seus clientes.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingClient(null)
            setIsModalOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleSort} className="text-muted-foreground">
          <ArrowUpDown className="w-4 h-4 mr-2" /> Ordenar por Nome
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((client) => (
                <TableRow key={client.id} className="group">
                  <TableCell className="font-medium text-muted-foreground">
                    {client.codigo_interno}
                  </TableCell>
                  <TableCell className="font-semibold">{client.nome}</TableCell>
                  <TableCell>{client.cpf}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.telefone1}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(client)}
                        className="h-8 w-8 text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteData({ open: true, client, loading: false })}
                        className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {data.totalPages > 1 && (
          <div className="p-4 border-t flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm px-4">
                    Página {page} de {data.totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    className={
                      page === data.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <ClientForm
            initialData={editingClient}
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ClientDeleteAlert
        open={deleteData.open}
        onOpenChange={(open) => setDeleteData((prev) => ({ ...prev, open }))}
        onConfirm={handleDelete}
        clientName={deleteData.client?.nome}
        isDeleting={deleteData.loading}
      />
    </div>
  )
}
