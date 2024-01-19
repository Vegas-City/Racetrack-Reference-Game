import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { CarUI } from '@vegascity/racetrack/src/ui'
import { Minimap } from '@vegascity/racetrack/src/ui'
import { DebugUI } from './debugUI'

const uiComponent = () => (
  [
    CarUI.Render(),
    Minimap.Render(),
    DebugUI.Render()
  ]
) 

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
} 