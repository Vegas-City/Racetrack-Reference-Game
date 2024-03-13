import { CrowdNPC } from "./crowdNPC";
import { EntranceNPC } from "./entranceNPC";
import { GuideNPC } from "./guideNPC";
import { PitstopNPC } from "./pitstopNPC";

export class NPCManager{
    constructor(){
        new GuideNPC()
        new EntranceNPC()
        new PitstopNPC()
        //new CrowdNPC() // have to move elsewhere because of password protection
    }
}