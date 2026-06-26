import { ref } from 'vue'
import { defineStore } from 'pinia'
import { db, type AppSettings } from '@/services/db'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'app-settings',
  taxEnabled: true,
  taxRate: 0.16,
  businessName: 'Mi Changarro',
  currency: 'MXN',
}

export const useSettingsStore = defineStore('settings', () => {
  const taxEnabled = ref(DEFAULT_SETTINGS.taxEnabled)
  const taxRate = ref(DEFAULT_SETTINGS.taxRate)
  const businessName = ref(DEFAULT_SETTINGS.businessName)
  const currency = ref(DEFAULT_SETTINGS.currency)
  const isLoaded = ref(false)

  async function loadSettings() {
    const stored = await db.settings.get('app-settings')
    if (stored) {
      taxEnabled.value = stored.taxEnabled
      taxRate.value = stored.taxRate
      businessName.value = stored.businessName
      currency.value = stored.currency
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

  async function persist() {
    await db.settings.put({
      id: 'app-settings',
      taxEnabled: taxEnabled.value,
      taxRate: taxRate.value,
      businessName: businessName.value,
      currency: currency.value,
    })
  }

  return {
    taxEnabled,
    taxRate,
    businessName,
    currency,
    isLoaded,
    loadSettings,
    setTaxEnabled,
    setTaxRate,
    setBusinessName,
  }
})
