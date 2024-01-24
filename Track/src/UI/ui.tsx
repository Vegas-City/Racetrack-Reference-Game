import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { CarUI, LapUI } from '@vegascity/racetrack/src/ui'
import { Minimap } from '@vegascity/racetrack/src/ui'
import { DebugUI } from './debugUI'
import { TrackSelectorUI } from './trackSelectorUI'

const uiComponent = () => (
  [
    CarUI.Render(),
    LapUI.Render(),
    DebugUI.Render(),
    TrackSelectorUI.Render()
  ]
  //Minimap.Render(),
)  

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
} 