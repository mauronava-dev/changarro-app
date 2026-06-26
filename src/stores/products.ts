import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { db, type Product } from '@/services/db'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)

  const activeProducts = computed(() => products.value.filter((p) => p.isActive))

  async function loadProducts() {
    isLoading.value = true
    try {
      products.value = await db.products.orderBy('createdAt').reverse().toArray()
    } finally {
      isLoading.value = false
    }
  }

  async function getProductById(id: string): Promise<Product | undefined> {
    return await db.products.get(id)
  }

  async function createProduct(data: {
    name: string
    price: number
    category: string
    unit: string
  }): Promise<Product> {
    const now = new Date().toISOString()
    const product: Product = {
      id: crypto.randomUUID(),
      name: data.name,
      price: data.price,
      category: data.category,
      unit: data.unit,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }
    await db.products.add(product)
    products.value.unshift(product)
    return product
  }

  async function updateProduct(
    id: string,
    data: { name?: string; price?: number; category?: string; unit?: string; isActive?: boolean },
  ): Promise<void> {
    const updatedAt = new Date().toISOString()
    await db.products.update(id, { ...data, updatedAt })
    const index = products.value.findIndex((p) => p.id === id)
    const existing = products.value[index]
    if (index !== -1 && existing) {
      products.value[index] = { ...existing, ...data, updatedAt }
    }
  }

  async function deleteProduct(id: string): Promise<void> {
    await db.products.delete(id)
    products.value = products.value.filter((p) => p.id !== id)
  }

  return {
    products,
    activeProducts,
    isLoading,
    loadProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})
