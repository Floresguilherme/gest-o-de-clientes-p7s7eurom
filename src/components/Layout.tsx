import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  LayoutDashboard,
  Calendar,
  MessageCircle,
  Users,
  UserPlus,
  DollarSign,
  Archive,
  Package,
  ClipboardList,
  Megaphone,
  RefreshCcw,
  BarChart,
  Settings,
  BookOpen,
  LogOut,
  Bell,
  Search,
} from 'lucide-react'
import { Input } from './ui/input'
import { Label } from '@/components/ui/label'

const menuItems = [
  { icon: LayoutDashboard, label: 'Painel', path: '/painel' },
  { icon: Calendar, label: 'Agenda Global', path: '/agenda' },
  { icon: MessageCircle, label: 'WhatsApp Central', path: '/whatsapp', badge: '3' },
  { icon: Users, label: 'CRM / Clientes', path: '/clientes' },
  { icon: UserPlus, label: 'Colaboradores', path: '/profissionais' },
  { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
  { icon: Archive, label: 'Caixa', path: '/caixa' },
  { icon: Package, label: 'Pacotes', path: '/pacotes' },
  { icon: ClipboardList, label: 'Serviços', path: '/servicos' },
  { icon: Megaphone, label: 'Marketing e Indicações', path: '/marketing' },
  { icon: RefreshCcw, label: 'Retenção Inteligente', path: '/retencao' },
  { icon: BarChart, label: 'Relatórios', path: '/relatorios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
]

export default function Layout() {
  const { user, signOut, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user && location.pathname !== '/') return <Navigate to="/" replace />

  if (!user) return <Outlet />

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-[#6B7280] border-r border-[#6B7280] flex flex-col hidden md:flex shrink-0 text-white shadow-md">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#3B82F6] flex items-center justify-center text-white font-bold">
            CT
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">Cássia Trott</h1>
            <p className="text-xs text-gray-200">Estética e Escola</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-[#3B82F6] text-white font-medium'
                    : 'text-gray-100 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-destructive text-destructive-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-600 mt-auto">
          <Link
            to="/ajuda"
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Manual de Ajuda
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Consi..." className="pl-9 h-9 bg-muted/50 border-none" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground hidden lg:flex">
              <Switch id="visao" />
              <Label htmlFor="visao" className="font-normal cursor-pointer">
                Visão Profissional
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>

            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user.name || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground mt-1">Mestre</p>
              </div>
              <Avatar className="w-9 h-9 border">
                <AvatarImage
                  src={`https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${user.id}`}
                />
                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sair"
                className="text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
