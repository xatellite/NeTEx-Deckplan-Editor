import { type App } from 'vue'
import * as components from './components'
import VueKonva from 'vue-konva';
import '@/assets/lib.css'

function install (app: App) {
  for (const key in components) {
    // @ts-expect-error
    app.component(key, components[key])
  }
  app.use(VueKonva);
}

export default { install }

export * from './components'