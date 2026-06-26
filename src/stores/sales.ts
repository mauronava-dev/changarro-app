import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db, type Sale } from '@/services/db'

export const useSalesStore = defineStore('sales', () => {
  const sales = ref<Sale[]>([])
  const isLoading = ref(false)

  async function loadSales() {
    isLoading.value = true
    try {
      sales.value = await db.sales.orderBy('createdAt').reverse().toArray()
    } finally {
      isLoading.value = false
    }
  }

  async function createSale(sale: Sale): Promise<void> {
    await db.sales.add(sale)
    sales.value.unshift(sale)
  }

  async function getSaleById(id: string): Promise<Sale | undefined> {
    return await db.sales.get(id)
  }

  return {
    sales,
    isLoading,
    loadSales,
    createSale,
    getSaleById,
  }
})
