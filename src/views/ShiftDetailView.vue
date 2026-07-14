<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useShiftsStore } from '@/stores/shifts'
import type { Shift, Sale } from '@/services/db'

const router = useRouter()
const route = useRoute()
const shiftsStore = useShiftsStore()

const shift = ref<Shift | null>(null)
const sales = ref<Sale[]>([])
const isLoading = ref(true)

const shiftId = computed(() => parseInt(route.params.id as string))

const totalCash = computed(() =>
  sales.value.reduce((sum, s) => sum + s.total, 0)
)
const avgTicket = computed(() =>
  sales.value.length > 0 ? totalCash.value / sales.value.length : 0
)

function shiftDuration(s: Shift): string {
  const start = new Date(s.startedAt).getTime()
  const end = s.closedAt ? new Date(s.closedAt).getTime() : Date.now()
  const mins = Math.round((end - start) / 60000)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

onMounted(async () => {
  try {
    const found = await shiftsStore.getShiftById(shiftId.value)
    if (!found) {
      router.replace('/shifts')
      return
    }
    shift.value = found
    sales.value = await shiftsStore.getShiftSales(shiftId.value)
  } finally {
    isLoading.value = false
  }
})

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <button
        class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors active:scale-95"
        @click="router.back()"
      >
        <span class="material-symbols-outlined text-on-surface-variant">arrow_back</span>
      </button>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-[22px] font-bold font-display text-on-background">
            Turno #{{ shiftId }}
          </h1>
          <span
            v-if="shift && !shift.closedAt"
            class="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full"
          >
            Activo
          </span>
        </div>
        <p v-if="shift" class="text-[13px] text-on-surface-variant font-sans mt-0.5">
          {{ formatDate(shift.startedAt) }} · Duración: {{ shiftDuration(shift) }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 animate-spin">
        progress_activity
      </span>
    </div>

    <template v-else-if="shift">
      <!-- Timeline summary -->
      <div class="bg-surface-container border border-outline-variant rounded-[1.5rem] p-6 mb-4">
        <p class="text-[13px] uppercase tracking-wider font-semibold text-on-surface-variant font-display mb-4">
          Resumen del turno
        </p>

        <!-- Timeline rows -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-[14px] text-on-surface-variant font-sans">
              <span class="material-symbols-outlined text-[17px]">login</span>
              Apertura
            </div>
            <span class="text-[14px] text-on-surface font-sans">{{ formatDateTime(shift.startedAt) }}</span>
          </div>
          <div v-if="shift.closedAt" class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-[14px] text-on-surface-variant font-sans">
              <span class="material-symbols-outlined text-[17px]">logout</span>
              Cierre
            </div>
            <span class="text-[14px] text-on-surface font-sans">{{ formatDateTime(shift.closedAt) }}</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex gap-3 mt-5">
          <div class="flex-1 bg-surface-container-high rounded-xl p-3 text-center">
            <p class="text-[22px] font-bold font-display text-surface-tint">${{ formatPrice(totalCash) }}</p>
            <p class="text-[11px] text-on-surface-variant font-sans mt-0.5">Total en caja</p>
          </div>
          <div class="flex-1 bg-surface-container-high rounded-xl p-3 text-center">
            <p class="text-[22px] font-bold font-display text-on-surface">{{ sales.length }}</p>
            <p class="text-[11px] text-on-surface-variant font-sans mt-0.5">Ventas</p>
          </div>
          <div class="flex-1 bg-surface-container-high rounded-xl p-3 text-center">
            <p class="text-[22px] font-bold font-display text-on-surface">${{ formatPrice(avgTicket) }}</p>
            <p class="text-[11px] text-on-surface-variant font-sans mt-0.5">Ticket prom.</p>
          </div>
        </div>
      </div>

      <!-- Sales list -->
      <div
        v-if="sales.length > 0"
        class="bg-surface-container border border-outline-variant rounded-[1.5rem] overflow-hidden mb-4"
      >
        <div class="px-6 pt-5 pb-3">
          <p class="text-[13px] uppercase tracking-wider font-semibold text-on-surface-variant font-display">
            Ventas del turno
          </p>
        </div>

        <div class="flex flex-col">
          <RouterLink
            v-for="(sale, index) in sales"
            :key="sale.id"
            :to="`/sales/${sale.id}`"
            :class="[
              'flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-container-high',
              index < sales.length - 1 ? 'border-b border-outline-variant/50' : ''
            ]"
          >
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-medium text-on-surface font-sans">
                {{ sale.items.length }} producto{{ sale.items.length > 1 ? 's' : '' }}
              </p>
              <p class="text-[12px] text-on-surface-variant/60 font-sans mt-0.5">
                {{ formatDate(sale.createdAt) }} · {{ formatTime(sale.createdAt) }}
              </p>
            </div>
            <span class="text-[15px] font-bold text-surface-tint shrink-0">${{ formatPrice(sale.total) }}</span>
            <span class="material-symbols-outlined text-on-surface-variant/40 text-[18px] shrink-0">chevron_right</span>
          </RouterLink>
        </div>
      </div>

      <!-- Empty sales -->
      <div
        v-else
        class="bg-surface-container border border-outline-variant rounded-[1.5rem] p-8 mb-4 text-center"
      >
        <span class="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-3 block">receipt_long</span>
        <p class="text-[14px] text-on-surface-variant font-sans">No hubo ventas en este turno</p>
      </div>
    </template>
  </div>
</template>
