import { CrowdNPC } from "./crowdNPC";
import { EntranceNPC } from "./entranceNPC";
import { GuideNPC } from "./guideNPC";
import { PitstopNPC } from "./pitstopNPC";

export class NPCManager{
    constructor(){
        try {
        new GuideNPC()
        new EntranceNPC()
        new PitstopNPC()
        } catch (error){
            console.log("NPC creation error: " + error)
        }
    }
}