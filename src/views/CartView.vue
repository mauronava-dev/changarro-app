<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

// Delete confirmation modal
const showDeleteModal = ref(false)
const itemToDelete = ref<{ id: string; productName: string } | null>(null)

function formatPrice(price: number): string {
  return price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function requestDelete(item: { id: string; productName: string }) {
  itemToDelete.value = item
  showDeleteModal.value = true
}

function confirmDelete() {
  if (itemToDelete.value) {
    cartStore.removeItem(itemToDelete.value.id)
  }
  cancelDelete()
}

function cancelDelete() {
  showDeleteModal.value = false
  itemToDelete.value = null
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
        v-if="cartStore.items.length > 0"
        class="uppercase tracking-wider text-label-md bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant text-on-surface-variant"
      >
        {{ cartStore.itemCount }} ITEMS
      </span>
    </div>

    <!-- Cart Items -->
    <div v-if="cartStore.items.length > 0" class="flex flex-col gap-4">
      <article
        v-for="item in cartStore.items"
        :key="item.id"
        class="flex items-center gap-4 bg-surface-container border border-outline-variant rounded-[1rem] p-[24px] transition-all duration-200 hover:border-surface-tint"
      >
        <!-- Thumbnail -->
        <div
          class="shrink-0 w-16 h-16 bg-surface-container-high rounded-[1rem] border border-outline-variant flex items-center justify-center"
        >
          <span class="material-symbols-outlined text-on-surface-variant/50 text-[24px]"
            >shopping_bag</span
          >
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-[16px] font-bold font-display text-on-surface truncate">
            {{ item.productName }}
          </h3>
          <p class="mt-1 text-[20px] font-bold text-surface-tint">
            ${{ formatPrice(item.unitPrice) }}
          </p>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center gap-2">
          <button
            class="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest text-on-surface transition-colors hover:bg-surface-variant active:scale-95"
            aria-label="Disminuir cantidad"
            @click="cartStore.decrementQuantity(item.id)"
          >
            <span class="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <span class="w-8 text-center text-[18px] font-bold text-on-surface">
            {{ item.quantity }}
          </span>
          <button
            class="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-highest text-on-surface transition-colors hover:bg-surface-variant active:scale-95"
            aria-label="Aumentar cantidad"
            @click="cartStore.incrementQuantity(item.id)"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        <!-- Delete button -->
        <button
          class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full hover:bg-error/10 transition-colors active:scale-95"
          aria-label="Eliminar del carrito"
          @click="requestDelete(item)"
        >
          <span class="material-symbols-outlined text-error">delete</span>
        </button>
      </article>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-16 gap-4">
      <span class="material-symbols-outlined text-[48px] text-on-surface-variant/50"
        >shopping_cart</span
      >
      <p class="text-[20px] font-display font-semibold text-on-surface-variant text-center">
        Tu carrito está vacío
      </p>
      <p class="text-[16px] text-on-surface-variant/60 text-center">
        Agrega productos desde la pantalla de inicio
      </p>
    </div>

    <!-- Fixed Total Panel (only when cart has items) -->
    <div
      v-if="cartStore.items.length > 0"
      class="fixed bottom-20 left-0 right-0 z-40 mx-4 rounded-3xl p-6 liquid-glass"
    >
      <!-- Subtotal -->
      <div class="flex items-center justify-between mb-3">
        <span
          class="uppercase tracking-wider text-[14px] font-semibold text-on-surface-variant font-display"
        >
          Subtotal
        </span>
        <span class="text-[18px] font-bold text-on-surface">
          ${{ formatPrice(cartStore.subtotal) }}
        </span>
      </div>

      <!-- Tax -->
      <div class="flex items-center justify-between mb-4">
        <span
          class="uppercase tracking-wider text-[14px] font-semibold text-on-surface-variant font-display"
        >
          Impuestos (16%)
        </span>
        <span class="text-[18px] font-bold text-on-surface">
          ${{ formatPrice(cartStore.tax) }}
        </span>
      </div>

      <!-- Separator -->
      <div class="h-px bg-outline-variant mb-4"></div>

      <!-- Total -->
      <div class="flex items-center justify-between mb-5">
        <span
          class="uppercase tracking-wider text-[14px] font-semibold text-on-surface-variant font-display"
        >
          Total
        </span>
        <span class="text-[28px] font-semibold text-surface-tint">
          ${{ formatPrice(cartStore.total) }}
        </span>
      </div>

      <!-- Checkout Button -->
      <button
        class="w-full py-6 bg-surface-tint text-on-primary rounded-full text-[28px] font-bold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-xl active:scale-95"
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

  <!-- Delete Confirmation Modal -->
  <Teleport to="body">
    <Transition name="fade-scale">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[100] flex items-center justify-center px-5"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cancelDelete"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-sm bg-surface-container-high border border-outline-variant rounded-[2rem] p-8 shadow-[0_16px_48px_0_rgba(0,0,0,0.5)]"
        >
          <!-- Icon -->
          <div class="flex justify-center mb-5">
            <div class="flex items-center justify-center w-16 h-16 rounded-full bg-error/10">
              <span class="material-symbols-outlined text-error text-[32px]"
                >remove_shopping_cart</span
              >
            </div>
          </div>

          <!-- Title -->
          <h2 class="text-center text-[22px] font-bold font-display text-on-surface mb-3">
            Eliminar del carrito
          </h2>

          <!-- Message -->
          <p class="text-center text-[16px] text-on-surface-variant font-sans mb-8">
            ¿Deseas eliminar
            <strong class="text-on-surface">{{ itemToDelete?.productName }}</strong>
            del carrito?
          </p>

          <!-- Actions -->
          <div class="flex flex-col gap-3">
            <button
              class="w-full py-4 bg-error text-on-error rounded-full text-[18px] font-bold font-display transition-all duration-200 hover:shadow-lg active:scale-95"
              @click="confirmDelete"
            >
              Eliminar
            </button>
            <button
              class="w-full py-4 border border-outline-variant text-on-surface-variant rounded-full text-[18px] font-semibold font-display transition-all duration-200 hover:bg-surface-variant active:scale-95"
              @click="cancelDelete"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
