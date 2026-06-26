<script setup lang="ts">
import { ref } from 'vue'

const includeTax = ref(true)
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <h1
      class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background mb-6"
    >
      Ajustes
    </h1>

    <!-- GENERAL Section -->
    <h2
      class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      General
    </h2>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Nombre del negocio</span>
      <span class="text-[18px] text-on-surface-variant font-sans">Mi Changarro</span>
    </div>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Moneda</span>
      <span class="text-[18px] text-on-surface-variant font-sans">MXN</span>
    </div>

    <!-- IMPUESTOS Section -->
    <h2
      class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      Impuestos
    </h2>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Incluir impuestos</span>
      <!-- Toggle -->
      <button
        class="relative w-12 h-6 rounded-full transition-colors duration-200"
        :class="includeTax ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'"
        aria-label="Incluir impuestos"
        @click="includeTax = !includeTax"
      >
        <span
          class="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200"
          :class="includeTax ? 'translate-x-6' : 'translate-x-0.5'"
        ></span>
      </button>
    </div>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Porcentaje</span>
      <span class="text-[18px] text-on-surface-variant font-sans">16%</span>
    </div>

    <!-- DATOS Section -->
    <h2
      class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      Datos
    </h2>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Exportar ventas</span>
      <button
        class="px-5 py-2 rounded-full border border-outline-variant text-on-surface-variant text-label-md transition-all duration-200 hover:bg-surface-variant active:scale-95"
      >
        Exportar
      </button>
    </div>

    <!-- ACERCA DE Section -->
    <h2
      class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      Acerca de
    </h2>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Versión</span>
      <span class="text-[18px] text-on-surface-variant font-sans">0.1.0</span>
    </div>
  </div>
</template>
