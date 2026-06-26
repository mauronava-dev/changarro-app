import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useSalesStore } from '@/stores/sales'
import type { Sale, SaleItem } from '@/services/db'

export interface CartItem {
  id: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const settingsStore = useSettingsStore()

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  )

  const taxEnabled = computed(() => settingsStore.taxEnabled)
  const taxRate = computed(() => settingsStore.taxRate)
  const tax = computed(() => (taxEnabled.value ? subtotal.value * taxRate.value : 0))
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

  async function finalizeSale(): Promise<Sale> {
    const salesStore = useSalesStore()

    const saleItems: SaleItem[] = items.value.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.unitPrice * item.quantity,
    }))

    const sale: Sale = {
      id: crypto.randomUUID(),
      items: saleItems,
      subtotal: subtotal.value,
      taxIncluded: taxEnabled.value,
      taxRate: taxEnabled.value ? taxRate.value : 0,
      taxAmount: tax.value,
      total: total.value,
      createdAt: new Date().toISOString(),
    }

    await salesStore.createSale(sale)
    clearCart()

    return sale
  }

  return {
    items,
    itemCount,
    subtotal,
    taxEnabled,
    taxRate,
    tax,
    total,
    addItem,
    addCustomItem,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    finalizeSale,
  }
})
