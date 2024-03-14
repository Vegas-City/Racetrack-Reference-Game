import { Scene } from "./scene";
import { setupUi } from "./UI/ui";
import { getRealm } from '~system/Runtime'
import { executeTask } from "@dcl/ecs";
import * as utils from '@dcl-sdk/utils'
import * as ui from 'dcl-ui-toolkit'
import * as ecs from "@dcl/sdk/ecs"
import { Helper, UserData } from "./Server/Helper";
import { NPCManager } from "./NPCs/NPCManager";
import { PartyManager } from "./party/partyManager";
import { IntervalLogger } from "@vegascity/vegas-city-logger/dist/logger/IntervalLogger";
import { AudioManager } from "./audio/audioManager";

const passwordProtected: boolean = true
const password: string = "letsgo"
const passwordDev: string = "letsgodev"

export function main() {
  setupUi()

  // wait for the realm and user data to be available
  Helper.init(() => {

    new IntervalLogger("RACETRACK", ecs.engine, ecs.Transform, 10)

    UserData.getUserData(() => {
      executeTask(async () => {
        Scene.LoadBuildings()
        utils.timers.setTimeout(() => {
          Scene.LoadScene()
          new PartyManager()
        }, 1500)
      })
    })

  })
}