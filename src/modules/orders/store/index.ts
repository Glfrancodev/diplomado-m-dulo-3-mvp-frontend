import { create } from 'zustand'
import type { Order, OrderStatus } from '../types'
import { ordersApi } from '../../../shared/api'

interface OrderStore {
  orders: Order[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  createOrder: (data: { customerId: string; items: { productId: string; quantity: number }[] }) => Promise<Order>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
  getOrderById: (id: string) => Order | undefined
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null })
    try {
      const orders = await ordersApi.getAll()
      set({ orders, loading: false })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al cargar pedidos'
      set({ error: msg, loading: false })
    }
  },

  createOrder: async (data) => {
    const newOrder = await ordersApi.create(data)
    set((state) => ({ orders: [...state.orders, newOrder] }))
    return newOrder
  },

  updateOrderStatus: async (id, status) => {
    const updated = await ordersApi.updateStatus(id, status)
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? updated : o)),
    }))
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),
}))
