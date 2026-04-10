import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import Index from './pages/Index'
import ClientesPage from './pages/clientes/Index'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<Layout />}>
            <Route path="/clientes" element={<ClientesPage />} />

            {/* Redirects for unimplemented sidebar links to avoid 404 while navigating */}
            <Route path="/painel" element={<Navigate to="/clientes" replace />} />
            <Route path="/agenda" element={<Navigate to="/clientes" replace />} />
            <Route path="/whatsapp" element={<Navigate to="/clientes" replace />} />
            <Route path="/colaboradores" element={<Navigate to="/clientes" replace />} />
            <Route path="/financeiro" element={<Navigate to="/clientes" replace />} />
            <Route path="/caixa" element={<Navigate to="/clientes" replace />} />
            <Route path="/estoque" element={<Navigate to="/clientes" replace />} />
            <Route path="/servicos" element={<Navigate to="/clientes" replace />} />
            <Route path="/marketing" element={<Navigate to="/clientes" replace />} />
            <Route path="/retencao" element={<Navigate to="/clientes" replace />} />
            <Route path="/relatorios" element={<Navigate to="/clientes" replace />} />
            <Route path="/configuracoes" element={<Navigate to="/clientes" replace />} />
            <Route path="/ajuda" element={<Navigate to="/clientes" replace />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
