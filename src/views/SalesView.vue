<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSalesStore } from '@/stores/sales'

const salesStore = useSalesStore()

onMounted(() => {
  salesStore.loadSales()
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
    <!-- Header -->
    <h1
      class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background mb-6"
    >
      Ventas
    </h1>

    <!-- Loading -->
    <div v-if="salesStore.isLoading" class="flex justify-center py-16">
      <span class="material-symbols-outlined text-[48px] text-on-surface-variant/50 animate-spin"
        >progress_activity</span
      >
    </div>

    <!-- Sales List -->
    <div v-else-if="salesStore.sales.length > 0" class="flex flex-col gap-4">
      <RouterLink
        v-for="sale in salesStore.sales"
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
          <p class="text-[16px] font-bold font-display text-on-surface">
            {{ sale.items.length }} producto{{ sale.items.length > 1 ? 's' : '' }}
          </p>
          <p class="mt-0.5 text-[14px] text-on-surface-variant font-sans">
            {{ formatDate(sale.createdAt) }} · {{ formatTime(sale.createdAt) }}
          </p>
        </div>

        <!-- Total -->
        <div class="shrink-0 text-right">
          <p class="text-[20px] font-bold text-surface-tint">${{ formatPrice(sale.total) }}</p>
          <p v-if="sale.taxIncluded" class="text-[12px] text-on-surface-variant/60">IVA incluido</p>
        </div>

        <!-- Chevron -->
        <span class="material-symbols-outlined text-on-surface-variant/50">chevron_right</span>
      </RouterLink>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-24">
      <span class="material-symbols-outlined text-[48px] text-on-surface-variant/50 mb-4">
        receipt_long
      </span>
      <p class="text-[20px] font-display font-semibold text-on-surface-variant text-center">
        No se han realizado ventas aún
      </p>
      <p class="mt-2 text-[16px] text-on-surface-variant/60 text-center font-sans">
        Las ventas finalizadas aparecerán aquí
      </p>
    </div>
  </div>
</template>
