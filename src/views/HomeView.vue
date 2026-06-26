<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const productsStore = useProductsStore()
const cartStore = useCartStore()

onMounted(() => {
  productsStore.loadProducts()
})

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function addToCart(product: { id: string; name: string; price: number }) {
  cartStore.addItem(product)
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

    <!-- Loading -->
    <div v-if="productsStore.isLoading" class="flex justify-center py-16">
      <span class="material-symbols-outlined text-[48px] text-on-surface-variant/50 animate-spin"
        >progress_activity</span
      >
    </div>

    <!-- Product List -->
    <div v-else-if="productsStore.activeProducts.length > 0" class="flex flex-col gap-4">
      <article
        v-for="product in productsStore.activeProducts"
        :key="product.id"
        class="flex items-center gap-4 bg-surface-container border border-outline-variant rounded-[1rem] p-[24px] transition-all duration-200 hover:border-surface-tint cursor-pointer active:scale-[0.98]"
        role="button"
        :aria-label="`Agregar ${product.name} al carrito`"
        @click="addToCart(product)"
      >
        <!-- Thumbnail -->
        <div
          class="shrink-0 w-16 h-16 bg-surface-container-high rounded-[1rem] border border-outline-variant flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-on-surface-variant/50 text-[28px]"
            >inventory_2</span
          >
        </div>

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

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-16 gap-4">
      <span class="material-symbols-outlined text-[48px] text-on-surface-variant/50"
        >storefront</span
      >
      <p class="text-[20px] font-display font-semibold text-on-surface-variant text-center">
        No hay productos en tu inventario
      </p>
      <p class="text-[16px] text-on-surface-variant/60 text-center">
        Agrega productos desde Ajustes → Inventario
      </p>
      <RouterLink
        to="/settings/inventory/new"
        class="mt-4 px-6 py-3 bg-primary-container text-on-primary-container rounded-full text-label-md transition-all duration-200 hover:shadow-lg active:scale-95"
      >
        Agregar primer producto
      </RouterLink>
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
