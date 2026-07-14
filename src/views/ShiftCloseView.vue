<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShiftsStore } from '@/stores/shifts'
import { playCheckoutSuccessAnimation } from '@/composables/useParticles'
import type { Sale } from '@/services/db'

const router = useRouter()
const shiftsStore = useShiftsStore()

const sales = ref<Sale[]>([])
const isLoading = ref(true)
const isClosing = ref(false)
const notes = ref('')
const shortage = ref<number | null>(null)

const shift = computed(() => shiftsStore.activeShift)

// Aggregate stats
const totalCash = computed(() =>
  sales.value.reduce((sum, s) => sum + s.total, 0)
)
const salesCount = computed(() => sales.value.length)
const avgTicket = computed(() =>
  salesCount.value > 0 ? totalCash.value / salesCount.value : 0
)
const previewSales = computed(() => sales.value.slice(0, 5))

onMounted(async () => {
  if (!shift.value) {
    router.replace('/sales')
    return
  }
  try {
    sales.value = await shiftsStore.getShiftSales(shift.value.id)
  } finally {
    isLoading.value = false
  }
})

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function confirmClose() {
  if (!shift.value || isClosing.value) return
  isClosing.value = true
  try {
    await shiftsStore.closeShift(
      totalCash.value,
      salesCount.value,
      notes.value || undefined,
      shortage.value ?? undefined,
    )
    // Open next shift automatically
    await shiftsStore.openShift()
    // Play the same celebration animation as checkout
    await playCheckoutSuccessAnimation()
    router.replace('/sales')
  } catch (e) {
    console.error('Error al cerrar turno:', e)
    isClosing.value = false
  }
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
        <h1 class="text-[22px] font-bold font-display text-on-background leading-tight">
          Cierre de Turno #{{ shift?.id }}
        </h1>
        <p v-if="shift" class="text-[13px] text-on-surface-variant font-sans mt-0.5">
          Apertura: {{ formatDateTime(shift.startedAt) }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 animate-spin">
        progress_activity
      </span>
    </div>

    <template v-else>
      <!-- Cash Summary Card -->
      <div class="bg-surface-container border border-outline-variant rounded-[1.5rem] p-6 mb-4">
        <p class="text-[13px] uppercase tracking-wider font-semibold text-on-surface-variant font-display mb-4">
          Resumen de caja
        </p>

        <!-- Total cash row -->
        <div class="flex items-center justify-between py-3 border-b border-outline-variant">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
              <span class="material-symbols-outlined text-on-surface-variant text-[20px]">payments</span>
            </div>
            <span class="text-[15px] text-on-surface font-sans">Efectivo recibido</span>
          </div>
          <span class="text-[20px] font-bold text-surface-tint font-display">
            ${{ formatPrice(totalCash) }}
          </span>
        </div>

        <!-- Stats row -->
        <div class="flex gap-4 mt-4">
          <div class="flex-1 bg-surface-container-high rounded-xl p-3 text-center">
            <p class="text-[22px] font-bold font-display text-on-surface">{{ salesCount }}</p>
            <p class="text-[12px] text-on-surface-variant font-sans mt-0.5">Ventas</p>
          </div>
          <div class="flex-1 bg-surface-container-high rounded-xl p-3 text-center">
            <p class="text-[22px] font-bold font-display text-on-surface">${{ formatPrice(avgTicket) }}</p>
            <p class="text-[12px] text-on-surface-variant font-sans mt-0.5">Ticket promedio</p>
          </div>
        </div>
      </div>

      <!-- Recent Sales Preview Card -->
      <div
        v-if="previewSales.length > 0"
        class="bg-surface-container border border-outline-variant rounded-[1.5rem] p-6 mb-6"
      >
        <p class="text-[13px] uppercase tracking-wider font-semibold text-on-surface-variant font-display mb-4">
          Últimas ventas del turno
        </p>
        <div class="flex flex-col gap-3">
          <div
            v-for="sale in previewSales"
            :key="sale.id"
            class="flex items-center justify-between"
          >
            <div>
              <p class="text-[14px] text-on-surface font-sans">
                {{ sale.items.length }} producto{{ sale.items.length > 1 ? 's' : '' }}
              </p>
              <p class="text-[12px] text-on-surface-variant/60 font-sans">
                {{ formatDateTime(sale.createdAt) }}
              </p>
            </div>
            <span class="text-[15px] font-bold text-surface-tint">${{ formatPrice(sale.total) }}</span>
          </div>
        </div>
        <p
          v-if="salesCount > 5"
          class="text-[12px] text-on-surface-variant/50 font-sans text-center mt-3"
        >
          + {{ salesCount - 5 }} venta{{ salesCount - 5 > 1 ? 's' : '' }} más en este turno
        </p>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-surface-container border border-outline-variant rounded-[1.5rem] p-8 mb-6 text-center">
        <span class="material-symbols-outlined text-[36px] text-on-surface-variant/40 mb-3 block">receipt_long</span>
        <p class="text-[14px] text-on-surface-variant font-sans">No hubo ventas en este turno</p>
      </div>

      <!-- Notes & Shortage Card -->
      <div class="bg-surface-container border border-outline-variant rounded-[1.5rem] p-6 mb-4">
        <p class="text-[13px] uppercase tracking-wider font-semibold text-on-surface-variant font-display mb-4">
          Notas del cierre <span class="normal-case tracking-normal font-normal text-on-surface-variant/50">(opcionales)</span>
        </p>

        <!-- Shortage amount -->
        <div class="mb-4">
          <label class="text-[13px] text-on-surface-variant font-sans mb-2 block">
            Faltante en caja
          </label>
          <div class="relative flex items-center">
            <span class="absolute left-5 text-[15px] text-on-surface-variant/60 font-sans select-none">$</span>
            <input
              v-model.number="shortage"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="w-full h-12 pl-9 pr-5 bg-surface-container-low border border-outline-variant rounded-full text-[15px] text-on-surface font-sans placeholder-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-transparent transition-all"
            />
          </div>
          <p class="text-[11px] text-on-surface-variant/50 font-sans mt-1.5 pl-1">
            Si el efectivo en caja es menor al esperado
          </p>
        </div>

        <!-- Notes textarea -->
        <div>
          <label class="text-[13px] text-on-surface-variant font-sans mb-2 block">
            Observaciones
          </label>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Ej: Se realizó cambio de efectivo, llegó proveedor..."
            class="w-full px-5 py-3 bg-surface-container-low border border-outline-variant rounded-2xl text-[14px] text-on-surface font-sans placeholder-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-transparent transition-all resize-none leading-relaxed"
          />
        </div>
      </div>

      <!-- Confirm Button -->
      <button
        class="w-full py-4 rounded-full text-label-md font-bold transition-all active:scale-95 disabled:opacity-50"
        :class="isClosing ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-primary-container text-on-primary-container hover:shadow-lg'"
        :disabled="isClosing"
        @click="confirmClose"
      >
        <span v-if="isClosing" class="flex items-center justify-center gap-2">
          <span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          Cerrando turno...
        </span>
        <span v-else>Confirmar Cierre de Turno</span>
      </button>

      <p class="text-[12px] text-on-surface-variant/50 font-sans text-center mt-3">
        Al confirmar se iniciará automáticamente el Turno #{{ (shift?.id ?? 0) + 1 }}
      </p>
    </template>
  </div>
</template>
