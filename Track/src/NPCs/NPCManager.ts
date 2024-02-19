import { EntranceNPC } from "./entranceNPC";
import { GuideNPC } from "./guideNPC";

export class NPCManager{
    constructor(){
        new GuideNPC()
        new EntranceNPC()
    }
}