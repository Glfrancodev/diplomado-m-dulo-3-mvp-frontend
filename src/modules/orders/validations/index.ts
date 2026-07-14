import { z } from 'zod'

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  quantity: z
    .number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0'),
  price: z.number().positive(),
  productName: z.string(),
})

export const orderSchema = z.object({
  customerId: z.string().min(1, 'Debe seleccionar un cliente'),
  items: z
    .array(orderItemSchema)
    .min(1, 'Debe agregar al menos un producto al pedido'),
})

export type OrderFormData = z.infer<typeof orderSchema>
