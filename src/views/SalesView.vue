<script setup lang="ts">
// TODO: integrate with sales store to show completed sales
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <h1
      class="text-[32px] leading-[40px] tracking-[-0.02em] font-bold font-display text-on-background mb-6"
    >
      Ventas
    </h1>

    <!-- Empty State -->
    <div class="flex flex-col items-center justify-center py-24">
      <span class="material-symbols-outlined text-[48px] text-on-surface-variant/50 mb-4">
        receipt_long
      </span>
      <p class="text-[20px] font-display font-semibold text-on-surface-variant text-center">
        No se han realizado ventas aún
      </p>
      <p class="mt-2 text-[16px] text-on-surface-variant/60 text-center font-sans">
        Las ventas finalizadas aparecerán aquí
      </p>
    </div>
  </div>
</template>
