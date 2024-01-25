import { ReactEcsRenderer } from "@dcl/react-ecs";
import { Scene } from "./scene";
import  *  as  ui  from  'dcl-ui-toolkit'
import { setupUi } from "./UI/ui";
import * as utils from '@dcl-sdk/utils'

export function main() {
  setupUi() 

  const prompt = ui.createComponent(ui.FillInPrompt, {
    title: 'Enter password',
    onAccept: (value: string) => {
      if(value.toLocaleLowerCase()=="letsgo"){
        prompt.hide()
        utils.timers.setTimeout(function () {
          Scene.LoadScene() 
        }, 1000)
      } 
    },
  }) 
  
  prompt.show()

}
   