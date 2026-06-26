import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface CartItem {
  id: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  )

  const taxRate = 0.16
  const tax = computed(() => subtotal.value * taxRate)
  const total = computed(() => subtotal.value + tax.value)

  function addItem(product: { id: string; name: string; price: number }) {
    const existing = items.value.find((item) => item.productId === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: 1,
      })
    }
  }

  function addCustomItem(name: string, price: number) {
    items.value.push({
      id: crypto.randomUUID(),
      productId: `custom-${crypto.randomUUID()}`,
      productName: name,
      unitPrice: price,
      quantity: 1,
    })
  }

  function incrementQuantity(id: string) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.quantity++
  }

  function decrementQuantity(id: string) {
    const item = items.value.find((i) => i.id === id)
    if (item && item.quantity > 1) {
      item.quantity--
    }
  }

  function removeItem(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    itemCount,
    subtotal,
    tax,
    taxRate,
    total,
    addItem,
    addCustomItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
  }
})
