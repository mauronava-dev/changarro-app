<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const cartStore = useCartStore()
const settingsStore = useSettingsStore()

const tabs = [
  { label: 'Inicio', icon: 'home', route: '/', name: 'home' },
  { label: 'Carrito', icon: 'shopping_cart', route: '/cart', name: 'cart' },
  { label: 'Ventas', icon: 'point_of_sale', route: '/sales', name: 'sales' },
]

function isActive(tabName: string): boolean {
  return route.name === tabName
}

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <!-- TopAppBar -->
  <header
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-5 bg-surface-container/80 backdrop-blur-lg border-b border-outline-variant"
  >
    <!-- Left: Logo + Name -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-primary-container"></div>
      <span
        class="font-display text-[28px] font-bold text-primary-fixed-dim truncate max-w-[160px]"
        >{{ settingsStore.businessName }}</span
      >
    </div>

    <!-- Right: Total badge + Settings icon -->
    <div class="flex items-center gap-3">
      <RouterLink
        to="/cart"
        class="text-label-md bg-surface-container-high px-4 py-1.5 rounded-full border border-outline-variant text-primary-fixed-dim transition-colors hover:bg-surface-variant"
      >
        ${{ formatPrice(cartStore.total) }}
      </RouterLink>
      <RouterLink
        to="/settings"
        class="flex items-center justify-center w-12 h-12 rounded-full hover:bg-surface-variant transition-colors"
        aria-label="Ajustes"
      >
        <span class="material-symbols-outlined text-on-surface-variant">account_circle</span>
      </RouterLink>
    </div>
  </header>

  <!-- Main content -->
  <main class="pt-24 pb-32 px-5">
    <RouterView />
  </main>

  <!-- Bottom Navigation -->
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-3 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant shadow-nav"
  >
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.route"
      :class="[
        'flex items-center gap-2 transition-all duration-200 active:scale-90',
        isActive(tab.name)
          ? 'bg-primary-container text-on-primary-container rounded-full px-5 py-2'
          : 'text-on-surface-variant p-2 hover:bg-surface-variant rounded-full',
      ]"
      :aria-label="tab.label"
    >
      <span
        class="material-symbols-outlined"
        :style="isActive(tab.name) ? 'font-variation-settings: \'FILL\' 1' : ''"
      >
        {{ tab.icon }}
      </span>
      <span v-if="isActive(tab.name)" class="text-label-md">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>
