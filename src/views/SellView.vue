<script setup lang="ts">
import { ref } from 'vue'

const productName = ref('')
const price = ref('')
const selectedCategory = ref('SERVICIO')

const categories = ['SERVICIO', 'PRODUCTO', 'OTRO']

function addToCart() {
  // TODO: integrate with cart store
  productName.value = ''
  price.value = ''
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <section class="mb-8">
      <h1
        class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background"
      >
        Venta Rápida
      </h1>
      <p class="mt-2 text-[20px] leading-[32px] text-on-surface-variant font-sans">
        Registra un producto o servicio personalizado a tu venta actual.
      </p>
    </section>

    <!-- Form Card -->
    <div
      class="bg-surface-container border border-white/5 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-8 md:p-[48px]"
    >
      <form @submit.prevent="addToCart" class="flex flex-col gap-8">
        <!-- Product Name -->
        <div class="flex flex-col gap-3">
          <label
            class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display"
          >
            Nombre del Producto
          </label>
          <input
            v-model="productName"
            type="text"
            placeholder="e.g. Servicio Especial"
            class="w-full bg-surface-container-low border border-outline-variant rounded-full px-6 py-4 text-[20px] text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-fixed-dim focus:border-transparent outline-none transition-all"
          />
        </div>

        <!-- Price -->
        <div class="flex flex-col gap-3">
          <label
            class="uppercase tracking-[0.05em] text-[16px] font-semibold text-on-surface-variant font-display"
          >
            Precio (MXN)
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

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-5 bg-primary-container text-on-primary-container text-[28px] font-semibold rounded-full shadow-lg flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-xl active:scale-95"
        >
          <span
            class="material-symbols-outlined text-[28px]"
            style="font-variation-settings: 'FILL' 1"
          >
            shopping_cart
          </span>
          Agregar al Carrito
        </button>
      </form>
    </div>

    <!-- Info Note -->
    <div class="mt-8 border-l-4 border-primary-fixed-dim/40 pl-6 py-2">
      <p class="text-[18px] text-on-surface-variant font-sans">
        Los productos agregados aquí se suman a tu carrito actual. Puedes finalizar la venta desde
        la pestaña de Carrito.
      </p>
    </div>
  </div>
</template>
