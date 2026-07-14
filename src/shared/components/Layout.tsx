import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/clients', label: 'Clientes', icon: '👥' },
  { to: '/products', label: 'Productos', icon: '📦' },
  { to: '/orders', label: 'Pedidos', icon: '📋' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">Gestión Pedidos</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <p className="text-sm text-gray-500">Sistema de Gestión de Pedidos</p>
        </header>
        <div className="flex-1 p-8 overflow-auto">{children}</div>
      </main>
    </div>
  )
}
