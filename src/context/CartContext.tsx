import { createContext, useContext, useState, type ReactNode } from 'react'

export type CartItemTipo = 'unidad' | 'caja'

export interface CartItem {
  id: string
  tipo: CartItemTipo
  nombre: string
  precio: number
  cantidad: number
  img: string
}

function itemKey(id: string, tipo: CartItemTipo) {
  return `${id}-${tipo}`
}

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'cantidad'>) => void
  removeItem: (id: string, tipo: CartItemTipo) => void
  updateQty: (id: string, tipo: CartItemTipo, delta: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = items.reduce((s, i) => s + i.cantidad, 0)
  const totalPrice = items.reduce((s, i) => s + i.precio * i.cantidad, 0)

  function addItem(item: Omit<CartItem, 'cantidad'>) {
    setItems((prev) => {
      const key = itemKey(item.id, item.tipo)
      const existing = prev.find((i) => itemKey(i.id, i.tipo) === key)
      if (existing) {
        return prev.map((i) =>
          itemKey(i.id, i.tipo) === key ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { ...item, cantidad: 1 }]
    })
  }

  function removeItem(id: string, tipo: CartItemTipo) {
    const key = itemKey(id, tipo)
    setItems((prev) => prev.filter((i) => itemKey(i.id, i.tipo) !== key))
  }

  function updateQty(id: string, tipo: CartItemTipo, delta: number) {
    const key = itemKey(id, tipo)
    setItems((prev) =>
      prev
        .map((i) => itemKey(i.id, i.tipo) === key ? { ...i, cantidad: i.cantidad + delta } : i)
        .filter((i) => i.cantidad > 0)
    )
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
