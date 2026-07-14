import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db, type AppSettings } from '@/services/db'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'app-settings',
  taxEnabled: true,
  taxRate: 0.16,
  businessName: 'Mi Changarro',
  currency: 'MXN',
  shiftsEnabled: false,
}

export const useSettingsStore = defineStore('settings', () => {
  const taxEnabled = ref(DEFAULT_SETTINGS.taxEnabled)
  const taxRate = ref(DEFAULT_SETTINGS.taxRate)
  const businessName = ref(DEFAULT_SETTINGS.businessName)
  const currency = ref(DEFAULT_SETTINGS.currency)
  const shiftsEnabled = ref(DEFAULT_SETTINGS.shiftsEnabled)
  const isLoaded = ref(false)

  async function loadSettings() {
    const stored = await db.settings.get('app-settings')
    if (stored) {
      taxEnabled.value = stored.taxEnabled
      taxRate.value = stored.taxRate
      businessName.value = stored.businessName
      currency.value = stored.currency
      shiftsEnabled.value = stored.shiftsEnabled ?? false
    } else {
      await db.settings.put(DEFAULT_SETTINGS)
    }
    isLoaded.value = true
  }

  async function setTaxEnabled(value: boolean) {
    taxEnabled.value = value
    await persist()
  }

  async function setTaxRate(value: number) {
    taxRate.value = value
    await persist()
  }

  async function setBusinessName(value: string) {
    businessName.value = value
    await persist()
  }

  async function setShiftsEnabled(value: boolean) {
    shiftsEnabled.value = value
    await persist()

    // Lazy import to avoid circular dependency
    const { useShiftsStore } = await import('@/stores/shifts')
    const shiftsStore = useShiftsStore()

    if (value) {
      // Open first shift if there's no active one
      await shiftsStore.loadActiveShift()
      if (!shiftsStore.activeShift) {
        await shiftsStore.openShift()
      }
    } else {
      // Close current shift silently without requiring user confirmation
      if (shiftsStore.activeShift) {
        const shiftId = shiftsStore.activeShift.id
        const sales = await shiftsStore.getShiftSales(shiftId)
        const totalCash = sales.reduce((sum, s) => sum + s.total, 0)
        await shiftsStore.closeShift(totalCash, sales.length)
      }
    }
  }

  async function persist() {
    await db.settings.put({
      id: 'app-settings',
      taxEnabled: taxEnabled.value,
      taxRate: taxRate.value,
      businessName: businessName.value,
      currency: currency.value,
      shiftsEnabled: shiftsEnabled.value,
    })
  }

  return {
    taxEnabled,
    taxRate,
    businessName,
    currency,
    shiftsEnabled,
    isLoaded,
    loadSettings,
    setTaxEnabled,
    setTaxRate,
    setBusinessName,
    setShiftsEnabled,
  }
})
