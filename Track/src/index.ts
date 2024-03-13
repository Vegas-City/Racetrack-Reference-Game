import { Scene } from "./scene";
import { setupUi } from "./UI/ui";
import { getRealm } from '~system/Runtime'
import { executeTask } from "@dcl/ecs";
import { DebugUI } from "./UI/debugUI";
import * as utils from '@dcl-sdk/utils'
import * as ui from 'dcl-ui-toolkit'
import * as ecs from "@dcl/sdk/ecs"
import { Helper, UserData } from "./Server/Helper";
import { NPCManager } from "./NPCs/NPCManager";
import { PartyManager } from "./party/partyManager";
import { IntervalLogger } from "@vegascity/vegas-city-logger/dist/logger/IntervalLogger";
import { AudioManager } from "./audio/audioManager";


export function main() {
  setupUi()

  // wait for the realm and user data to be available
  Helper.init(() => {

    new IntervalLogger("RACETRACK", ecs.engine, ecs.Transform, 10)

    UserData.getUserData(() => {
      executeTask(async () => {
        const { realmInfo } = await getRealm({})
        if (realmInfo != undefined) {
          console.log(`You are in the realm: `, realmInfo.realmName)
          Scene.LoadBuildings()
          utils.timers.setTimeout(() => {
            Scene.LoadScene()
            new PartyManager()
            if (realmInfo.isPreview) {
              DebugUI.debugUIShow = true
            }
          }, 1500)
          utils.timers.setTimeout(()=>{
            AudioManager.playMusic(4) // background music
          }, 3000)
        }
      })
    })
  })
}