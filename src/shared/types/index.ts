export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  orderDate: Date;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}
