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

const passwordProtected: boolean = true
const password: string = "letsgo"
const passwordDev: string = "letsgodev"

export function main() {
  setupUi()
 
  // wait for the realm and user data to be available
  Helper.init(() => {

    new IntervalLogger("RACETRACK",ecs.engine,ecs.Transform,10)

    UserData.getUserData(() => {
      executeTask(async () => {
        const { realmInfo } = await getRealm({})
        if (realmInfo != undefined) {
          console.log(`You are in the realm: `, realmInfo.realmName)
          if (realmInfo.isPreview) {
            Scene.LoadBuildings()
            utils.timers.setTimeout(() => {
              Scene.LoadScene()
              new NPCManager()
              new PartyManager()
              DebugUI.debugUIShow = true
            }, 1500)
          }
          else {
            Scene.LoadBuildings()
            utils.timers.setTimeout(() => {
              Scene.LoadScene()
              if (passwordProtected) {
                showPrompt()
              }
              else {
                new NPCManager()
                new PartyManager()
              }
            }, 1500)
          }
        }
      })
    })
  })

  function showPrompt() {
    const prompt = ui.createComponent(ui.FillInPrompt, {
      title: 'Enter password',
      onAccept: (value: string) => {
        if (value.toLocaleLowerCase() == password) {
          prompt.hide()
        } else if (value.toLocaleLowerCase() == passwordDev) {
          prompt.hide()
          utils.timers.setTimeout(function () {
            new NPCManager()
            new PartyManager()
            DebugUI.debugUIShow = true
          }, 1000)
        }
      }
    })

    prompt.inputElement.onChange = (value: string) => {
      if (value.toLocaleLowerCase() == password) {
        prompt.hide()
        utils.timers.setTimeout(function () {
          new NPCManager()
          new PartyManager()
          prompt.hide()
        }, 1000)
      } else if (value.toLocaleLowerCase() == passwordDev) {
        prompt.hide()
        utils.timers.setTimeout(function () {
          new NPCManager()
          new PartyManager()
          prompt.hide()
          DebugUI.debugUIShow = true
        }, 1000)
      }
    }

    prompt.show()
  }
}