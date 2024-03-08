import { DJ } from "./dj";
import { Schedule, ScheduleManager } from "./scheduleManager";

export class PartyManager{
    dj:DJ

    constructor(){

        ScheduleManager.instance.registerSchedule(
            new Schedule(
                Date.UTC(2024,2,17,8,0),
                Date.UTC(2024,2,17,8,30),
                ()=>{
                    this.dj = new DJ()
                },
                ()=>{
                    if(this.dj!=undefined){
                        this.dj.remove()
                    }
                }
            )
        )
    }
}