import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Inicio' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { title: 'Carrito' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
      meta: { title: 'Cobrar' },
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('@/views/SalesView.vue'),
      meta: { title: 'Ventas' },
    },
    {
      path: '/sales/:id',
      name: 'sale-detail',
      component: () => import('@/views/SaleDetailView.vue'),
      meta: { title: 'Detalle de Venta' },
    },
    {
      path: '/quick-sale',
      name: 'quick-sale',
      component: () => import('@/views/QuickSaleView.vue'),
      meta: { title: 'Venta Rápida' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: 'Ajustes' },
    },
    {
      path: '/settings/inventory',
      name: 'inventory',
      component: () => import('@/views/InventoryView.vue'),
      meta: { title: 'Inventario' },
    },
    {
      path: '/settings/inventory/new',
      name: 'inventory-new',
      component: () => import('@/views/InventoryFormView.vue'),
      meta: { title: 'Nuevo Producto' },
    },
    {
      path: '/settings/inventory/:id/edit',
      name: 'inventory-edit',
      component: () => import('@/views/InventoryFormView.vue'),
      meta: { title: 'Editar Producto' },
    },
  ],
})

export default router
