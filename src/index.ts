import { type App } from 'vue'
import * as editorComponents from './components/editor'
import * as rendererComponents from './components/renderer'
import '@/assets/lib.css'

function install(app: App) {
  for (const key in editorComponents) {
    // @ts-expect-error
    app.component(key, editorComponents[key])
  }

  for (const key in rendererComponents) {
    app.component(key, rendererComponents[key])
  }
}

export default { install }

export * from './components/editor'
export * from './components/renderer'
