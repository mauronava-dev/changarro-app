import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useSettingsStore } from '@/stores/settings'
import { useCartStore } from '@/stores/cart'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Load persisted data before mounting
const settingsStore = useSettingsStore()
const cartStore = useCartStore()

Promise.all([settingsStore.loadSettings(), cartStore.loadCart()]).then(() => {
  app.mount('#app')
})
