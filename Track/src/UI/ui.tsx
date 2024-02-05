import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { SpeedometerUI, LapUI } from '@vegascity/racetrack/src/ui'
import { Minimap } from '@vegascity/racetrack/src/ui'
import { DebugUI } from './debugUI'
import { TrackSelectorUI } from './trackSelectorUI'
import { Countdown } from '@vegascity/racetrack/src/racetrack'
import  *  as  ui  from  'dcl-ui-toolkit'

const uiComponent = () => (
  [
    SpeedometerUI.Render(),
    LapUI.Render(),
    TrackSelectorUI.Render(),
    Minimap.Render(),
    Countdown.Render(),
    DebugUI.Render(),
    ui.render()
  ]
)  

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
} 