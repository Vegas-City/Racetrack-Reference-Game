import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { SpeedometerUI, LapUI } from '@vegascity/racetrack/src/ui'
import { Minimap } from '@vegascity/racetrack/src/ui'
import { DebugUI } from './debugUI'
import { TrackSelectorUI } from './trackSelectorUI'
import { Countdown } from '@vegascity/racetrack/src/racetrack'
import  *  as  ui  from  'dcl-ui-toolkit'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { CarSelectionUI } from './carSelectionUI'

const uiComponent = () => (
  [
    SpeedometerUI.Render(),
    LapUI.Render(),
    TrackSelectorUI.Render(),
    Minimap.Render(),
    Countdown.Render(),
    DebugUI.Render(),
    ui.render(),
    CarSelectionUI.Render()
  ]
)  

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(UIScaler)
} 

function UIScaler(){
  let canvas = UiCanvasInformation.get(engine.RootEntity)
  UIDimensions.width = canvas.width
  UIDimensions.height = canvas.height
  UIDimensions.minScale = Math.min(canvas.width,canvas.height)
  UIDimensions.scaler = UIDimensions.minScale/2000
}

export let UIDimensions:any = {
  width:0,
  height:0,
  minScale: 0,
  scaler: 0
}