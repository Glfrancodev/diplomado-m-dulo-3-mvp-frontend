import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { useOrderStore } from '../store'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { Button } from '../../../shared/components/Button'
import { ToastContainer } from '../../../shared/components/ToastContainer'
import { useToast } from '../../../shared/hooks/useToast'
import { formatCurrency, formatDate } from '../../../shared/utils'
import type { OrderStatus } from '../types'

const statusTransitions: { current: OrderStatus; next: OrderStatus; label: string }[] = [
  { current: 'PENDING', next: 'CONFIRMED', label: 'Confirmar' },
  { current: 'CONFIRMED', next: 'DELIVERED', label: 'Marcar como Entregado' },
]

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { changeStatus } = useOrders()
  const fetchOrders = useOrderStore((s) => s.fetchOrders)
  const orders = useOrderStore((s) => s.orders)
  const { toasts, addToast, removeToast } = useToast()

  const order = id ? orders.find((o) => o.id === id) : undefined

  useEffect(() => {
    if (orders.length === 0) fetchOrders()
  }, [orders.length, fetchOrders])

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pedido no encontrado</p>
        <Button className="mt-4" onClick={() => navigate('/orders')}>
          Volver a Pedidos
        </Button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const handleStatusChange = async (status: OrderStatus) => {
    await changeStatus(order.id, status)
    addToast(
      `Pedido ${status === 'CONFIRMED' ? 'confirmado' : status === 'DELIVERED' ? 'marcado como entregado' : 'actualizado'}`,
      'success'
    )
  }

  const handleCancel = async () => {
    await changeStatus(order.id, 'CANCELLED')
    addToast('Pedido cancelado', 'success')
  }

  const transition = statusTransitions.find((t) => t.current === order.status)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/orders')}
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Volver a pedidos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id.slice(0, 8)}</h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Productos</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-500">Producto</th>
                  <th className="text-right py-2 font-medium text-gray-500">Precio</th>
                  <th className="text-right py-2 font-medium text-gray-500">Cantidad</th>
                  <th className="text-right py-2 font-medium text-gray-500">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId} className="border-b last:border-0">
                    <td className="py-3 font-medium">{item.productName}</td>
                    <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-3 font-semibold text-base">
                    Total
                  </td>
                  <td className="text-right py-3 font-bold text-lg">{formatCurrency(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
              <p className="text-gray-900 font-medium">{order.customerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fecha del pedido</h3>
              <p className="text-gray-900">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Estado</h3>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <div className="pt-4 border-t space-y-2">
                {transition && (
                  <Button className="w-full" onClick={() => handleStatusChange(transition.next)}>
                    {transition.label}
                  </Button>
                )}
                {order.status === 'PENDING' && (
                  <Button variant="danger" className="w-full" onClick={handleCancel}>
                    Cancelar Pedido
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
