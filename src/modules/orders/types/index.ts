export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  orderDate: Date
  status: OrderStatus
  items: OrderItem[]
  total: number
}
