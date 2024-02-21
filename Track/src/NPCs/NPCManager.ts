import { EntranceNPC } from "./entranceNPC";
import { GuideNPC } from "./guideNPC";
import { PitstopNPC } from "./pitstopNPC";

export class NPCManager{
    constructor(){
        new GuideNPC()
        new EntranceNPC()
        new PitstopNPC()
    }
}