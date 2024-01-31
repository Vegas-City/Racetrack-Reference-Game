import { Scene } from "./scene";
import  *  as  ui  from  'dcl-ui-toolkit'
import { setupUi } from "./UI/ui";
import * as utils from '@dcl-sdk/utils'
import { getRealm } from '~system/Runtime'
import { executeTask } from "@dcl/ecs";
import { DebugUI } from "./UI/debugUI";

export function main() {
  setupUi() 

  executeTask(async () => {
    const { realmInfo } = await getRealm({})
    if(realmInfo!=undefined){
      console.log(`You are in the realm: `, realmInfo.realmName)
      if(realmInfo.isPreview){
        Scene.LoadScene() 
      } else {
        showPrompt()
      }
    }

  })

  function showPrompt(){ 
    const prompt = ui.createComponent(ui.FillInPrompt, {
      title: 'Enter password',
      onAccept: (value: string) => {
        if(value.toLocaleLowerCase()=="letsgo"){
          prompt.hide()
          utils.timers.setTimeout(function () {
            Scene.LoadScene() 
          }, 1000)
        } else if(value.toLocaleLowerCase()=="letsgodev"){
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