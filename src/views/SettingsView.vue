<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

// Editable business name
const isEditingName = ref(false)
const editingName = ref('')

function startEditingName() {
  editingName.value = settingsStore.businessName
  isEditingName.value = true
}

function saveName() {
  const trimmed = editingName.value.trim()
  if (trimmed) {
    settingsStore.setBusinessName(trimmed)
  }
  isEditingName.value = false
}

function cancelEditName() {
  isEditingName.value = false
}

function toggleTax() {
  settingsStore.setTaxEnabled(!settingsStore.taxEnabled)
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <h1
      class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background mb-6"
    >
      Ajustes
    </h1>

    <!-- INVENTARIO Section -->
    <h2
      class="uppercase tracking-wider text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      Productos
    </h2>

    <RouterLink
      to="/settings/inventory"
      class="flex justify-between items-center py-4 border-b border-outline-variant group"
    >
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-on-surface-variant">inventory_2</span>
        <span class="text-[18px] text-on-surface font-sans">Gestionar inventario</span>
      </div>
      <span
        class="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors"
      >
        chevron_right
      </span>
    </RouterLink>

    <!-- GENERAL Section -->
    <h2
      class="uppercase tracking-wider text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      General
    </h2>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Nombre del negocio</span>

      <!-- Editing mode -->
      <div v-if="isEditingName" class="flex items-center gap-2">
        <input
          v-model="editingName"
          type="text"
          class="w-40 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 text-[16px] text-on-surface focus:ring-2 focus:ring-primary-fixed-dim focus:border-transparent outline-none"
          @keyup.enter="saveName"
          @keyup.escape="cancelEditName"
          autofocus
        />
        <button
          class="flex items-center justify-center w-9 h-9 rounded-full bg-primary-container text-on-primary-container active:scale-95"
          aria-label="Guardar"
          @click="saveName"
        >
          <span class="material-symbols-outlined text-[20px]">check</span>
        </button>
        <button
          class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-variant text-on-surface-variant active:scale-95"
          aria-label="Cancelar"
          @click="cancelEditName"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Display mode -->
      <button
        v-else
        class="flex items-center gap-2 text-[18px] text-on-surface-variant font-sans hover:text-on-surface transition-colors"
        @click="startEditingName"
      >
        {{ settingsStore.businessName }}
        <span class="material-symbols-outlined text-[18px]">edit</span>
      </button>
    </div>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Moneda</span>
      <span class="text-[18px] text-on-surface-variant font-sans">{{
        settingsStore.currency
      }}</span>
    </div>

    <!-- IMPUESTOS Section -->
    <h2
      class="uppercase tracking-wider text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      Impuestos
    </h2>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Incluir IVA en ventas</span>
      <!-- Toggle -->
      <button
        class="relative w-12 h-6 rounded-full transition-colors duration-200"
        :class="settingsStore.taxEnabled ? 'bg-primary-fixed-dim' : 'bg-surface-container-highest'"
        aria-label="Incluir impuestos"
        @click="toggleTax"
      >
        <span
          class="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200"
          :class="settingsStore.taxEnabled ? 'translate-x-6' : 'translate-x-0.5'"
        ></span>
      </button>
    </div>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Porcentaje</span>
      <span class="text-[18px] text-on-surface-variant font-sans"
        >{{ Math.round(settingsStore.taxRate * 100) }}%</span
      >
    </div>

    <!-- DATOS Section -->
    <h2
      class="uppercase tracking-wider text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
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
      class="uppercase tracking-wider text-[16px] font-semibold text-on-surface-variant font-display mt-8 mb-4"
    >
      Acerca de
    </h2>

    <div class="flex justify-between items-center py-4 border-b border-outline-variant">
      <span class="text-[18px] text-on-surface font-sans">Versión</span>
      <span class="text-[18px] text-on-surface-variant font-sans">0.1.0</span>
    </div>
  </div>
</template>
