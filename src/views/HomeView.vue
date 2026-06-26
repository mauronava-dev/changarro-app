<script setup lang="ts">
import { RouterLink } from 'vue-router'

const products = [
  { id: '1', name: "Playera 'Ciber-Punk' XL", price: 450.0 },
  { id: '2', name: 'Vinyl Edición Limitada', price: 680.0 },
  { id: '3', name: "Llavero 'Void'", price: 110.5 },
]

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function addToCart(productId: string) {
  // TODO: integrate with cart store
  console.log('Added to cart:', productId)
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <section class="mb-6">
      <h1
        class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background"
      >
        Productos
      </h1>
      <p class="mt-2 text-[18px] text-on-surface-variant font-sans">
        Toca un producto para agregarlo al carrito
      </p>
    </section>

    <!-- Product List -->
    <div class="flex flex-col gap-4">
      <article
        v-for="product in products"
        :key="product.id"
        class="flex items-center gap-4 bg-surface-container border border-outline-variant rounded-[1rem] p-[24px] transition-all duration-200 hover:border-surface-tint cursor-pointer active:scale-[0.98]"
        role="button"
        :aria-label="`Agregar ${product.name} al carrito`"
        @click="addToCart(product.id)"
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

        <!-- Add to cart icon -->
        <div
          class="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high"
        >
          <span class="material-symbols-outlined text-on-surface">add_shopping_cart</span>
        </div>
      </article>
    </div>

    <!-- FAB: Venta Rápida -->
    <RouterLink
      to="/quick-sale"
      class="fixed bottom-28 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary-container text-on-primary-container shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95"
      aria-label="Venta Rápida"
    >
      <span class="material-symbols-outlined text-[28px]">add</span>
    </RouterLink>
  </div>
</template>
