import { Scene } from "./scene";
import { setupUi } from "./UI/ui";
import { getRealm } from '~system/Runtime'
import { executeTask } from "@dcl/ecs";
import { DebugUI } from "./UI/debugUI";
import { Logger } from "@vegascity/vegas-city-logger"
import * as vegascity from "@vegascity/vegas-city-library/index"
import * as ecs from "@dcl/sdk/ecs"
import * as utils from '@dcl-sdk/utils'
import * as ui from 'dcl-ui-toolkit'

export function main() {
  vegascity.setup({
    ecs: ecs,
    Logger: Logger
  })

  setupUi()
 
  // wait for the realm and user data to be available
  vegascity.core.Helper.init(() => {
    vegascity.core.UserData.getUserData(() => {
      executeTask(async () => {
        const { realmInfo } = await getRealm({})
        if (realmInfo != undefined) {
          console.log(`You are in the realm: `, realmInfo.realmName)
          if (realmInfo.isPreview) {
            Scene.LoadScene()
            DebugUI.debugUIShow = true
          } else {
            showPrompt()
          }
        }
      })
    })
  })

  function showPrompt() {
    const prompt = ui.createComponent(ui.FillInPrompt, {
      title: 'Enter password',
      onAccept: (value: string) => {
        if (value.toLocaleLowerCase() == "letsgo") {
          prompt.hide()
          utils.timers.setTimeout(function () {
            Scene.LoadScene()
          }, 1000)
        } else if (value.toLocaleLowerCase() == "letsgodev") {
          prompt.hide()
          utils.timers.setTimeout(function () {
            Scene.LoadScene()
            DebugUI.debugUIShow = true
          }, 1000)
        }
      },
    })

    prompt.show()
  }

}