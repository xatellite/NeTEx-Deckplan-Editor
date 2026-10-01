import { createApp } from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(VueKonva)
app.mount('#app')
