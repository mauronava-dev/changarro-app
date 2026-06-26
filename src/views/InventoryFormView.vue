<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => route.name === 'inventory-edit')
const productId = computed(() => route.params.id as string | undefined)

// Dummy products for edit mode lookup
const dummyProducts = [
  { id: '1', name: "Playera 'Ciber-Punk' XL", price: 450.0, category: 'PRODUCTO', unit: 'pieza' },
  { id: '2', name: 'Vinyl Edición Limitada', price: 680.0, category: 'PRODUCTO', unit: 'pieza' },
  { id: '3', name: "Llavero 'Void'", price: 110.5, category: 'PRODUCTO', unit: 'pieza' },
]

// Find existing product if editing
const existingProduct = computed(() => {
  if (isEditing.value && productId.value) {
    return dummyProducts.find((p) => p.id === productId.value)
  }
  return null
})

// Form state
const name = ref(existingProduct.value?.name ?? '')
const price = ref(existingProduct.value?.price?.toString() ?? '')
const selectedCategory = ref(existingProduct.value?.category ?? 'PRODUCTO')
const selectedUnit = ref(existingProduct.value?.unit ?? 'pieza')

const categories = ['SERVICIO', 'PRODUCTO', 'OTRO']
const units = ['pieza', 'kg', 'litro', 'paquete', 'servicio']

const pageTitle = computed(() => (isEditing.value ? 'Editar Producto' : 'Nuevo Producto'))

const isFormValid = computed(() => {
  return name.value.trim().length > 0 && parseFloat(price.value) > 0
})

function save() {
  if (!isFormValid.value) return
  // TODO: integrate with store
  router.push({ name: 'inventory' })
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header with back button -->
    <div class="flex items-center gap-3 mb-8">
      <RouterLink
        to="/settings/inventory"
        class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-variant transition-colors active:scale-95"
        aria-label="Volver al inventario"
      >
        <span class="material-symbols-outlined text-on-surface-variant">arrow_back</span>
      </RouterLink>
      <h1
        class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background"
      >
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Form Card -->
    <div
      class="bg-surface-container border border-white/5 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-8 md:p-[48px]"
    >
      <form @submit.prevent="save" class="flex flex-col gap-8">
        <!-- Product Name -->
        <div class="flex flex-col gap-3">
          <label
            class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display"
          >
            Nombre del Producto
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="e.g. Playera Negra"
            class="w-full bg-surface-container-low border border-outline-variant rounded-full px-6 py-4 text-[20px] text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-fixed-dim focus:border-transparent outline-none transition-all"
          />
        </div>

        <!-- Price -->
        <div class="flex flex-col gap-3">
          <label
            class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display"
          >
            Precio de venta (MXN)
          </label>
          <div class="relative">
            <span
              class="absolute left-6 top-1/2 -translate-y-1/2 text-[40px] text-primary-fixed-dim font-bold"
            >
              $
            </span>
            <input
              v-model="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full bg-surface-container-low border border-outline-variant rounded-full pl-14 pr-6 py-6 text-[40px] text-primary-fixed-dim font-bold placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-fixed-dim focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <!-- Category Chips -->
        <div class="flex flex-col gap-3">
          <label
            class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display"
          >
            Categoría
          </label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              :class="[
                'px-6 py-2.5 rounded-full text-label-md transition-all duration-200 active:scale-95',
                selectedCategory === category
                  ? 'bg-primary-container text-on-primary-container border border-primary-container'
                  : 'border border-outline-variant text-on-surface-variant hover:bg-surface-variant',
              ]"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- Unit selector -->
        <div class="flex flex-col gap-3">
          <label
            class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display"
          >
            Unidad de medida
          </label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="unit in units"
              :key="unit"
              type="button"
              :class="[
                'px-5 py-2.5 rounded-full text-label-md transition-all duration-200 active:scale-95 capitalize',
                selectedUnit === unit
                  ? 'bg-primary-container text-on-primary-container border border-primary-container'
                  : 'border border-outline-variant text-on-surface-variant hover:bg-surface-variant',
              ]"
              @click="selectedUnit = unit"
            >
              {{ unit }}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!isFormValid"
          :class="[
            'w-full py-5 text-[28px] font-semibold rounded-full shadow-lg flex items-center justify-center gap-3 transition-all duration-200 active:scale-95',
            isFormValid
              ? 'bg-primary-container text-on-primary-container hover:shadow-xl'
              : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed shadow-none',
          ]"
        >
          <span
            class="material-symbols-outlined text-[28px]"
            style="font-variation-settings: 'FILL' 1"
          >
            {{ isEditing ? 'save' : 'add_circle' }}
          </span>
          {{ isEditing ? 'Guardar Cambios' : 'Crear Producto' }}
        </button>
      </form>
    </div>
  </div>
</template>
