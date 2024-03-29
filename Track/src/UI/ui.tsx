import ReactEcs, { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { SpeedometerUI, TimeUI, Countdown, ExitCarUI } from '@vegascity/racetrack/src/ui'
import { Minimap } from '@vegascity/racetrack/src/ui'
import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import { EventUIImage } from './eventUIImage'
import { PointsUi } from './pointsUi'
import { popup, shopUI } from '../utils/ui-provider'
import { NpcUtilsUi } from 'dcl-npc-toolkit'
import * as  ui from 'dcl-ui-toolkit'

const uiComponent = () => (
  [
    SpeedometerUI.Render(),
    TimeUI.Render(),
    Countdown.Render(),
    Minimap.Render(),
    EventUIImage.Render(),
    popup.render(),
    shopUI.render(),
    PointsUi.Render(),
    ExitCarUI.Render(),
    ui.render(),
    <NpcUtilsUi />
  ]
)

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(UIScaler)
}

function UIScaler() {
  let canvas = UiCanvasInformation.getMutableOrNull(engine.RootEntity)
  if (canvas) {
    UIDimensions.width = canvas.width
    UIDimensions.height = canvas.height
    UIDimensions.minScale = Math.min(canvas.width, canvas.height)
    UIDimensions.scaler = UIDimensions.minScale / 2000
  }
}

export let UIDimensions: any = {
  width: 0,
  height: 0,
  minScale: 0,
  scaler: 0
} 