<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useShiftsStore } from '@/stores/shifts'
import type { Shift } from '@/services/db'

const router = useRouter()
const shiftsStore = useShiftsStore()

const shifts = ref<Shift[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    shifts.value = await shiftsStore.getAllShifts()
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function shiftDuration(shift: Shift): string {
  const start = new Date(shift.startedAt).getTime()
  const end = shift.closedAt ? new Date(shift.closedAt).getTime() : Date.now()
  const mins = Math.round((end - start) / 60000)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
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
      <h1 class="text-[22px] font-bold font-display text-on-background">
        Historial de Turnos
      </h1>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 animate-spin">
        progress_activity
      </span>
    </div>

    <!-- List -->
    <div v-else-if="shifts.length > 0" class="flex flex-col gap-3">
      <RouterLink
        v-for="shift in shifts"
        :key="shift.id"
        :to="`/shifts/${shift.id}`"
        class="flex items-center gap-4 bg-surface-container border border-outline-variant rounded-[1rem] p-5 transition-all duration-200 hover:border-surface-tint"
      >
        <!-- Icon + status indicator -->
        <div class="relative shrink-0">
          <div class="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-on-surface-variant text-[22px]">schedule</span>
          </div>
          <!-- Active indicator dot -->
          <span
            v-if="!shift.closedAt"
            class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-surface-container"
          />
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="text-[15px] font-bold font-display text-on-surface">
              Turno #{{ shift.id }}
            </p>
            <span
              v-if="!shift.closedAt"
              class="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full"
            >
              Activo
            </span>
          </div>
          <p class="mt-0.5 text-[13px] text-on-surface-variant font-sans">
            {{ formatDateTime(shift.startedAt) }}
          </p>
          <p class="text-[12px] text-on-surface-variant/60 font-sans">
            Duración: {{ shiftDuration(shift) }}
          </p>
        </div>

        <!-- Right: total + count + chevron -->
        <div class="shrink-0 text-right">
          <p class="text-[16px] font-bold text-surface-tint">${{ formatPrice(shift.totalCash) }}</p>
          <p class="text-[12px] text-on-surface-variant/60 font-sans mt-0.5">
            {{ shift.salesCount }} venta{{ shift.salesCount !== 1 ? 's' : '' }}
          </p>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant/50 shrink-0">chevron_right</span>
      </RouterLink>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-24">
      <span class="material-symbols-outlined text-[40px] text-on-surface-variant/50 mb-4">schedule</span>
      <p class="text-[17px] font-display font-semibold text-on-surface-variant text-center">
        No hay turnos registrados
      </p>
      <p class="mt-2 text-[14px] text-on-surface-variant/60 text-center font-sans">
        Los turnos cerrados aparecerán aquí
      </p>
    </div>
  </div>
</template>
