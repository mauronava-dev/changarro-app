<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { db } from '@/services/db'

const salesStore = useSalesStore()

const activeFilter = ref<'Turno' | 'Hoy' | 'Mes'>('Hoy')
const selectedMonth = ref('')
const showMonthSelector = ref(false)

// Set default selected month to current month (YYYY-MM)
const today = new Date()
selectedMonth.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

const firstSaleDate = ref<Date | null>(null)

async function loadOldestSaleDate() {
  try {
    const oldestSale = await db.sales.orderBy('createdAt').first()
    if (oldestSale) {
      firstSaleDate.value = new Date(oldestSale.createdAt)
    } else {
      firstSaleDate.value = new Date()
    }
  } catch (error) {
    console.error('Error loading oldest sale date:', error)
    firstSaleDate.value = new Date()
  }
}

onMounted(async () => {
  await salesStore.loadSales()
  await loadOldestSaleDate()
})

// Generate dynamic list of months from current month backward to the oldest sale's month
const availableMonths = computed(() => {
  const months = []
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  const startDate = firstSaleDate.value || today
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth()

  let tempYear = currentYear
  let tempMonth = currentMonth

  while (tempYear > startYear || (tempYear === startYear && tempMonth >= startMonth)) {
    const d = new Date(tempYear, tempMonth, 1)
    const monthName = d.toLocaleDateString('es-MX', { month: 'long' })
    const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1)
    const label = `${capitalized} ${d.getFullYear().toString().slice(-2)}`
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    
    months.push({ label, value })

    tempMonth--
    if (tempMonth < 0) {
      tempMonth = 11
      tempYear--
    }
  }

  // Fallback to make sure there's at least the current month
  if (months.length === 0) {
    const monthName = today.toLocaleDateString('es-MX', { month: 'long' })
    const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1)
    const label = `${capitalized} ${today.getFullYear().toString().slice(-2)}`
    const value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    months.push({ label, value })
  }

  return months
})

// Get label for the active month button
const selectedMonthLabel = computed(() => {
  const found = availableMonths.value.find((m) => m.value === selectedMonth.value)
  return found ? found.label : 'Mes'
})

function selectFilter(filter: 'Turno' | 'Hoy' | 'Mes') {
  if (filter === 'Mes') {
    if (activeFilter.value === 'Mes') {
      showMonthSelector.value = !showMonthSelector.value
    } else {
      activeFilter.value = 'Mes'
      const now = new Date()
      selectedMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      showMonthSelector.value = false
    }
  } else {
    activeFilter.value = filter
    showMonthSelector.value = false
  }
}

function selectMonth(value: string) {
  selectedMonth.value = value
  showMonthSelector.value = false
}

// Computes filtered sales based on Turno/Hoy/Mes
const filteredSales = computed(() => {
  const allSales = salesStore.sales

  if (activeFilter.value === 'Hoy' || activeFilter.value === 'Turno') {
    const todayStr = new Date().toDateString()
    return allSales.filter((sale) => {
      return new Date(sale.createdAt).toDateString() === todayStr
    })
  }

  if (activeFilter.value === 'Mes') {
    const [year, month] = selectedMonth.value.split('-')
    return allSales.filter((sale) => {
      const saleDate = new Date(sale.createdAt)
      return (
        saleDate.getFullYear() === parseInt(year!) &&
        String(saleDate.getMonth() + 1).padStart(2, '0') === month
      )
    })
  }

  return allSales
})

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header with Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h1 class="text-[26px] leading-[34px] tracking-[-0.02em] font-bold font-display text-on-background">
        Ventas
      </h1>

      <!-- Filter Buttons Wrapper -->
      <div class="flex items-center gap-2 self-end relative">
        <!-- Turno and Hoy filters -->
        <button
          v-for="filter in (['Turno', 'Hoy'] as const)"
          :key="filter"
          :class="[
            'px-5 py-2 rounded-full text-label-md transition-all active:scale-95',
            activeFilter === filter
              ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
              : 'border border-outline-variant text-on-surface-variant hover:bg-surface-variant'
          ]"
          @click="selectFilter(filter)"
        >
          {{ filter }}
        </button>

        <!-- Mes filter container (relative for dropdown placement) -->
        <div class="relative">
          <button
            :class="[
              'flex items-center gap-1.5 px-5 py-2 rounded-full text-label-md transition-all active:scale-95',
              activeFilter === 'Mes'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'border border-outline-variant text-on-surface-variant hover:bg-surface-variant'
            ]"
            @click="selectFilter('Mes')"
          >
            <span>{{ activeFilter === 'Mes' ? selectedMonthLabel : 'Mes' }}</span>
            <span class="material-symbols-outlined text-[16px] transition-transform duration-200" :class="{ 'rotate-180': showMonthSelector }">
              keyboard_arrow_down
            </span>
          </button>

          <!-- Month Selector Dropdown -->
          <Transition name="fade-scale">
            <div
              v-if="showMonthSelector && activeFilter === 'Mes'"
              class="absolute right-0 top-full mt-2 z-50 bg-surface-container-high border border-outline-variant rounded-2xl p-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)] w-56 max-h-64 overflow-y-auto"
            >
              <div class="flex flex-col gap-1">
                <button
                  v-for="month in availableMonths"
                  :key="month.value"
                  :class="[
                    'w-full text-left px-4 py-2.5 rounded-xl text-[14px] font-sans transition-all active:scale-98',
                    selectedMonth === month.value
                      ? 'bg-primary-container/10 text-surface-tint font-bold'
                      : 'text-on-surface hover:bg-surface-variant'
                  ]"
                  @click="selectMonth(month.value)"
                >
                  {{ month.label }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="salesStore.isLoading" class="flex justify-center py-16">
      <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 animate-spin"
        >progress_activity</span
      >
    </div>

    <!-- Sales List -->
    <div v-else-if="salesStore.sales.length > 0" class="flex flex-col gap-4">
      <div v-if="filteredSales.length > 0" class="flex flex-col gap-4">
        <RouterLink
          v-for="sale in filteredSales"
          :key="sale.id"
          :to="`/sales/${sale.id}`"
          class="flex items-center gap-4 bg-surface-container border border-outline-variant rounded-[1rem] p-[24px] transition-all duration-200 hover:border-surface-tint"
        >
          <!-- Icon -->
          <div
            class="shrink-0 w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-on-surface-variant text-[24px]"
              >receipt_long</span
            >
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-bold font-display text-on-surface">
              {{ sale.items.length }} producto{{ sale.items.length > 1 ? 's' : '' }}
            </p>
            <p class="mt-0.5 text-[14px] text-on-surface-variant font-sans">
              {{ formatDate(sale.createdAt) }} · {{ formatTime(sale.createdAt) }}
            </p>
          </div>

          <!-- Total -->
          <div class="shrink-0 text-right">
            <p class="text-[17px] font-bold text-surface-tint">${{ formatPrice(sale.total) }}</p>
            <p v-if="sale.taxIncluded" class="text-[12px] text-on-surface-variant/60">IVA incluido</p>
          </div>

          <!-- Chevron -->
          <span class="material-symbols-outlined text-on-surface-variant/50">chevron_right</span>
        </RouterLink>
      </div>

      <!-- Empty State for Filter -->
      <div v-else class="flex flex-col items-center justify-center py-24">
        <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 mb-4">
          receipt_long
        </span>
        <p class="text-[17px] font-display font-semibold text-on-surface-variant text-center">
          No hay ventas en este período
        </p>
        <p class="mt-2 text-[14px] text-on-surface-variant/60 text-center font-sans">
          Las ventas correspondientes aparecerán aquí
        </p>
      </div>
    </div>

    <!-- Empty State General (No sales at all) -->
    <div v-else class="flex flex-col items-center justify-center py-24">
      <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 mb-4">
        receipt_long
      </span>
      <p class="text-[17px] font-display font-semibold text-on-surface-variant text-center">
        No se han realizado ventas aún
      </p>
      <p class="mt-2 text-[14px] text-on-surface-variant/60 text-center font-sans">
        Las ventas finalizadas aparecerán aquí
      </p>
    </div>
  </div>
</template>
