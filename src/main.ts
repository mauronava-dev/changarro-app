import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useSettingsStore } from '@/stores/settings'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Load settings before mounting to ensure tax config is ready
const settingsStore = useSettingsStore()
settingsStore.loadSettings().then(() => {
  app.mount('#app')
})
