import { type App } from 'vue'
import * as editorComponents from './components/editor'
import * as rendererComponents from './components/renderer'
import {parseNeTEx} from './helpers/parser'
import {type Availability, PassengerSpotAvailability} from './models/view/seats'
import '@/assets/lib.css'

function install(app: App) {
  for (const key in editorComponents) {
    app.component(key, editorComponents[key as keyof typeof editorComponents])
  }

  for (const key in rendererComponents) {
    app.component(key, rendererComponents[key as keyof typeof rendererComponents])
  }
}

export default { install }

export * from './components/editor'
export * from './components/renderer'
export { parseNeTEx, type Availability, PassengerSpotAvailability }
