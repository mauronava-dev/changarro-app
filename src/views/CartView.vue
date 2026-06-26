<script setup lang="ts">
import { ref, computed } from 'vue'

const cartItems = ref([
  { id: '1', name: "Playera 'Ciber-Punk' XL", price: 450.0, quantity: 1 },
  { id: '2', name: 'Vinyl Edición Limitada', price: 680.0, quantity: 1 },
  { id: '3', name: "Llavero 'Void'", price: 110.5, quantity: 1 },
])

const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

const tax = computed(() => subtotal.value * 0.16)
const total = computed(() => subtotal.value + tax.value)

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function incrementQuantity(id: string) {
  const item = cartItems.value.find((i) => i.id === id)
  if (item) item.quantity++
}

function decrementQuantity(id: string) {
  const item = cartItems.value.find((i) => i.id === id)
  if (item && item.quantity > 1) item.quantity--
}

function removeItem(id: string) {
  cartItems.value = cartItems.value.filter((i) => i.id !== id)
}
</script>

<template>
  <div class="max-w-2xl mx-auto pb-72">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <h1
        class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background"
      >
        Carrito
      </h1>
      <span
        class="uppercase tracking-wider text-label-md bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant text-on-surface-variant"
      >
        {{ cartItems.length }} ITEMS
      </span>
    </div>

    <!-- Cart Items -->
    <div class="flex flex-col gap-4">
      <article
        v-for="item in cartItems"
        :key="item.id"
        class="flex items-center gap-4 bg-surface-container border border-outline-variant rounded-[1rem] p-[24px] transition-all duration-200 hover:border-surface-tint"
      >
        <!-- Thumbnail -->
        <div class="shrink-0 w-20 h-20 bg-surface-container-high rounded-[1rem]"></div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-[16px] font-bold font-display text-on-surface truncate">
            {{ item.name }}
          </h3>
          <p class="mt-1 text-[20px] font-bold text-surface-tint">${{ formatPrice(item.price) }}</p>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center gap-2">
          <button
            class="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest text-on-surface transition-colors hover:bg-surface-variant active:scale-95"
            aria-label="Disminuir cantidad"
            @click="decrementQuantity(item.id)"
          >
            <span class="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <span class="w-8 text-center text-[18px] font-bold text-on-surface">
            {{ item.quantity }}
          </span>
          <button
            class="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest text-on-surface transition-colors hover:bg-surface-variant active:scale-95"
            aria-label="Aumentar cantidad"
            @click="incrementQuantity(item.id)"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        <!-- Delete button -->
        <button
          class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full hover:bg-error/10 transition-colors active:scale-95"
          aria-label="Eliminar del carrito"
          @click="removeItem(item.id)"
        >
          <span class="material-symbols-outlined text-error">delete</span>
        </button>
      </article>
    </div>

    <!-- Fixed Total Panel -->
    <div class="fixed bottom-20 left-0 right-0 z-40 mx-4 rounded-[1.5rem] p-6 liquid-glass">
      <!-- Subtotal -->
      <div class="flex items-center justify-between mb-3">
        <span
          class="uppercase tracking-[0.05em] text-[14px] font-semibold text-on-surface-variant font-display"
        >
          Subtotal
        </span>
        <span class="text-[18px] font-bold text-on-surface"> ${{ formatPrice(subtotal) }} </span>
      </div>

      <!-- Tax -->
      <div class="flex items-center justify-between mb-4">
        <span
          class="uppercase tracking-[0.05em] text-[14px] font-semibold text-on-surface-variant font-display"
        >
          Impuestos (16%)
        </span>
        <span class="text-[18px] font-bold text-on-surface"> ${{ formatPrice(tax) }} </span>
      </div>

      <!-- Separator -->
      <div class="h-[1px] bg-outline-variant mb-4"></div>

      <!-- Total -->
      <div class="flex items-center justify-between mb-5">
        <span
          class="uppercase tracking-[0.05em] text-[14px] font-semibold text-on-surface-variant font-display"
        >
          Total
        </span>
        <span class="text-[28px] font-semibold text-surface-tint"> ${{ formatPrice(total) }} </span>
      </div>

      <!-- Checkout Button -->
      <button
        class="w-full py-[24px] bg-surface-tint text-on-primary rounded-full text-[28px] font-bold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-xl active:scale-95"
      >
        <span
          class="material-symbols-outlined text-[28px]"
          style="font-variation-settings: 'FILL' 1"
        >
          payments
        </span>
        Finalizar Venta
      </button>
    </div>
  </div>
</template>
