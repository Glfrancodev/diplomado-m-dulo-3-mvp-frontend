import { useState, useMemo } from 'react'
import { useClientStore } from '../../clients/store'
import { useProductStore } from '../../products/store'
import { Button } from '../../../shared/components/Button'
import { formatCurrency, getStockColor } from '../../../shared/utils'
import type { OrderItem } from '../types'

interface OrderFormProps {
  onSubmit: (data: { customerId: string; items: OrderItem[] }) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function OrderForm({ onSubmit, onCancel, isSubmitting }: OrderFormProps) {
  const clients = useClientStore((s) => s.getActiveClients())
  const products = useProductStore((s) => s.getActiveProducts())
  const getProduct = useProductStore((s) => s.getProductById)

  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  const selectedProduct = useMemo(
    () => (selectedProductId ? getProduct(selectedProductId) : undefined),
    [selectedProductId, getProduct]
  )

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const addItem = () => {
    if (!selectedProductId) {
      setError('Seleccione un producto')
      return
    }
    if (quantity <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }

    const product = getProduct(selectedProductId)
    if (!product) {
      setError('Producto no encontrado')
      return
    }

    const existingIndex = items.findIndex((i) => i.productId === selectedProductId)
    const neededQty = existingIndex >= 0 ? items[existingIndex].quantity + quantity : quantity

    if (product.stock < neededQty) {
      setError(
        `Stock insuficiente. Disponible: ${product.stock}, ${
          existingIndex >= 0
            ? `ya tienes ${items[existingIndex].quantity} en el pedido`
            : `solicitaste ${quantity}`
        }`
      )
      return
    }

    if (existingIndex >= 0) {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          price: product.price,
        },
      ])
    }

    setSelectedProductId('')
    setQuantity(1)
    setError('')
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const handleSubmit = () => {
    if (!customerId) {
      setError('Seleccione un cliente')
      return
    }
    if (items.length === 0) {
      setError('Agregue al menos un producto')
      return
    }
    setError('')
    onSubmit({ customerId, items })
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
          Cliente <span className="text-red-500">*</span>
        </label>
        <select
          id="customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Seleccione un cliente</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName} — {c.email}
            </option>
          ))}
        </select>
      </div>

      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Agregar Productos</h3>
        <div className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-6">
            <label htmlFor="product" className="block text-xs font-medium text-gray-600 mb-1">
              Producto
            </label>
            <select
              id="product"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock === 0}>
                  {p.name} ({p.stock} disponibles) — {formatCurrency(p.price)}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <label htmlFor="quantity" className="block text-xs font-medium text-gray-600 mb-1">
              Cantidad
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={selectedProduct?.stock || 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-3">
            <Button type="button" size="sm" className="w-full" onClick={addItem}>
              Agregar
            </Button>
          </div>
        </div>
        {selectedProduct && (
          <div className="mt-2 text-xs text-gray-500">
            Precio unitario: {formatCurrency(selectedProduct.price)} — Stock:{' '}
            <span className={getStockColor(selectedProduct.stock)}>{selectedProduct.stock}</span>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Productos en el pedido</h3>
          <div className="border rounded-lg divide-y">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between px-4 py-2 text-sm">
                <div>
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-gray-500 ml-2">
                    x{item.quantity} — {formatCurrency(item.price)} c/u
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700 text-xs"
                    aria-label={`Eliminar ${item.productName}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-2 text-lg font-bold text-gray-900">
            Total: {formatCurrency(total)}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleSubmit} isLoading={isSubmitting} disabled={items.length === 0 || !customerId}>
          Crear Pedido
        </Button>
      </div>
    </div>
  )
}
