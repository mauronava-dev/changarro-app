<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const products = [
  { id: '1', name: "Playera 'Ciber-Punk' XL", price: 450.0 },
  { id: '2', name: 'Vinyl Edición Limitada', price: 680.0 },
  { id: '3', name: "Llavero 'Void'", price: 110.5 },
]

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <h1
        class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background"
      >
        Inventario
      </h1>
      <span
        class="text-label-md bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant text-on-surface-variant"
      >
        {{ products.length }} ITEMS
      </span>
    </div>

    <!-- Search -->
    <div class="relative mb-6">
      <span
        class="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant"
      >
        search
      </span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar producto..."
        class="w-full bg-surface-container-low border border-outline-variant rounded-full pl-14 pr-6 py-4 text-[18px] text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-fixed-dim focus:border-transparent outline-none transition-all"
      />
    </div>

    <!-- Product List -->
    <div class="flex flex-col gap-4">
      <article
        v-for="product in products"
        :key="product.id"
        class="flex items-center gap-4 bg-surface-container border border-outline-variant rounded-[1rem] p-[24px] transition-all duration-200 hover:border-surface-tint"
      >
        <!-- Thumbnail -->
        <div
          class="shrink-0 w-20 h-20 bg-surface-container-high rounded-[1rem] border border-outline-variant"
        ></div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-[16px] font-bold font-display text-on-surface truncate">
            {{ product.name }}
          </h3>
          <p class="mt-1 text-[20px] font-bold text-surface-tint">
            ${{ formatPrice(product.price) }}
          </p>
        </div>

        <!-- Add to cart button -->
        <button
          class="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors active:scale-95"
          aria-label="Agregar al carrito"
        >
          <span class="material-symbols-outlined text-on-surface">add_shopping_cart</span>
        </button>
      </article>
    </div>
  </div>
</template>
