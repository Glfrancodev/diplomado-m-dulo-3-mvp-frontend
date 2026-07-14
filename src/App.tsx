import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './shared/components/Layout'
import { Dashboard } from './pages/Dashboard'
import { ClientsPage } from './modules/clients/pages/ClientsPage'
import { ProductsPage } from './modules/products/pages/ProductsPage'
import { OrdersPage } from './modules/orders/pages/OrdersPage'
import { NewOrderPage } from './modules/orders/pages/NewOrderPage'
import { OrderDetailPage } from './modules/orders/pages/OrderDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<NewOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
